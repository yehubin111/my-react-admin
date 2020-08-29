import React, { useState, useRef } from "react";

import { requestRulesList, requestUpdateRule } from "service/product";

import { Button, Space, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainTable from "components/MainTable";
import AddRule from "./components/AddRule";

const Rule = props => {
    const [addStatus, changeAddStatus] = useState(false);
    const [editData, setEditData] = useState({});
    const tableRef = useRef();
    const getListData = (payload) => {
        return requestRulesList(payload)
    }
    const filterConfig = [
        {
            label: "采购规则名称",
            type: "input",
            name: "searchName"
        }
    ]
    const columns = [
        {
            title: "采购规则名称",
            dataIndex: "rulesName"
        },
        {
            title: "采购规则",
            dataIndex: "rulesInfo",
            render: (text, record) => {
                let str = record.rulesType === 1 ? '消费金额：' : '采购数量：';
                str += record.rulesValue;
                str += record.rulesType === 1 ? '元起' : '件起';
                return str;
            }
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
                            requestUpdateRule(payload)
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
                    新增采购规则
            </Button>
            }
            onRequest={payload => getListData(payload)}
            tableConfig={{
                columns,
                rowKey: "id"
            }}
        />
        <AddRule visible={addStatus} editData={editData} onOk={() => {
            tableRef.current.reload();
        }} onCancel={() => {
            setEditData({});
            changeAddStatus(false);
        }} />
    </>
}

export default Rule;