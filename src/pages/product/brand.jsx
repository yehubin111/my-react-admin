import React, { useState, useRef } from "react";

import { requestBrandList, requestUpdateBrand } from "service/product";

import { Button, Space, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainTable from "components/MainTable";
import AddBrand from "./components/AddBrand";

const Brand = props => {
    const [addStatus, changeAddStatus] = useState(false);
    const [editData, setEditData] = useState({});
    const tableRef = useRef();

    const getListData = (payload) => {
        return requestBrandList(payload)
    }
    const filterConfig = [
        {
            label: "品牌英文名",
            type: "input",
            name: "brandNameEng"
        },
        {
            label: "品牌中文名",
            type: "input",
            name: "brandNameCh"
        }
    ]
    const columns = [
        {
            title: "品牌ID",
            dataIndex: "id"
        },
        {
            title: "品牌英文名",
            dataIndex: "nameEn"
        },
        {
            title: "品牌中文名",
            dataIndex: "nameZh"
        },
        {
            title: "操作",
            dataIndex: "actions",
            render: (text, record) => (
                <Space size="middle">
                    <span className="button" onClick={() => {
                        setEditData(record);
                        changeAddStatus(true);
                    }}>编辑</span>
                    <Popconfirm placement="topRight" title="是否删除该banner"
                        onConfirm={() => {
                            let payload = {
                                delStatus: 1,
                                id: record.id
                            }
                            requestUpdateBrand(payload)
                                .then(() => {
                                    message.success("删除成功");
                                    tableRef.current.reload();
                                })
                        }} okText="是" cancelText="否">
                        <span className="button">删除</span>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    return <>
        <MainTable
            tableRef={tableRef}
            filterConfig={filterConfig}
            headerCtrl={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    changeAddStatus(true);
                }}>
                    新增品牌
            </Button>
            }
            onRequest={payload => getListData(payload)}
            tableConfig={{
                columns,
                rowKey: "id"
            }}
        />
        <AddBrand visible={addStatus} editData={editData} onOk={() => {
            tableRef.current.reload();
        }} onCancel={() => {
            setEditData({});
            changeAddStatus(false);
        }} />
    </>
}

export default Brand;