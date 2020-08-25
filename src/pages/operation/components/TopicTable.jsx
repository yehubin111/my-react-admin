import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import styles from "./comp.module.scss";
import { requestTopicSpuList, requestSaveTopicSpuSort, requestSaveTopicSpuDel } from "service/operation";

import { Table, Space, Button, Empty, Spin, message, Popconfirm } from "antd";
import { CloseOutlined, MinusOutlined } from "@ant-design/icons";
import CardGrid from "./CardGrid";

const TopicTable = props => {
    const { dataSource, pagination, loading, scroll } = props;
    const [topicProducts, setTopicProducts] = useState({});
    const [loadingList, setLoadingList] = useState({});
    const [sortStatusList, setSortStatusList] = useState({});
    const [delProductList, setDelProductList] = useState({});

    const columns = [
        {
            title: "编号",
            dataIndex: "id"
        },
        {
            title: "专题名称",
            dataIndex: "topicName"
        },
        {
            title: "显示售罄商品",
            dataIndex: "topicName",
            render: (text, record) => {
                return record.showsOut === 1 ? "是" : "否"
            }
        },
        {
            title: "可售商品数量",
            dataIndex: "sellNum"
        },
        {
            title: "商品数量",
            dataIndex: "goodsNum"
        },
        {
            title: "操作",
            dataIndex: "actions",
            render: (text, record) => (
                <Space size="middle">
                    <span className="button">预览</span>
                    <span className="button">编辑</span>
                    <span className="button">添加商品</span>
                    <span className="button">删除</span>
                    <span className="button">清除全部商品</span>
                </Space>
            )
        }
    ]
    const getDataList = (topicId) => {
        // loading
        setLoadingList({
            ...loadingList,
            [topicId]: true
        })
        requestTopicSpuList({ topicId })
            .then(response => {
                let list = response.list;
                list.forEach(product => {
                    product.statusName = [
                        product.shelfStatus === 0 ? "下架" : "",
                        product.sellOutStatus === 0 ? "售罄" : ""
                    ].filter(v => v).join("/");
                })
                setTopicProducts({
                    ...topicProducts,
                    [topicId]: response.list
                })
                setLoadingList({
                    ...loadingList,
                    [topicId]: false
                })
                setSortStatusList({
                    ...sortStatusList,
                    [topicId]: false
                })
                setDelProductList({
                    ...delProductList,
                    [topicId]: []
                })
            })
    }
    // 删除商品
    const toDelProduct = (topicId, productId) => {
        let products = topicProducts[topicId];
        let product = products.find(product => product.id === productId);
        product.del = !product.del;
        let delProducts = products.filter(product => product.del);

        // 更新商品列表数据
        setTopicProducts({
            ...topicProducts,
            [topicId]: products
        })
        // 更新商品待删除状态
        setDelProductList({
            ...delProductList,
            [topicId]: delProducts
        })
    }
    const toSaveDel = (topicId) => {
        let products = delProductList[topicId];
        let payload = {
            id: topicId,
            ids: products.map(product => product.id).join(",")
        }
        requestSaveTopicSpuDel(payload)
            .then(() => {
                message.success(`删除成功`);
                getDataList(topicId);
            })
    }
    // 保存排序
    const toSaveSort = (topicId) => {
        let products = topicProducts[topicId];
        let payload = {
            spus: products.map((product, index) => ({ id: product.id, sort: products.length - index }))
        };
        requestSaveTopicSpuSort(payload)
            .then(() => {
                message.success(`排序成功`);
                setSortStatusList({
                    ...sortStatusList,
                    [topicId]: false
                })
            })
    }
    // 拖动排序
    const moveCard = useCallback((dragIndex, hoverIndex, topicId) => {
        let topicProduct = topicProducts[topicId];
        let drag = topicProduct[dragIndex];
        topicProduct.splice(dragIndex, 1);
        topicProduct.splice(hoverIndex, 0, drag);
        // 更新列表数据
        setTopicProducts({
            ...topicProducts,
            [topicId]: topicProduct
        })
        // 有位置变化之后，显示重置和保存按钮
        setSortStatusList({
            ...sortStatusList,
            [topicId]: true
        })
    }, [topicProducts])
    const expandedRowRender = (record) => {
        let data = topicProducts[record.id];
        let loading = loadingList[record.id];
        let moved = sortStatusList[record.id];
        let deled = delProductList[record.id];

        // console.log(data);
        return (
            <>
                <div className={`rf ac jsb ${styles.addsec}`}>
                    <p>拖拉商品图片可调整商品展示顺序</p>
                    {
                        moved && <Space size="middle">
                            <Button onClick={() => {
                                getDataList(record.id)
                            }}>重置</Button>
                            <Button type="primary" onClick={() => {
                                toSaveSort(record.id);
                            }}>保存当前排序</Button>
                        </Space>
                    }
                    <Space size="middle">
                        {
                            (deled && deled.length > 0) && <>
                                <p>当前待删除商品：{deled.length}件</p>
                                <Button onClick={() => {
                                    getDataList(record.id)
                                }}>取消</Button>
                                <Popconfirm placement="topRight" title="是否删除该banner"
                                    onConfirm={() => {
                                        toSaveDel(record.id);
                                    }} okText="是" cancelText="否">
                                    <Button type="primary">确认删除</Button>
                                </Popconfirm>
                            </>
                        }
                        <Button danger>一键清空无库存和已下架商品</Button>
                    </Space>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <div className={styles.cardBox}>
                        <Spin spinning={loading}>
                            {
                                data && data.length > 0
                                    ? <div className={styles.card}>
                                        {
                                            data.map((product, index) => (
                                                <CardGrid
                                                    moveCard={moveCard}
                                                    index={index}
                                                    key={product.id}
                                                    product={product.id}
                                                    topicId={record.id}
                                                >
                                                    <div className={`rf ac jc ${styles.box} ${product.del && styles.boxDel}`} style={{ opacity: product.statusName ? .3 : 1 }}>
                                                        <img src={product.mainPicAddress} width="100" />
                                                        {
                                                            product.statusName && <p className={styles.status}>{product.statusName}</p>
                                                        }
                                                        <span className={`rf ac jc ${styles.close}`} onClick={() => {
                                                            toDelProduct(record.id, product.id);
                                                        }}>
                                                            {product.del
                                                                ? <MinusOutlined className={styles.icon} />
                                                                : <CloseOutlined className={styles.icon} />}
                                                        </span>
                                                    </div>
                                                </CardGrid>
                                            ))
                                        }
                                    </div>
                                    : <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            }
                        </Spin>
                    </div>
                </DndProvider>
            </>
        )
    }
    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                scroll={scroll}
                expandable={{
                    expandedRowRender,
                    onExpand: (expanded, record) => {
                        if (expanded === true) {
                            getDataList(record.id)
                        }
                    }
                }}
            />
            {/* <DndProvider backend={HTML5Backend}>
                {
                    cards.map((product, index) => (
                        <CardGrid
                            moveCard={moveCard}
                            index={index}
                            key={product.id}
                            id={product.id}
                            text={product.text}
                        >
                        </CardGrid>
                    ))
                }
            </DndProvider> */}
        </>
    )
}

export default TopicTable;