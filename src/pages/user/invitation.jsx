import React, { Component } from "react";
import { connect } from "react-redux";

import { saveInvitationList } from 'actions';
import { requestChangeInvitecode, requestInvitecodeList } from 'service/user';

import { Button, Space, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainTable from "components/MainTable";
// import TableFilter from "components/TableFilter";
// import TableHeader from "components/TableHeader";
import AddInviteCode from './components/AddInviteCode';

class Invitation extends Component {
    state = {
        // payload: {
        //     pageIndex: 1,
        //     pageSize: 20
        // },
        tableRef: React.createRef(),
        visible: false,
        editData: {}
    }
    componentDidMount() {
        // this.getListData(this.state.payload);
    }
    // handleFilter(values) {
    //     let payload = {
    //         ...this.state.payload,
    //         pageIndex: 1,
    //         ...values
    //     }
    //     this.setState({
    //         payload
    //     })
    //     this.getListData(payload);
    // }
    getListData(payload) {
        return requestInvitecodeList(payload);
        // if (response) {
        //     saveInvitationList(response)
        // }
    }
    changeStatus(status, id) {
        let payload = {
            delStatus: status,
            id
        }
        requestChangeInvitecode(payload)
            .then(() => {
                message.success(`${payload.delStatus === 0 ? '启用' : '禁用'}成功`);
                this.state.tableRef.current.reload();
            })
    }
    render() {
        const { invitationStatus } = this.props;
        // const { list: dataSource, total } = userInvitationData;
        // const { pageIndex, pageSize } = this.state.payload;
        const { tableRef } = this.state;
        const columns = [
            {
                title: "邀请码",
                dataIndex: "code"
            },
            {
                title: "邀请人数",
                dataIndex: "inviteCount"
            },
            {
                title: "渠道/用途",
                dataIndex: "codeName"
            },
            {
                title: "状态",
                dataIndex: "statusName",
                render: (text, record) => invitationStatus.find(status => status.key === record.delStatus).name
            },
            {
                title: "操作",
                dataIndex: "ctrl",
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
                                editData: record,
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
                label: "邀请码",
                placeholder: "",
                type: "input",
                name: "code"
            }
        ]
        return (
            <>
                <MainTable
                    tableRef={tableRef}
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
                            新增邀请码
                        </Button>
                    }
                    onRequest={payload => this.getListData(payload)}
                    tableConfig={{
                        columns: columns,
                        rowKey: "id"
                    }}
                />

                {/* <TableFilter config={filterConfig} onSearch={(values) => {
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
                            this.getListData(payload);
                        }
                    }}
                ></Table> */}
                <AddInviteCode visible={this.state.visible} editData={this.state.editData}
                    onCancel={() => {
                        this.setState({
                            "visible": false,
                            "editData": {}
                        })
                    }} onOk={() => {
                        tableRef.current.reload();
                    }} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        invitationStatus: state.invitationStatus
    }
}

export default connect(mapStateToProps, { saveInvitationList })(Invitation);