import React, { Component } from "react";
import { connect } from "react-redux";

import { saveInvitationList } from 'actions';
import { requestChangeInvitecode, requestInvitecodeList } from 'service/user';

import { Table, Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableFilter from "components/TableFilter";
import TableHeader from "components/TableHeader";
import AddInviteCode from './components/AddInviteCode';

class Invitation extends Component {
    state = {
        payload: {
            pageIndex: 1,
            pageSize: 20
        },
        visible: false,
        editId: 0
    }
    componentDidMount() {
        this.initData(this.state.payload);
    }
    handleFilter(values) {
        let payload = {
            ...this.state.payload,
            pageIndex: 1,
            ...values
        }
        this.setState({
            payload
        })
        this.initData(payload);
    }
    async initData(payload) {
        const { saveInvitationList } = this.props;
        const response = await requestInvitecodeList(payload);
        if (response) {
            saveInvitationList(response)
        }
    }
    changeStatus(status, id) {
        let payload = {
            delStatus: status,
            id
        }
        requestChangeInvitecode(payload)
            .then(() => {
                message.success(`${payload.delStatus === 0 ? '启用' : '禁用'}成功`);
                this.handleFilter();
            })
    }
    render() {
        const { userInvitationData } = this.props;
        const { list: dataSource, total } = userInvitationData;
        const { pageIndex, pageSize } = this.state.payload;
        const columns = [
            {
                title: "邀请码",
                dataIndex: "code",
                key: "code"
            },
            {
                title: "邀请人数",
                dataIndex: "inviteCount",
                key: "inviteCount"
            },
            {
                title: "渠道/用途",
                dataIndex: "codeName",
                key: "codeName"
            },
            {
                title: "状态",
                dataIndex: "statusName",
                key: "statusName"
            },
            {
                title: "操作",
                dataIndex: "ctrl",
                key: "ctrl",
                render: (text, record) => (
                    <Space size="middle">
                        <Popconfirm placement="topRight" title={`是否${record.delStatus === 1 ? "启用" : "禁用"}该邀请码`}
                            onConfirm={() => {
                                this.changeStatus(Number(!record.delStatus), record.id);
                            }} okText="是" cancelText="否">
                            <span className="button">{record.delStatus === 1 ? "启用" : "禁用"}</span>
                        </Popconfirm>
                        <span className="button" onClick={() => {
                            this.setState({
                                editId: record.id,
                                visible: true
                            })
                        }}>编辑</span>
                    </Space>
                ),
                width: 120
            }
        ];
        const filterConfig = [
            {
                title: "邀请码",
                placeholder: "",
                type: "input",
                key: "code"
            }
        ]
        return (
            <>
                <TableFilter config={filterConfig} onSearch={(values) => {
                    this.handleFilter(values);
                }} />
                <TableHeader ctrl={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            this.setState({
                                "visible": true
                            })
                        }}
                    >
                        新增邀请码
                    </Button>
                } />
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        pageSize,
                        total,
                        current: pageIndex,
                        showTotal: total => `共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            let payload = this.state.payload;
                            payload.pageIndex = page;
                            payload.pageSize = pageSize;
                            this.setState({
                                payload
                            });
                            this.initData(payload);
                        }
                    }}
                ></Table>
                <AddInviteCode visible={this.state.visible} editId={this.state.editId}
                    onCancel={() => {
                        this.setState({
                            "visible": false,
                            "editId": 0
                        })
                    }} onOk={() => {
                        this.handleFilter();
                    }} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInvitationData: state.userInvitationData
    }
}

export default connect(mapStateToProps, { saveInvitationList })(Invitation);