import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { requestBannerList, requestBannerSort, requestChangeBannerStatus } from "service/operation";

import { Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import TableFilter from "components/TableFilter";
// import TableHeader from "components/TableHeader";
// import EditTable from "components/EditTable";
import MainTable from "components/MainTable";
import ImageView from "components/ImageView";
import AddBanner from "./components/AddBanner";

const Banner = (props) => {
    const { bannerStatus } = props;
    // const [payload, setPayload] = useState({
    //     isBanner: 0,
    //     pageIndex: 1,
    //     pageSize: 20
    // })
    const [addStatus, changeAddStatus] = useState(false);
    const [editData, setEditData] = useState({});
    const [viewImages, setViewImages] = useState([]);
    const [viewStatus, changeViewStatus] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const tableRef = useRef();

    const getListData = payload => {
        payload.isBanner = 0;
        return requestBannerList(payload);
    }
    const handleEditChange = (data) => {
        setDataSource(data);
    }
    const setSort = () => {
        let params = {
            columns: dataSource.map(banner => ({ id: banner.id, sort: banner.sort }))
        };
        requestBannerSort(params)
            .then(() => {
                message.success("保存排序成功");
                tableRef.current.reload();
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
                tableRef.current.reload();
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
                tableRef.current.reload();
            })
    }

    const filterConfig = [
        {
            label: "banner名称",
            placeholder: "",
            type: "input",
            name: "columnTitle"
        },
        {
            label: "状态",
            placeholder: "",
            type: "select",
            name: "shelfStatus",
            data: bannerStatus
        }
    ]
    const columns = [
        {
            title: "编号",
            dataIndex: "id"
        },
        {
            title: "排序",
            dataIndex: "sort",
            editable: true,
            width: 100
        },
        {
            title: "图片",
            dataIndex: "columnPic",
            render: (text, record) => {
                let images = record.columnPic.split(',');
                return <img alt="" src={images[0]} width="100" onClick={() => {
                    setViewImages(images);
                    changeViewStatus(true);
                }} />
            }
        },
        {
            title: "banner名称",
            dataIndex: "columnTitle"
        },
        {
            title: "展示时间",
            dataIndex: "showTimeFormat",
            render: (text, record) => `${moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')} 至 ${moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}`
        },
        {
            title: "绑定专题",
            dataIndex: "bindTopic"
        },
        {
            title: "上下架",
            dataIndex: "shelfStatusName",
            render: (text, record) => bannerStatus.find(status => status.value === record.shelfStatus).label
        },
        {
            title: "操作",
            dataIndex: "ctrl",
            render: (text, record) => (
                <Space size="middle">
                    <span className="button" onClick={() => {
                        setEditData(record);
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
            key: "modifyTimeFormat",
            render: (text, record) => moment(record.modifyTime).format('YYYY-MM-DD HH:mm:ss')
        }
    ];
    return (
        <>
            <MainTable
                tableRef={tableRef}
                filterConfig={filterConfig}
                headerCtrl={
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
                }
                onRequest={payload => getListData(payload)}
                tableConfig={{
                    scroll: {
                        x: 1300
                    },
                    columns: columns,
                    rowKey: "id",
                    onEditChange: handleEditChange
                }}
            />
            {/* <TableFilter config={filterConfig} onSearch={(values) => {
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
            /> */}
            <ImageView images={viewImages} visible={viewStatus} onCancel={() => {
                changeViewStatus(false);
            }} />
            <AddBanner visible={addStatus} editData={editData} onCancel={() => {
                setEditData({});
                changeAddStatus(false)
            }} onOk={() => {
                tableRef.current.reload();
            }} />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        bannerStatus: state.bannerStatus,
        // bannerList: state.bannerList
    }
}

export default connect(mapStateToProps, {})(Banner);