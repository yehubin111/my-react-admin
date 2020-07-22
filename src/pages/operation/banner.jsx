import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { saveBannerList } from "actions";
import { requestBannerList, requestBannerSort, requestChangeBannerStatus } from "service/operation";

import { Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableFilter from "components/TableFilter";
import TableHeader from "components/TableHeader";
import EditTable from "components/EditTable";
import ImageView from "components/ImageView";
import AddBanner from "./components/AddBanner";

const Banner = (props) => {
    const { bannerStatus, bannerList: { list: dataSource, total }, saveBannerList } = props;
    const [payload, setPayload] = useState({
        isBanner: 0,
        pageIndex: 1,
        pageSize: 20
    })
    const [addStatus, changeAddStatus] = useState(false);
    const [editId, setEditId] = useState("");
    const [viewImages, setViewImages] = useState([]);
    const [viewStatus, changeViewStatus] = useState(false);

    const getListData = async (payload) => {
        const response = await requestBannerList(payload);
        if (response)
            saveBannerList(response)
    }
    const handleEditChange = (row) => {
        const newData = [...dataSource];
        const bannerIndex = newData.findIndex(banner => banner.id === row.id);
        newData.splice(bannerIndex, 1, row);
        // 更新本地数据sort值
        saveBannerList({
            list: newData,
            total
        })
    }
    const setSort = () => {
        let params = {
            columns: dataSource.map(banner => ({ id: banner.id, sort: banner.sort }))
        };
        requestBannerSort(params)
            .then(() => {
                message.success("保存排序成功");
                getListData(payload);
            });
    }
    const changeStatus = (status, id) => {
        let params = {
            id,
            shelfStatus: status,
            isBanner: 0
        }
        requestChangeBannerStatus(params)
            .then(() => {
                message.success(`${status === 1 ? '上架' : '下架'}成功`);
                getListData(payload);
            })
    }
    const toDelBanner = (id) => {
        let payload = {
            id,
            delStatus: 1,
            isBanner: 0
        }
        requestChangeBannerStatus(payload)
            .then(() => {
                message.success('删除成功');
                getListData(payload);
            })
    }

    useEffect(() => {
        getListData(payload);
    }, [])

    const filterConfig = [
        {
            title: "banner名称",
            placeholder: "",
            type: "input",
            key: "columnTitle"
        },
        {
            title: "状态",
            placeholder: "",
            type: "select",
            key: "shelfStatus",
            data: bannerStatus
        }
    ]
    const columns = [
        {
            title: "编号",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "排序",
            dataIndex: "sort",
            key: "sort",
            editable: true,
            width: 100
        },
        {
            title: "图片",
            dataIndex: "phone",
            key: "phone",
            render: (text, record) => {
                return <img src={record.columnPic} width="100" onClick={() => {
                    let images = record.columnPic.split(',');
                    setViewImages(images);
                    changeViewStatus(true);
                }} />
            }
        },
        {
            title: "banner名称",
            dataIndex: "columnTitle",
            key: "columnTitle"
        },
        {
            title: "展示时间",
            dataIndex: "showTimeFormat",
            key: "showTimeFormat"
        },
        {
            title: "绑定专题",
            dataIndex: "bindTopic",
            key: "bindTopic"
        },
        {
            title: "上下架",
            dataIndex: "shelfStatusName",
            key: "shelfStatusName"
        },
        {
            title: "操作",
            dataIndex: "ctrl",
            key: "ctrl",
            render: (text, record) => (
                <Space size="middle">
                    <span className="button" onClick={() => {
                        setEditId(record.id);
                        changeAddStatus(true)
                    }}>编辑</span>
                    <Popconfirm placement="topRight" title={`是否${record.shelfStatus === 1 ? "下架" : "上架"}该banner`}
                        onConfirm={() => {
                            changeStatus(Number(!record.shelfStatus), record.id);
                        }} okText="是" cancelText="否">
                        <span className="button">{record.shelfStatus === 1 ? "下架" : "上架"}</span>
                    </Popconfirm>
                    <Popconfirm placement="topRight" title="是否删除该banner"
                        onConfirm={() => {
                            toDelBanner(record.id)
                        }} okText="是" cancelText="否">
                        <span className="button">删除</span>
                    </Popconfirm>
                </Space>
            )
        },
        {
            title: "操作时间",
            dataIndex: "modifyTimeFormat",
            key: "modifyTimeFormat"
        }
    ];
    return (
        <>
            <TableFilter config={filterConfig} onSearch={(values) => {
                let options = {
                    ...payload,
                    ...values
                }
                setPayload(options);
                getListData(options);
            }} />
            <TableHeader ctrl={
                <Space size="middle">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        changeAddStatus(true)
                    }}>
                        新增banner
                    </Button>
                    <Button type="primary" onClick={() => {
                        setSort();
                    }}>
                        保存排序
                    </Button>
                </Space>
            } />
            <EditTable
                dataSource={dataSource}
                columns={columns}
                scroll={{
                    x: 1300
                }}
                rowKey="id"
                onEditChange={handleEditChange}
                pagination={{
                    pageSize: payload.pageSize,
                    total,
                    current: payload.pageIndex,
                    showTotal: total => `共 ${total} 条`,
                    onChange: (page, pageSize) => {
                        payload.pageIndex = page;
                        payload.pageSize = pageSize;
                        setPayload(payload);
                        getListData(payload);
                    }
                }}
            />
            <ImageView images={viewImages} visible={viewStatus} onCancel={() => {
                changeViewStatus(false);
            }} />
            <AddBanner visible={addStatus} editId={editId} onCancel={() => {
                setEditId("");
                changeAddStatus(false)
            }} onOk={() => {
                getListData(payload);
            }} />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        bannerStatus: state.bannerStatus,
        bannerList: state.bannerList
    }
}

export default connect(mapStateToProps, { saveBannerList })(Banner);