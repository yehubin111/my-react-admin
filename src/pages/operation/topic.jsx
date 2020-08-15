import React from "react";

import { requestTopicList } from "service/operation";
import styles from "./page.module.scss";

import { Button, Space } from "antd";
import MainTable from "components/MainTable";
import TopicTable from "./components/TopicTable";

const Topic = props => {
    const getListData = payload => {
        return requestTopicList(payload);
    }
    const filterConfig = [
        {
            label: "专题编号",
            placeholder: "",
            type: "input",
            name: "id"
        },
        {
            label: "专题名称",
            placeholder: "",
            type: "input",
            name: "topicName"
        }
    ]
    return (
        <>
            <MainTable
                filterConfig={filterConfig}
                headerCtrl={
                    <Space size="middle">
                        <p className={styles.tip}>注意：为保证小程序展示正确，专题可售商品数量不能小于6个</p>
                        <Button type="primary" onClick={() => {

                        }}>
                            新增专题
                        </Button>
                    </Space>
                }
                onRequest={payload => getListData(payload)}
                tableRender={TopicTable}
            />
        </>
    )
}

export default Topic;