import React, { Component } from "react";
import { connect } from "react-redux";

import { saveUserList } from "actions";
import { requestUserList } from "service/user";

import { Table } from "antd";
import TableFilter from "components/TableFilter";

class User extends Component {
  state = {
    payload: {
      inviteCode: "",
      phone: "",
      filtrateSTime: "",
      filtrateETime: "",
      pageIndex: 1,
      pageSize: 10
    }
  };
  componentDidMount() {
    this.initData(this.state.payload);
  }
  handleFilter(values) {
    values.filtrateSTime = values.filtrateTime
      ? values.filtrateTime[0].format("YYYY-MM-DD") + " 00:00:00"
      : "";
    values.filtrateETime = values.filtrateTime
      ? values.filtrateTime[1].format("YYYY-MM-DD") + " 23:59:59"
      : "";
    delete values.filtrateTime;
    let payload = {
      ...this.state.payload,
      pageIndex: 1,
      ...values
    };
    this.setState({
      payload
    });
    this.initData(payload);
  }
  async initData(payload) {
    const { saveUserList } = this.props;
    const response = await requestUserList(payload);
    if (response) {
      saveUserList(response)
    }
  }
  render() {
    const {
      userManageData: { list: dataSource, total }
    } = this.props;
    const { pageIndex, pageSize } = this.state.payload;
    const columns = [
      {
        title: "注册手机号",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "createTime",
        key: "createTime"
      },
      {
        title: "注册邀请码",
        dataIndex: "inviteCode",
        key: "inviteCode"
      },
      {
        title: "消费次数",
        dataIndex: "consumptionNum",
        key: "consumptionNum"
      },
      {
        title: "累计消费金额",
        dataIndex: "consumptionMoney",
        key: "consumptionMoney"
      }
    ];
    const filterConfig = [
      {
        title: "邀请码",
        placeholder: "",
        type: "input",
        key: "inviteCode"
      },
      {
        title: "注册手机号",
        placeholder: "",
        type: "input",
        key: "phone"
      },
      {
        title: "",
        placeholder: ["开始时间", "结束时间"],
        type: "dateRange",
        key: "filtrateTime"
      }
    ]
    return (
      <>
        <TableFilter config={filterConfig} onSearch={(values) => {
          this.handleFilter(values);
        }} />
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
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    userManageData: state.userManageData
  };
};

// export default User;
export default connect(mapStateToProps, { saveUserList })(User);
