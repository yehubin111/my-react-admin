import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from "./comp.module.scss";
import { requestProductAudit, requestProductStand } from "service/product";

import { Table, Popconfirm, Space, message } from "antd";
import ImageView from "components/ImageView";


const ManageTable = props => {
    const { pageSize, pageIndex,
        onInit,
        loading,
        onPaginationChange,
        selectedRowKeys,
        onSelect,
        history,
        productData: { total, list: dataSource }, statusList } = props;
    const [viewImages, setViewImages] = useState([]);
    const [viewStatus, changeViewStatus] = useState(false);
    // const [selectedRowKeys, changeSelectedRowKeys] = useState([]);

    // 上下架
    const toChangeProductStatus = async (status, id) => {
        let payload = {
            isStand: status,
            ids: id
        };
        if (status === 0) {
            await requestProductStand(payload);
        } else {
            await requestProductAudit(payload);
        }
        message.success(`${status === 0 ? '上架' : '下架'}成功`);
        // 重置列表数据
        onInit();
    }
    const columns = [
        {
            title: "图片",
            dataIndex: "mainPicAddressImage",
            key: "mainPicAddressImage",
            render: (text, record) => {
                return <img src={record.mainPicAddressImage} width="100" onClick={() => {
                    let images = record.mainPicAddress.split(',');
                    setViewImages(images);
                    changeViewStatus(true);
                }} />
            }
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
            title: "采购价",
            dataIndex: "supplierSupplyPrice",
            key: "supplierSupplyPrice"
        },
        {
            title: "市场价",
            dataIndex: "supplierMarketPrice",
            key: "supplierMarketPrice"
        },
        {
            title: "售价",
            dataIndex: "sellPrice",
            key: "sellPrice"
        },
        {
            title: "库存",
            dataIndex: "storeNumber",
            key: "storeNumber"
        },
        {
            title: "季节",
            dataIndex: "season",
            key: "season"
        },
        {
            title: "发货仓库",
            dataIndex: "storage",
            key: "storage"
        },
        {
            title: "商品状态",
            dataIndex: "status",
            key: "status",
            render: (text, record) => {
                let status = statusList.find(status => status.key === record.shelfStatus);
                return <span>{status ? status.name : ""}</span>
            }
        },
        {
            title: "创建时间/上架时间",
            dataIndex: "time",
            key: "time",
            render: (text, record) => {
                return <>
                    <p>{record.createTime}</p>
                    <p>{record.publishTime}</p>
                </>
            }
        },
        {
            title: "操作",
            dataIndex: "ctrl",
            key: "ctrl",
            render: (text, record) => (
                <Space size="middle">
                    <span className="button" onClick={() => {
                        history.push("/product/public?id=" + record.id);
                    }}>编辑</span>
                    <Popconfirm placement="topRight" title={`是否${record.shelfStatus === 1 ? "下架" : "上架"}该商品`}
                        onConfirm={() => {
                            toChangeProductStatus(record.shelfStatus, record.id);
                        }} okText="是" cancelText="否">
                        <span className="button">{record.shelfStatus === 1 ? "下架" : "上架"}</span>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            onSelect(keys);
        }
    }
    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowSelection={rowSelection}
                scroll={{
                    x: 1500
                }}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize,
                    total,
                    current: pageIndex,
                    showTotal: total => `共 ${total} 条`,
                    onChange: (page, pageSize) => {
                        onPaginationChange({
                            pageIndex: page,
                            pageSize
                        })
                    }
                }}
            />
            <ImageView images={viewImages} visible={viewStatus} onCancel={() => {
                changeViewStatus(false);
            }} />
        </>
    )
}

const mapStatetoProps = state => {
    return {
        productData: state.productData,
        statusList: state.statusList
    }
}

export default connect(mapStatetoProps, {})(withRouter(ManageTable));