import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './comp.module.scss';
import { wrapContext } from "utils/context";

import { Table, Descriptions, Pagination, Spin, Empty, Space } from 'antd';
import ImageView from "components/ImageView";

const OrderTable = (props) => {
    const { childExceptionStatusList, orderStatusList, dataSource, pagination, loading } = props;
    const [viewImages, setViewImages] = useState([]);
    const [viewStatus, changeViewStatus] = useState(false);
    const [orderList, changeOrderList] = useState([]);
    const global = useContext(wrapContext);

    const columns = [
        // {
        //     title: "主订单信息",
        //     dataIndex: "main",
        //     key: "main",
        //     render: (text, record, index) => {
        //         const obj = {
        //             children: 1,
        //             props: {}
        //         }
        //         if (index === 0) {
        //             obj.props.rowSpan = 3;
        //         }
        //         if (index === 1) {
        //             obj.props.rowSpan = 0;
        //         }
        //         if (index === 2) {
        //             obj.props.rowSpan = 0;
        //         }
        //         // if (index === 2) {
        //         //     obj.rowSpan = 0;
        //         // }
        //         return obj;
        //     },
        //     width: 200
        // },
        {
            title: "缩略图",
            dataIndex: "mainPicAddress",
            key: "mainPicAddress",
            render: (text, record) => {
                let images = record.mainPicAddress.split(',');
                return <img src={images[0] + '?imageView2/0/w/100'} width="100" onClick={() => {
                    setViewImages(images);
                    changeViewStatus(true);
                }} />
            },
            width: 140
        },
        {
            title: "商品信息",
            dataIndex: "info",
            key: "info",
            render: (text, record) => {
                return (
                    <>
                        <p className={styles.baseinfo}>商品名称：{record.spuName}</p>
                        <p className={styles.baseinfo}>商品ID：{record.id}</p>
                        <p className={styles.baseinfo}>BARCODE：{record.barcode}</p>
                        <p className={styles.baseinfo}>原厂货号：{record.manufactureCode}</p>
                        <p className={styles.baseinfo}>品牌：{record.brandName}</p>
                        <p className={styles.baseinfo}>类目：{record.categoryName}</p>
                    </>
                )
            }
        },
        {
            title: "采购数量",
            dataIndex: "num",
            key: "num",
            width: 100
        },
        {
            title: "商品成本价（￥）",
            dataIndex: "supplyPrice",
            key: "supplyPrice",
            width: 160
        },
        {
            title: "商品售价（￥）",
            dataIndex: "sellPrice",
            key: "sellPrice",
            width: 140
        },
        {
            title: "总价（￥）",
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: 120,
            render: (text, record) => (record.sellPrice * record.num).toFixed(2)
        },
        {
            title: "缺货数量",
            dataIndex: "outOfStock",
            key: "outOfStock",
            width: 120
        },
        {
            title: "退款数量",
            dataIndex: "refundNum",
            key: "refundNum",
            width: 120
        },
        {
            title: "退款状态",
            dataIndex: "isRefund",
            key: "isRefund",
            render: (text, record) => {
                let isRefund = childExceptionStatusList.find(status => status.value === record.isRefund)
                return isRefund.label
                    + (record.isRefund === 1 || record.isRefund === 3
                        ? '：￥' + record.refundFee
                        : '')
            },
            width: 120
        }
    ]

    useEffect(() => {
        let list = [];
        dataSource.forEach(data => {
            let father = list.find(order => order.mainOrderCode === data.mainOrderCode);
            if (!father) {
                let orderStatus = orderStatusList.find(status => status.value === data.orderStatus);
                let refundStatus = childExceptionStatusList.find(status => status.value === data.isRefund)
                // let refundstatus = state.exceptionStatusArray.find(v => v.value == obj.mainIsRefund);
                // let pay = state.payType.find(v => v.key == obj.payType);
                father = {
                    mainOrderCode: data.mainOrderCode,
                    mainOrderStatusName: orderStatus ? orderStatus.label : "",
                    mainIsRefundName: refundStatus ? refundStatus.label : "",
                    receiverName: data.receiverName,
                    phone: data.phone,
                    totalFee: data.totalFee,
                    createTime: moment(data.createTime).format("YYYY-MM-DD HH:mm:ss"),
                    orderDetailList: []
                }
                list.push(father);
            }
            father.orderDetailList.push(data);
        })
        changeOrderList(list);
    }, [dataSource])

    return (
        <>
            <Spin spinning={loading}>
                {
                    orderList.length > 0 ? orderList.map(order => (
                        <div className={styles.order} key={order.mainOrderCode}>
                            <Descriptions bordered size="small" layout={global.device === "h5" ? "vertical" : "horizontal"} column={{ xs: 1, sm: 2, lg: 3, xxl: 4 }}>
                                <Descriptions.Item label="订单号">
                                    <span className={styles.code}>{order.mainOrderCode}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="订单状态">
                                    <span className={styles.status}>{order.mainOrderStatusName}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="退款状态">
                                    <span className={styles.status}>{order.mainIsRefundName}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="收货人">
                                    <Space size="middle">
                                        {order.receiverName}
                                        <span className="button" onClick={() => {

                                        }}>查看详情</span>
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="下单账号">{order.phone}</Descriptions.Item>
                                <Descriptions.Item label="实付金额">￥{order.totalFee}</Descriptions.Item>
                                <Descriptions.Item label="订单时间">{order.createTime}</Descriptions.Item>
                                <Descriptions.Item label="操作">
                                    <span className="button" onClick={() => {

                                    }}>退款</span>
                                </Descriptions.Item>
                            </Descriptions>
                            <Table
                                dataSource={order.orderDetailList}
                                columns={columns}
                                pagination={false}
                                size="small"
                                className={styles["ant-table-container"]}
                                // pagination={pagination}
                                // loading={loading}
                                scroll={{
                                    x: 1350
                                }}
                                rowKey="orderDetailId"
                            />
                        </div>
                    )) : <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </Spin>
            <ImageView images={viewImages} visible={viewStatus} onCancel={() => {
                changeViewStatus(false);
            }} />
            <Pagination className={styles.pagination} {...pagination} />
        </>
    )
}

const mapStateToProps = state => {
    return {
        childExceptionStatusList: state.childExceptionStatusList,
        orderStatusList: state.orderStatusList
    }
}

export default connect(mapStateToProps, {})(OrderTable);