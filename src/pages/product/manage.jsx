import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    requestBrandList,
    requestSeasonList,
    requestRuleList
} from 'service/common';
import {
    requestProductManage,
    requestProductExport
} from 'service/product';
import { saveProductList } from "actions";
// import { exportExcelFromData } from "utils/common";

import { Button, Space, Dropdown, Menu } from "antd";
import MainTable from "components/MainTable";
// import TableFilter from "components/TableFilter";
// import TableHeader from "components/TableHeader";
import ProductTable from "./components/ProductTable";
import BatchSearch from "./components/BatchSearch";

const DropdownButton = Dropdown.Button;
const MenuItem = Menu.Item;

class ProductManage extends Component {
    state = {
        brandList: [],
        seasonList: [],
        ruleList: [],
        loading: false,
        searchStatus: false,
        ids: "", // 批量查找商品
        selectedRowKeys: [],
        tableRef: React.createRef()
    }
    componentDidMount() {
        // 基础数据
        this.getSortData();
        // 列表数据
        // this.getListData(this.state.payload);
    }
    getListData(payload, type) {
        payload.auditStatus = 1;
        if (type !== "filter")
            payload = {
                ...payload,
                ids: this.state.ids
            }
        else 
            this.setState({
                ids: ""
            })
        return requestProductManage(payload);
    }
    setSelectRows(rows) {
        console.log(rows);
    }
    getSortData() {
        // 品牌
        requestBrandList().then(response => {
            this.setState({
                brandList: response.list.map(brand => ({
                    ...brand,
                    key: brand.id,
                    label: [brand.nameZh, brand.nameEn].filter(v => v).join("-")
                }))
            })
        });
        // 季节
        requestSeasonList().then(response => {
            this.setState({
                seasonList: response.list.map(season => ({
                    ...season,
                    key: season.id,
                    label: season.nameZh
                }))
            })
        });
        // 采购规则
        requestRuleList().then(response => {
            this.setState({
                ruleList: response.list.map(rule => ({
                    ...rule,
                    key: rule.id,
                    label: rule.rulesName
                }))
            })
        });
    }
    handleMenuClick(e) {
        console.log(e);
        this.setState({ selectedRowKeys: [] })
    }
    render() {
        const { brandList, seasonList, ruleList, tableRef, searchStatus } = this.state;
        const { storeList, luxuryList, saleList, sexList, statusList } = this.props;

        const filterConfig = [
            {
                label: "商品ID",
                placeholder: "",
                type: "input",
                name: "id"
            },
            {
                label: "原厂货号",
                placeholder: "",
                type: "input",
                name: "manufactureCode"
            },
            {
                label: "商品名称",
                placeholder: "",
                type: "input",
                name: "spuName"
            },
            {
                label: "Barcode",
                placeholder: "",
                type: "input",
                name: "barcode"
            },
            {
                label: "品牌",
                placeholder: "",
                type: "select",
                name: "brandId",
                data: brandList
            },
            {
                label: "季节",
                placeholder: "",
                type: "select",
                name: "season",
                data: seasonList
            },
            {
                label: "发货仓库",
                placeholder: "",
                type: "select",
                name: "storage",
                data: storeList
            },
            {
                label: "奢侈品属性",
                placeholder: "",
                type: "select",
                name: "luxury",
                data: luxuryList
            },
            {
                label: "销售属性",
                placeholder: "",
                type: "select",
                name: "saleAttribute",
                data: saleList
            },
            {
                label: "性别",
                placeholder: "",
                type: "select",
                name: "sexId",
                data: sexList
            },
            {
                label: "采购规则",
                placeholder: "",
                type: "select",
                name: "rulesId",
                data: ruleList
            },
            {
                label: "状态",
                placeholder: "",
                type: "select",
                name: "shelfStatus",
                data: statusList
            },
            {
                label: "",
                placeholder: ["创建开始日期", "创建结束日期"],
                type: "dateRange",
                name: "filtrateTime"
            }
        ];
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <MenuItem key="1">
                    操作选中项
                </MenuItem>
                <MenuItem key="2">
                    操作查询结果
                </MenuItem>
            </Menu>
        )
        return (
            <>
                <MainTable
                    tableRef={tableRef}
                    filterConfig={filterConfig}
                    headerCtrl={
                        <Space size="middle">
                            <Button type="primary"
                                onClick={() => {
                                    requestProductExport(this.state.payload)
                                }}
                            >
                                批量导出
                            </Button>
                            <Button type="primary"
                                onClick={() => {
                                    this.setState({
                                        searchStatus: true
                                    })
                                }}
                            >
                                批量查找商品
                            </Button>
                            <DropdownButton type="primary" overlay={menu}>
                                批量操作
                            </DropdownButton>
                        </Space>
                    }
                    onRequest={(payload, type) => this.getListData(payload, type)}
                    onSelect={rows => this.setSelectRows(rows)}
                    tableRender={ProductTable}
                />
                {/* <TableFilter config={filterConfig} setForm={form => {
                    this.setState({
                        filterForm: form
                    })
                }} onSearch={(values) => {
                    this.setState({
                        filters: values,
                        ids: ""
                    })
                    let payload = {
                        ...this.state.payload,
                        ...this.state.filters
                    }
                    this.getListData(payload);
                }} /> */}
                {/* <TableHeader ctrl={
                    <Space size="middle">
                        <Button type="primary"
                            onClick={() => {
                                requestProductExport(this.state.payload)
                            }}
                        >
                            批量导出
                        </Button>
                        <Button type="primary"
                            onClick={() => {
                                this.setState({
                                    searchStatus: true
                                })
                            }}
                        >
                            批量查找商品
                        </Button>
                        <DropdownButton type="primary" overlay={menu}>
                            批量操作
                        </DropdownButton>
                    </Space>
                } /> */}
                {/* <ProductTable
                    pageIndex={payload.pageIndex}
                    pageSize={payload.pageSize}
                    loading={loading}
                    onInit={() => {
                        this.getListData(this.state.payload);
                    }}
                    selectedRowKeys={selectedRowKeys}
                    onSelect={(select) => {
                        this.setState({ selectedRowKeys: select });
                    }}
                    onPaginationChange={(page) => {
                        let payload = {
                            ...this.state.payload,
                            pageIndex: page.pageIndex,
                            pageSize: page.pageSize
                        }
                        this.setState({ payload })
                        this.getListData(payload);
                    }} /> */}
                <BatchSearch visible={searchStatus} onOk={(ids) => {
                    this.setState({
                        ids,
                        searchStatus: false
                    })
                    setTimeout(() => {
                        // 重置筛选表单
                        tableRef.current.resetFields();
                        tableRef.current.reload();
                    }, 0)
                }} onCancel={() => {
                    this.setState({
                        searchStatus: false
                    })
                }} />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        storeList: state.storeList,
        luxuryList: state.luxuryList,
        saleList: state.saleList,
        sexList: state.sexList,
        statusList: state.statusList
    }
}

export default connect(mapStateToProps, { saveProductList })(ProductManage);