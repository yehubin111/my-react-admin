import React, { useEffect, useState, useRef } from 'react';

import TableFilter from "../TableFilter";
import TableHeader from "../TableHeader";
import EditTable from "../EditTable";

const MainTable = props => {
    const {
        filterConfig,
        onRequest,
        onSelect,
        title,
        headerTab: { key: headerTabKey, config: headerTabConfig } = {},
        headerCtrl,
        tableConfig: { onEditChange, pagination, ...tableConfig } = {},
        tableRender,
        tableRef
    } = props;
    const [payload, setPayload] = useState({
        pageIndex: 1,
        pageSize: 20
    });
    const [filterOptions, setFilterOptions] = useState({});
    const [total, setTotal] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, changeLoading] = useState(false);
    const filterRef = useRef();

    const getListData = (params = payload, type = "") => {
        // loading
        changeLoading(true);
        // 无需分页
        if (pagination === false) {
            delete params.pageIndex;
            delete params.pageSize;
        }
        // 获取数据
        if (onRequest && typeof onRequest == 'function')
            onRequest(params, type).then(response => {
                // loading end
                changeLoading(false);

                setDataSource(response.list);
                setTotal(response.total);
            });
    }
    const toResetFilter = () => {
        setFilterOptions({});
        setPayload({
            ...payload,
            pageIndex: 1
        })
        filterRef.current.resetFields();
    }
    if (tableRef && typeof tableRef !== 'function') {
        tableRef.current = {
            reload: getListData,
            resetFields: toResetFilter
        };
    }
    useEffect(() => {
        getListData(payload);
    }, [])

    const paginationOption = {
        pageSize: payload.pageSize,
        total,
        current: payload.pageIndex,
        showSizeChanger: false,
        showTotal: total => `共 ${total} 条`,
        onChange: (page, pageSize) => {
            let params = {
                ...payload,
                pageIndex: page,
                pageSize
            }
            setPayload(params);
            getListData({
                ...params,
                ...filterOptions
            }, 'pagination');
        }
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            onSelect && onSelect(keys);
            setSelectedRowKeys(keys);
        }
    }
    return (
        <>
            {filterConfig && <TableFilter onFilter={values => {
                setFilterOptions(values);
                let options = {
                    ...payload,
                    pageIndex: 1
                }
                setPayload(options)
                let params = {
                    ...options,
                    ...values
                }
                getListData(params, 'filter');
            }} config={filterConfig} filterRef={filterRef} />}
            {headerCtrl
                && <TableHeader
                    onTab={e => {
                        let options = {
                            ...payload,
                            pageIndex: 1,
                            orderStatus: e
                        }
                        setPayload(options);
                        getListData(options);
                    }}
                    tabs={headerTabConfig}
                    ctrl={headerCtrl}
                    title={title} />}
            {tableRender
                ? React.createElement(tableRender, {
                    dataSource,
                    pagination: paginationOption,
                    selectedRowKeys,
                    rowSelection,
                    loading,
                    onInit: getListData
                })
                : <EditTable
                    loading={loading}
                    pagination={pagination !== false && paginationOption}
                    dataSource={dataSource}
                    onEditChange={(row) => {
                        let { rowKey } = tableConfig;
                        let newData = [...dataSource];
                        let bannerIndex = newData.findIndex(banner => banner[rowKey] === row[rowKey]);
                        newData.splice(bannerIndex, 1, row);
                        onEditChange(newData);
                    }}
                    {...tableConfig}
                />}
        </>
    )
}

export default MainTable;