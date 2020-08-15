import React, { Component } from "react";
import { connect } from "react-redux";
import moment from 'moment';

import { saveUserList } from "actions";
import { requestUserList } from "service/user";

// import { Table } from "antd";
import MainTable from "components/MainTable";
// import TableFilter from "components/TableFilter";

class User extends Component {
  state = {
  };
  componentDidMount() {
  }
  // handleFilter(values) {
  //   values.filtrateSTime = values.filtrateTime
  //     ? values.filtrateTime[0].format("YYYY-MM-DD") + " 00:00:00"
  //     : "";
  //   values.filtrateETime = values.filtrateTime
  //     ? values.filtrateTime[1].format("YYYY-MM-DD") + " 23:59:59"
  //     : "";
  //   delete values.filtrateTime;
  //   let payload = {
  //     ...this.state.payload,
  //     pageIndex: 1,
  //     ...values
  //   };
  //   this.setState({
  //     payload
  //   });
  //   this.getListData(payload);
  // }
  getListData(payload) {
    payload.filtrateSTime = payload.filtrateTime
      ? payload.filtrateTime[0].format("YYYY-MM-DD") + " 00:00:00"
      : "";
    payload.filtrateETime = payload.filtrateTime
      ? payload.filtrateTime[1].format("YYYY-MM-DD") + " 23:59:59"
      : "";
    delete payload.filtrateTime;
    return requestUserList(payload);
  }
  render() {
    // const {
    //   userManageData: { list: dataSource, total }
    // } = this.props;
    // const { pageIndex, pageSize } = this.state.payload;
    const columns = [
      {
        title: "注册手机号",
        dataIndex: "phone"
      },
      {
        title: "注册时间",
        dataIndex: "createTime",
        render: (text, record) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: "注册邀请码",
        dataIndex: "inviteCode"
      },
      {
        title: "消费次数",
        dataIndex: "consumptionNum"
      },
      {
        title: "累计消费金额",
        dataIndex: "consumptionMoney"
      }
    ];
    const filterConfig = [
      {
        label: "邀请码",
        placeholder: "",
        type: "input",
        name: "inviteCode"
      },
      {
        label: "注册手机号",
        placeholder: "",
        type: "input",
        name: "phone"
      },
      {
        label: "",
        placeholder: ["开始时间", "结束时间"],
        type: "dateRange",
        name: "filtrateTime"
      }
    ]
    return (
      <>
        <MainTable
          filterConfig={filterConfig}
          onRequest={payload => this.getListData(payload)}
          tableConfig={{
            columns,
            rowKey: "id"
          }}
        />
        {/* <TableFilter config={filterConfig} onSearch={(values) => {
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
              this.getListData(payload);
            }
          }}
        ></Table> */}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    // userManageData: state.userManageData
  };
};

// export default User;
export default connect(mapStateToProps, { saveUserList })(User);
