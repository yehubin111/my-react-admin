import React from "react";
import moment from "moment";

import { requestSystemList } from "service/operation";

import MainTable from "components/MainTable";

const System = props => {
    const getDataList = payload => {
        return requestSystemList(payload);
    }
    const columns = [
        {
            title: "配置字段",
            dataIndex: "configName",
            key: "configName",
            width: 180
        },
        {
            title: "内容",
            dataIndex: "configValue",
            key: "configValue",
            width: 200
        },
        {
            title: "修改时间",
            dataIndex: "modifyTime",
            key: "modifyTime",
            render: (text, record) => moment(record.modifyTime).format("YYYY-MM-DD HH:mm:ss"),
            width: 200
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            render: (text, record) => {
                return (
                    <span className="button">编辑</span>
                )
            },
            width: 120
        },
    ];
    return (
        <>
            <MainTable
                onRequest={payload => getDataList(payload)}
                tableConfig={{
                    columns,
                    rowKey: "id"
                }}
            />
        </>
    )
}

export default System;