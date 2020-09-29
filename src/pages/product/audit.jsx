import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    requestBrandList,
    requestSeasonList,
    requestCategoryList
} from 'service/common';
import {
    requestProductManage
} from 'service/product';
import { saveProductList } from "actions";

import { Space, Dropdown, Menu, message } from "antd";
import MainTable from "components/MainTable";
import Category from "components/Category";
import ProductTable from "./components/ProductTable";
import BatchAudit from "./components/BatchAudit";

const DropdownButton = Dropdown.Button;
const MenuItem = Menu.Item;

class ProductManage extends Component {
    state = {
        brandList: [],
        seasonList: [],
        cateList: [],
        loading: false,
        selectedRowKeys: [],
        tableRef: React.createRef(),
        batchStatus: false,
        payload: {},
        ctrlKey: ""
    }
    isUnMounted = false
    componentDidMount() {
        // 基础数据
        this.getSortData();
    }
    componentWillUnmount = () => {
        this.isUnMounted = true;
    }
    getListData(payload) {
        let params = {
            ...payload
        }
        if (params.category) {
            params.firstCategoryId = params.category[0];
            params.thirdCategoryId = params.category[1];
            delete params.category;
        }
        params.auditStatus = 0;

        // 保存筛选条件，批量操作的时候用
        this.setState({
            params
        })
        return requestProductManage(params);
    }
    setSelectRows(rows) {
        this.setState({ selectedRowKeys: rows })
    }
    getSortData() {
        // 品牌
        requestBrandList().then(response => {
            !this.isUnMounted && this.setState({
                brandList: response.list.map(brand => ({
                    ...brand,
                    value: brand.id,
                    label: [brand.nameZh, brand.nameEn].filter(v => v).join("-")
                }))
            })
        });
        // 季节
        requestSeasonList().then(response => {
            !this.isUnMounted && this.setState({
                seasonList: response.list.map(season => ({
                    ...season,
                    value: season.id,
                    label: season.nameZh
                }))
            })
        });
        // 类目
        let payload = {
            categoryLevel: 1,
            parentId: 0
        }
        requestCategoryList(payload).then(response => {
            !this.isUnMounted && this.setState({
                cateList: response.list.map(cate => ({
                    value: cate.id,
                    label: cate.nameZh,
                    isLeaf: false
                }))
            })
        })
    }
    handleMenuClick(e) {
        const { selectedRowKeys } = this.state;
        if (e.key === "1" && (!selectedRowKeys || selectedRowKeys.length === 0)) {
            message.warning("请选择至少一个商品");
            return;
        }
        this.setState({
            batchStatus: true,
            ctrlKey: e.key
        });
    }
    render() {
        const { brandList, seasonList, tableRef,
            batchStatus, selectedRowKeys, payload, ctrlKey, cateList } = this.state;
        const { storeList, luxuryList, saleList, sexList } = this.props;

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
                label: "类目",
                name: "category",
                render: <Category changeOnSelect={true} data={cateList} />
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
                label: "",
                placeholder: ["创建开始日期", "创建结束日期"],
                type: "daterange",
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
                            <DropdownButton type="primary" overlay={menu}>
                                批量审核
                            </DropdownButton>
                        </Space>
                    }
                    onRequest={(payload, type) => this.getListData(payload, type)}
                    onSelect={rows => this.setSelectRows(rows)}
                    tableRender={ProductTable}
                    tableConfig={{
                        onAudit: (id) => {
                            this.setState({
                                selectedRowKeys: [id],
                                ctrlKey: "1",
                                batchStatus: true
                            })
                        }
                    }}
                />
                <BatchAudit visible={batchStatus} payload={payload}
                    selectedRowKeys={selectedRowKeys}
                    ctrlKey={ctrlKey}
                    onOk={() => {
                        tableRef.current.reload();
                    }} onCancel={() => {
                        this.setState({
                            batchStatus: false
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
        sexList: state.sexList
    }
}

export default connect(mapStateToProps, { saveProductList })(ProductManage);