import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './comp.module.scss';
import { wrapContext } from "utils/context";
import { requestOrderCancel } from "service/order";

import { Table, Descriptions, Pagination, Spin, Empty, Space, Popconfirm, message } from 'antd';
import ImageView from "components/ImageView";
import ManageReceiverInfo from "./ManageReceiverInfo"
import ManageConfirmPay from "./ManageConfirmPay";
import ManageLogisticsView from "./ManageLogisticsView";

const OrderTable = (props) => {
    const { childExceptionStatusList, orderStatusList, dataSource, pagination, loading, onInit } = props;
    const [viewImages, setViewImages] = useState([]);
    const [viewStatus, changeViewStatus] = useState(false);
    const [orderList, changeOrderList] = useState([]);
    const [receiverStatus, changeReceiverStatus] = useState(false);
    const [receiverInfo, setReceiverInfo] = useState({});
    const [payStatus, changePayStatus] = useState(false);
    const [payOrderId, setPayOrderId] = useState(0);
    const [logisticsStatus, changeLogisticsStatus] = useState(false);
    const [logisticsOrderId, setLogisticsOrderId] = useState(0);
    const global = useContext(wrapContext);

    const columns = [
        {
            title: "缩略图",
            dataIndex: "mainPicAddress",
            key: "mainPicAddress",
            render: (text, record) => {
                let images = record.mainPicAddress.split(',');
                return <img alt="" src={images[0] + '?imageView2/0/w/100'} width="100" onClick={() => {
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
                    mainOredrCtrl: orderStatus ? orderStatus.ctrl : [],
                    mainIsRefundName: refundStatus ? refundStatus.label : "",
                    receiverName: data.receiverName,
                    receiverPhone: data.receiverPhone,
                    receiverProvince: data.receiverProvince,
                    receiverCity: data.receiverCity,
                    receiverRegion: data.receiverRegion,
                    receiverAddress: data.receiverAddress,
                    orderId: data.orderid,
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

    const toCancelOrder = orderId => {
        let payload = { orderId };
        requestOrderCancel(payload)
            .then(() => {
                message.success("取消成功");
                onInit();
            })
    }
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
                                            setReceiverInfo({
                                                receiverName: order.receiverName,
                                                receiverPhone: order.receiverPhone,
                                                receiverProvince: order.receiverProvince,
                                                receiverCity: order.receiverCity,
                                                receiverRegion: order.receiverRegion,
                                                receiverAddress: order.receiverAddress,
                                                orderId: order.orderid
                                            });
                                            changeReceiverStatus(true);
                                        }}>查看详情</span>
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="下单账号">{order.phone}</Descriptions.Item>
                                <Descriptions.Item label="实付金额">￥{order.totalFee}</Descriptions.Item>
                                <Descriptions.Item label="订单时间">{order.createTime}</Descriptions.Item>
                                <Descriptions.Item label="操作">
                                    <Space size="middle">
                                        {order.mainOredrCtrl.includes("refund") && <span className="button" onClick={() => {

                                        }}>退款</span>}
                                        {order.mainOredrCtrl.includes("pay") && <span className="button" onClick={() => {
                                            setPayOrderId(order.orderId);
                                            changePayStatus(true);
                                        }}>订单已付款</span>}
                                        {order.mainOredrCtrl.includes("cancel") && <Popconfirm placement="topRight" title="确定要取消订单吗？取消后，订单状态变为已取消，订单不再支持付款"
                                            onConfirm={() => {
                                                toCancelOrder(order.orderId);
                                            }} okText="是" cancelText="否">
                                            <span className="button">取消订单</span>
                                        </Popconfirm>}
                                        {order.mainOredrCtrl.includes("logistics") && <span className="button" onClick={() => {
                                            setLogisticsOrderId(order.orderId);
                                            changeLogisticsStatus(true);
                                        }}>查看物流</span>}
                                    </Space>
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
            <Pagination className={styles.pagination} {...pagination} />
            <ImageView images={viewImages} visible={viewStatus} onCancel={() => {
                changeViewStatus(false);
            }} />
            <ManageReceiverInfo visible={receiverStatus} receiver={receiverInfo} onCancel={() => {
                setReceiverInfo({})
                changeReceiverStatus(false);
            }} onOk={() => {
                onInit();
            }} />
            <ManageConfirmPay visible={payStatus} orderId={payOrderId} onCancel={() => {
                changePayStatus(false);
            }} onOk={() => {
                onInit();
            }} />
            <ManageLogisticsView visible={logisticsStatus} orderId={logisticsOrderId} onCancel={() => {
                changeLogisticsStatus(false);
            }} />
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