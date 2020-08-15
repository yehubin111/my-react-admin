import React from "react";

import { requestUserList } from "service/limit";

import { Button, Space, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainTable from "components/MainTable";


const Users = () => {
    const userStatusList = [
        { key: 0, label: "禁用" },
        { key: 1, label: "启用" }
    ]
    const getListData = (payload) => {
        return requestUserList(payload)
    }
    const filterConfig = [];
    const columns = [
        {
            title: "人员姓名",
            dataIndex: "backUserName"
        },
        {
            title: "登录名",
            dataIndex: "backUserAccount"
        },
        {
            title: "角色",
            dataIndex: "backRoleList",
            render: (text, record) => record.backRoleList && record.backRoleList.map(role => role.backRoleName).join("/")
        },
        {
            title: "状态",
            dataIndex: "useStatus",
            render: (text, record) => userStatusList.find(userStatus => userStatus.key === record.useStatus).label
        },
        {
            title: "操作",
            dataIndex: "actions",
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm placement="topRight" title={`是否${record.useStatus === 0 ? "启用" : "禁用"}该邀请码`}
                        onConfirm={() => {
                            this.changeStatus(Number(!record.delStatus), record.id);
                        }} okText="是" cancelText="否">
                        <span className="button">{record.useStatus === 0 ? "启用" : "禁用"}</span>
                    </Popconfirm>
                    <span className="button" onClick={() => {
                        this.setState({
                            editData: record,
                            visible: true
                        })
                    }}>修改</span>
                    <span className="button" onClick={() => {
                        this.setState({
                            editData: record,
                            visible: true
                        })
                    }}>重置密码</span>
                </Space>
            )
        }
    ];
    return <>
        <MainTable
            filterConfig={filterConfig}
            headerCtrl={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        this.setState({
                            "visible": true
                        })
                    }}
                >
                    新增用户
                </Button>
            }
            onRequest={payload => getListData(payload)}
            tableConfig={{
                columns,
                rowKey: "backUserId"
            }}
        />
    </>
}

export default Users;