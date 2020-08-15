import React, { useEffect, useState } from "react";

import styles from "./comp.module.scss";
import { requestCategoryList } from "service/product";

import { Table, Button } from "antd";

const CateTable = props => {
    const { dataSource, pagination, loading } = props;
    // 二级菜单集合
    const [secCategoryList, setSecCategoryList] = useState({});
    // 二级菜单列表loading状态集合
    const [secLoadingList, changeSecLoadingList] = useState({});
    const categoryLevelList = [
        { key: 1, label: '一级' },
        { key: 2, label: '二级' },
        { key: 3, label: '三级' }
    ]

    const getDataList = (parentId) => {
        let cate = secCategoryList[parentId];
        if (!cate || cate.length === 0) {
            // loading
            changeSecLoadingList({
                ...secLoadingList,
                [parentId]: true
            })
            requestCategoryList({ parentId })
                .then(response => {
                    setSecCategoryList({
                        ...secCategoryList,
                        [parentId]: response.list
                    })
                    changeSecLoadingList({
                        ...secLoadingList,
                        [parentId]: false
                    })
                })
        }
    }
    const columns = [
        {
            title: "编号",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "分类名称",
            dataIndex: "nameZh",
            key: "nameZh"
        },
        {
            title: "级别",
            dataIndex: "categoryLevel",
            key: "categoryLevel",
            render: (text, record) => {
                let level = categoryLevelList.find(lv => lv.key === record.categoryLevel);
                return level && level.label;
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            render: () => (
                <span className="button" onClick={() => {

                }}>编辑</span>
            )
        }
    ]
    const expandedRowRender = (record) => {
        let data = secCategoryList[record.id];
        let loading = secLoadingList[record.id];
        return (
            <>
                <div className={styles.addsec}>
                    <Button type="primary">新增二级类别</Button>
                </div>
                <Table
                    bordered
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    rowKey="id"
                />
            </>
        )
    }
    return (
        <>
            <div className={styles.add}>
                <Button type="primary">新增一级类别</Button>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={pagination}
                expandable={{
                    // expandIconColumnIndex: 4,
                    // expandIcon: ({ expanded, onExpand, record }) => (
                    //     <>
                    //         <span className="button" onClick={() => {

                    //         }}>查看子集</span>
                    //     </>
                    // ),
                    expandedRowRender,
                    onExpand: (expanded, record) => {
                        if (expanded === true) {
                            getDataList(record.id);
                        }
                    },
                    // onExpandedRowsChange: () => {
                    //     console.log(1);
                    // }
                }}
            />
        </>
    )
}

export default CateTable;