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
import { exportExcelFromData } from "utils/common";

import { Button, Space, Dropdown, Menu, message } from "antd";
import TableFilter from "components/TableFilter";
import TableHeader from "components/TableHeader";
import ProductTable from "./components/ProductTable";
import BatchSearch from "./components/BatchSearch";

const DropdownButton = Dropdown.Button;
const MenuItem = Menu.Item;

class ProductManage extends Component {
    state = {
        brandList: [],
        seasonList: [],
        ruleList: [],
        filterForm: null, // 筛选栏form表单实例
        loading: false,
        searchStatus: false,
        filters: {}, // 商品筛选条件
        ids: "", // 批量查找商品
        selectedRowKeys: [],
        payload: {
            auditStatus: 1,
            pageIndex: 1,
            pageSize: 20
        }
    }
    componentDidMount() {
        // 基础数据
        this.getSortData();
        // 列表数据
        this.getListData(this.state.payload);
    }
    getListData(payload) {
        this.setState({
            loading: true
        })
        const { saveProductList } = this.props;
        requestProductManage(payload)
            .then(response => {
                this.setState({
                    loading: false
                })
                saveProductList(response);
            })
    }
    getSortData() {
        // 品牌
        requestBrandList().then(response => {
            this.setState({
                brandList: response.list.map(brand => ({
                    ...brand,
                    key: brand.id,
                    name: [brand.nameZh, brand.nameEn].filter(v => v).join("-")
                }))
            })
        });
        // 季节
        requestSeasonList().then(response => {
            this.setState({
                seasonList: response.list.map(season => ({
                    ...season,
                    key: season.id,
                    name: season.nameZh
                }))
            })
        });
        // 采购规则
        requestRuleList().then(response => {
            this.setState({
                ruleList: response.list.map(rule => ({
                    ...rule,
                    key: rule.id,
                    name: rule.rulesName
                }))
            })
        });
    }
    handleMenuClick(e) {
        console.log(e);
        this.setState({ selectedRowKeys: [] })
    }
    render() {
        const { brandList, seasonList, ruleList, payload, loading, searchStatus, filterForm, selectedRowKeys } = this.state;
        const { storeList, luxuryList, saleList, sexList, statusList } = this.props;

        const filterConfig = [
            {
                title: "商品ID",
                placeholder: "",
                type: "input",
                key: "id"
            },
            {
                title: "原厂货号",
                placeholder: "",
                type: "input",
                key: "manufactureCode"
            },
            {
                title: "商品名称",
                placeholder: "",
                type: "input",
                key: "spuName"
            },
            {
                title: "Barcode",
                placeholder: "",
                type: "input",
                key: "barcode"
            },
            {
                title: "品牌",
                placeholder: "",
                type: "select",
                key: "brandId",
                data: brandList
            },
            {
                title: "季节",
                placeholder: "",
                type: "select",
                key: "season",
                data: seasonList
            },
            {
                title: "发货仓库",
                placeholder: "",
                type: "select",
                key: "storage",
                data: storeList
            },
            {
                title: "奢侈品属性",
                placeholder: "",
                type: "select",
                key: "luxury",
                data: luxuryList
            },
            {
                title: "销售属性",
                placeholder: "",
                type: "select",
                key: "saleAttribute",
                data: saleList
            },
            {
                title: "性别",
                placeholder: "",
                type: "select",
                key: "sexId",
                data: sexList
            },
            {
                title: "采购规则",
                placeholder: "",
                type: "select",
                key: "rulesId",
                data: ruleList
            },
            {
                title: "状态",
                placeholder: "",
                type: "select",
                key: "shelfStatus",
                data: statusList
            },
            {
                title: "",
                placeholder: ["创建开始日期", "创建结束日期"],
                type: "dateRange",
                key: "filtrateTime"
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
                <TableFilter config={filterConfig} setForm={form => {
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
                }} />
                <TableHeader ctrl={
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
                } />
                <ProductTable
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
                    }} />
                <BatchSearch visible={searchStatus} onOk={(ids) => {
                    this.setState({
                        ids,
                        searchStatus: false,
                        filters: {}
                    })
                    // 重置筛选表单
                    filterForm.resetFields();

                    let payload = {
                        ...this.state.payload,
                        ids
                    }
                    this.getListData(payload);
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