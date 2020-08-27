import React, { Component } from "react";

import { requestRoleList, requestUpdateRole } from "service/limit";

import { Space, Popconfirm, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainTable from "components/MainTable";
import AddRole from "./components/AddRole";

class Roles extends Component {
    state = {
        editData: {},
        addStatus: false
    }
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }
    getListData(payload) {
        return requestRoleList(payload)
    }
    toDelRole(payload) {
        requestUpdateRole(payload)
            .then(() => {
                message.success("删除成功");
                this.tableRef.current.reload();
            })
    }
    render() {
        const { addStatus, editData } = this.state;
        const columns = [
            {
                title: "角色名称",
                dataIndex: "backRoleName"
            },
            {
                title: "权限内容",
                dataIndex: "backMenuList",
                render: (text, record) => {
                    return record.backMenuList && record.backMenuList.map(menu => menu.backMenuName).join(" / ")
                }
            },
            {
                title: "操作",
                dataIndex: "actions",
                render: (text, record) => (
                    <Space size="middle">
                        <span className="button" onClick={() => {
                            this.setState({
                                editData: record,
                                addStatus: true
                            })
                        }}>修改</span>
                        <Popconfirm placement="topRight" title="是否删除该角色"
                            onConfirm={() => {
                                let payload = {
                                    delStatus: 1,
                                    backRoleId: record.backRoleId
                                }
                                this.toDelRole(payload);
                            }} okText="是" cancelText="否">
                            <span className="button">删除</span>
                        </Popconfirm>
                    </Space>
                )
            }
        ]
        return <>
            <MainTable
                tableRef={this.tableRef}
                headerCtrl={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            this.setState({
                                addStatus: true
                            });
                        }}
                    >
                        创建角色
                    </Button>
                }
                onRequest={(payload) => this.getListData(payload)}
                tableConfig={{
                    columns,
                    rowKey: "backRoleId"
                }}
            />
            <AddRole visible={addStatus} editData={editData} onCancel={() => {
                this.setState({
                    addStatus: false
                });
            }} onOk={() => {
                this.tableRef.current.reload();
            }} />
        </>
    }
}

export default Roles;