import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, withRouter, useHistory } from "react-router-dom";

import {
    requestBrandList,
    requestOriginList,
    requestSeasonList,
    requestCategoryList,
    requestStorageList,
    requestRulesList
} from "service/common";
import { requestGetSpuDetail, requestSpuEdit } from "service/product";

import { Form, Card, Input, Space, Table, Button, message } from "antd";
import MainFormItems from "components/MainFormItems";
import Category from "components/Category";
// const { Item: FormItem } = Form;
// const { Option } = Select;
// const { TextArea } = Input;
// const { Group: RadioGroup } = Radio;

// 商品尺寸
const Measure = ({ value = {}, onChange }) => {
    const handleChange = (key, val) => {
        onChange({
            ...value,
            [key]: val
        });
    }

    return <Space size="middle" direction="vertical" style={{ width: "100%" }}>
        <Input value={value.length} prefix="长" placeholder="请输入" suffix="CM" onChange={(e) => {
            handleChange("length", e.target.value)
        }} />
        <Input value={value.width} prefix="宽" placeholder="请输入" suffix="CM" onChange={(e) => {
            handleChange("width", e.target.value)
        }} />
        <Input value={value.height} prefix="高" placeholder="请输入" suffix="CM" onChange={(e) => {
            handleChange("height", e.target.value)
        }} />
    </Space>
}
// 尺码
const Size = ({ value = [] }) => {
    const columns = [
        {
            title: "#",
            dataIndex: "id",
            render: (text, record, index) => (index + 1)
        },
        {
            title: "尺码",
            dataIndex: "size"
        },
        {
            title: "销售库存",
            dataIndex: "storeNumber"
        }
    ]
    return <Table
        bordered
        size="small"
        columns={columns}
        rowKey="id"
        dataSource={value}
        pagination={false}
    />
}
const Public = props => {
    const { sexList, luxuryList, countryList, deliveryList, refundServiceList, saleList } = props;
    const { productId } = useParams();
    const history = useHistory();
    // const [cateform] = Form.useForm();
    // const [baseform] = Form.useForm();
    // const [logiform] = Form.useForm();
    const [spuform] = Form.useForm();
    const [brandList, setBrandList] = useState([]);
    const [originList, setOriginList] = useState([]);
    const [seasonList, setSeasonList] = useState([]);
    const [storageList, setStorageList] = useState([]);
    const [rulesList, setRulesList] = useState([]);
    const [cateList, setCateList] = useState([]);
    const [submitLoading, changeSubmitLoading] = useState(false);
    const style = {
        marginBottom: "20px"
    }

    useEffect(() => {
        // 商品详情
        requestGetSpuDetail({ id: productId })
            .then(response => {
                let product = response;
                product.measure = {
                    length: product.length,
                    width: product.width,
                    height: product.height
                }
                product.category = product.categorys
                    ? product.categorys.map(cate => cate.id).reverse()
                    : [];
                if (product.deliveryFee === 0) {
                    product.deliveryFeeType = 0;
                } else {
                    product.deliveryFeeType = 1;
                }
                product.skus = product.skus.map(sku => ({
                    id: sku.id,
                    code: "系统生成",
                    size: sku.size,
                    storeNumber: sku.storeNumber
                }))
                spuform.setFieldsValue(product)
            })
        // 品牌
        requestBrandList()
            .then(response => {
                let list = response.list.map(brand => ({ value: brand.id, label: [brand.nameEn, brand.nameZh].filter(v => v).join("-") }));
                setBrandList(list);
            })
        // 产地
        requestOriginList()
            .then(response => {
                let list = response.list.map(origin => ({ value: origin.id, label: origin.nameZh }));
                setOriginList(list);
            })
        // 季节
        requestSeasonList()
            .then(response => {
                let list = response.list.map(season => ({ value: season.id, label: season.nameZh }));
                setSeasonList(list);
            })
        // 发货仓库
        requestStorageList()
            .then(response => {
                let list = response.list.map(storage => ({ value: storage.id, label: storage.name }));
                setStorageList(list);
            })
        // 采购规则
        requestRulesList()
            .then(response => {
                let list = response.list.map(rule => ({ value: rule.id, label: rule.rulesName }));
                setRulesList(list);
            })
        // 类目
        let payload = {
            categoryLevel: 1,
            parentId: 0
        }
        requestCategoryList(payload).then(response => {
            let list = response.list.map(cate => ({
                value: cate.id,
                label: cate.nameZh,
                isLeaf: false
            }))
            setCateList(list);
        })
    }, [productId])

    const col4 = {
        xl: { span: 16, offset: 2 },
        lg: { span: 18 },
        md: { span: 12 },
        sm: 24,
        xs: 24
    }
    const cateItems = [
        {
            label: "商品类目",
            name: "category",
            rules: [{
                required: true,
                validator: (rule, value) => {
                    if (value.length > 0) {
                        return Promise.resolve();
                    }
                    return Promise.reject("请选择商品类目")
                }
            }],
            render: <Category data={cateList} />
        }
    ];
    const baseItems = [
        {
            label: "商品名称",
            name: "spuName",
            type: "input",
            rules: [{ required: true, message: "请输入商品名称" }]
        },
        {
            label: "商品货号",
            name: "manufactureCode",
            type: "input",
            rules: [{ required: true, message: "请输入商品货号" }],
            options: {
                disabled: true
            }
        },
        {
            label: "品牌",
            name: "brandId",
            type: "select",
            rules: [{ required: true, message: "请选择品牌" }],
            data: brandList
        },
        {
            label: "商品产地",
            name: "origin",
            type: "select",
            data: originList
        },
        {
            label: "商品颜色",
            name: "color",
            placeholder: "50个字符以内",
            type: "input",
            rules: [{ required: true, message: "请输入商品颜色" }]
        },
        {
            label: "季节",
            name: "season",
            type: "select",
            rules: [{ required: true, message: "请选择季节" }],
            data: seasonList
        },
        {
            label: "适用性别",
            name: "sexId",
            type: "select",
            rules: [{ required: true, message: "请选择性别" }],
            data: sexList
        },
        {
            label: "奢侈品属性",
            name: "luxury",
            type: "select",
            rules: [{ required: true, message: "请选择奢侈品属性" }],
            data: luxuryList
        },
        {
            label: "商品材质",
            name: "material",
            type: "input"
        },
        {
            label: "商品尺寸",
            name: "measure",
            type: "",
            render: <Measure />
        },
        {
            label: "详情说明",
            name: "spuDesc",
            type: "textarea",
            col: col4
        },
    ];
    const logiItems = [
        {
            label: "退货服务",
            name: "refundServiceType",
            type: "radio",
            rules: [{ required: true }],
            data: refundServiceList
        },
        {
            label: "运费",
            name: "deliveryFeeType",
            type: "radio",
            rules: [{ required: true }],
            data: deliveryList
        },
        {
            label: "发货仓库",
            name: "storage",
            type: "select",
            rules: [{ required: true }],
            data: storageList,
            options: {
                disabled: true
            }
        },
        {
            label: "订单确认时间",
            name: "orderConfirm",
            type: "input",
            options: {
                disabled: true
            }
        },
        {
            label: "订单发货时间",
            name: "orderDelivery",
            type: "input",
            options: {
                disabled: true
            }
        },
        {
            label: "商品重量",
            name: "weight",
            placeholder: "请输入，最多1位小数",
            type: "input",
            options: {
                suffix: "KG"
            }
        }
    ];
    const specifyItems = [
        {
            label: "成本价",
            name: "supplierSupplyPrice",
            type: "input",
            rules: [{ required: true, message: "请输入成本价" }],
            options: {
                disabled: true
            }
        },
        {
            label: "划线价",
            name: "supplierMarketPrice",
            type: "input",
            rules: [{ required: true, message: "请输入划线价" }]
        },
        {
            label: "销售价",
            name: "sellPrice",
            type: "input",
            rules: [{ required: true, message: "请选择销售价" }]
        },
        {
            label: "尺码国别",
            name: "sizeCountry",
            type: "select",
            data: countryList,
            options: {
                allowClear: true
            }
        },
        {
            label: "销售属性",
            name: "saleAttribute",
            type: "radio",
            rules: [{ required: true }],
            data: saleList,
            options: {
                disabled: true
            }
        },
        {
            label: "尺码",
            name: "skus",
            rules: [{ required: true }],
            render: <Size />
        },
    ];
    const purchaseItems = [
        {
            label: "发货仓库",
            name: "rulesId",
            type: "select",
            data: rulesList
        },
    ];
    const picItems = [
        {
            label: "商品主图",
            name: "mainPicAddress",
            type: "upload",
            rules: [{ required: true, message: "请上传商品主图" }],
            extra: "主图，仅支持上传一张"
        },
        {
            label: "商品详情图",
            name: "detailPicAddress",
            type: "upload",
            rules: [{ required: true, message: "请上传商品详情图" }],
            extra: "支持上传多张，可拖拽调整顺序",
            options: {
                multiple: true,
                limit: false
            }
        },
    ];

    const handleSubmit = values => {
        let payload = {
            ...values,
            ...values.measure,
            thirdCategoryId: values.category[values.category.length - 1],
            id: productId,
            deliveryFee: values.deliveryFeeType
        }
        delete payload.category;
        delete payload.measure;

        requestSpuEdit(payload)
            .then(response => {
                message.success("编辑成功");
                changeSubmitLoading(true);
                history.push("/product/manage");
            })
    }

    return <>
        <Form layout="vertical" form={spuform} scrollToFirstError={true} onFinish={values => {
            changeSubmitLoading(true);
            handleSubmit(values)
        }}>
            <Card title="类目信息" style={style}>
                <MainFormItems layout="vertical" items={cateItems} />
                {/* <Row gutter={16}>
                    <Col {...col1}>
                        <FormItem label="商品类目" name="category" rules={[{ required: true, message: "请输入商品类目" }]}>
                            <Cate />
                        </FormItem>
                    </Col>
                </Row> */}
            </Card>
            <Card title="基础信息" style={style}>
                <MainFormItems layout="vertical" items={baseItems} />
            </Card>
            <Card title="物流运输属性" style={style}>
                <MainFormItems layout="vertical" items={logiItems} />
            </Card>
            <Card title="销售规格" style={style}>
                <MainFormItems layout="vertical" items={specifyItems} />
            </Card>
            <Card title="采购规则" style={style}>
                <MainFormItems layout="vertical" items={purchaseItems} />
            </Card>
            <Card title="商品图片">
                <MainFormItems items={picItems} />
            </Card>
            <Card>
                <Button type="primary" htmlType="submit" loading={submitLoading}>提交</Button>
            </Card>
            {/* <Card title="基础信息" style={style}>
                <Row gutter={16}>
                    <Col {...col1}>
                        <FormItem label="商品名称" name="spuName" rules={[{ required: true, message: "请输入商品名称" }]}>
                            <Input placeholder="请输入商品名称" />
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="商品货号" name="manufactureCode" rules={[{ required: true, message: "请输入商品货号" }]}>
                            <Input placeholder="请输入商品货号" disabled />
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="品牌" name="brandId" rules={[{ required: true, message: "请选择品牌" }]}>
                            <Select
                                placeholder="请选择品牌"
                                allowClear>{
                                    brandList && brandList.map((brand, index) => (
                                        <Option key={brand.key} value={brand.key}>{brand.label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col1}>
                        <FormItem label="产地" name="origin">
                            <Select
                                placeholder="请选择产地"
                                allowClear>{
                                    originList && originList.map((origin, index) => (
                                        <Option key={origin.key} value={origin.key}>{origin.label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="颜色" name="color" rules={[{ required: true, message: "请输入颜色" }]}>
                            <Input placeholder="请输入颜色" />
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="季节" name="season" rules={[{ required: true, message: "请选择季节" }]}>
                            <Select
                                placeholder="请选择季节"
                                allowClear>{
                                    seasonList && seasonList.map((season, index) => (
                                        <Option key={season.key} value={season.key}>{season.label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col1}>
                        <FormItem label="性别" name="sexId" rules={[{ required: true, message: "请选择性别" }]}>
                            <Select
                                placeholder="请选择性别"
                                allowClear>{
                                    sexList && sexList.map((sex, index) => (
                                        <Option key={sex.key} value={sex.key}>{sex.label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="奢侈品属性" name="luxury" rules={[{ required: true, message: "请选择奢侈品属性" }]}>
                            <Select
                                placeholder="请选择奢侈品属性"
                                allowClear>{
                                    luxuryList && luxuryList.map((luxury, index) => (
                                        <Option key={luxury} value={luxury}>{luxury}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="商品材质" name="material">
                            <Input placeholder="请输入商品材质" />
                        </FormItem>
                    </Col>
                    <Col {...col1}>
                        <FormItem label="商品尺寸" name="measure">
                            <Measure />
                        </FormItem>
                    </Col>
                    <Col {...col4}>
                        <FormItem label="详情说明" name="spuDesc">
                            <TextArea
                                autoSize={{ minRows: 6 }}
                                placeholder="请输入"
                            />
                        </FormItem>
                    </Col>
                </Row>
            </Card> */}
            {/* <Card title="物流运输属性" style={style}>
                <Row gutter={16}>
                    <Col {...col1}>
                        <FormItem label="退货服务" name="refundServiceType" rules={[{ required: true, message: "请输入商品名称" }]}>
                            <RadioGroup>
                                {
                                    refundServiceList.map(refund => (
                                        <Radio value={refund.key} key={refund.key}>{refund.label}</Radio>
                                    ))
                                }
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="运费" name="deliveryFeeType" rules={[{ required: true, message: "请输入商品货号" }]}>
                            <RadioGroup>
                                {
                                    deliveryList.map(delivery => (
                                        <Radio value={delivery.key} key={delivery.key}>{delivery.label}</Radio>
                                    ))
                                }
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="发货仓库" name="storage" rules={[{ required: true, message: "请选择发货仓库" }]}>
                            <Select
                                placeholder="请选择发货仓库"
                                disabled
                            >{
                                    storageList && storageList.map((storage, index) => (
                                        <Option key={storage.key} value={storage.key}>{storage.label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col1}>
                        <FormItem label="订单确认时间" name="orderConfirm">
                            <Input disabled placeholder="请输入订单确认时间" />
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="订单发货时间" name="orderDelivery">
                            <Input disabled placeholder="请输入订单发货时间" />
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="商品重量" name="weight">
                            <Input placeholder="请输入，最多1位小数" suffix="KG" />
                        </FormItem>
                    </Col>
                </Row>
            </Card> */}
            {/* <Card title="销售规格" style={style}>
                <Row gutter={16}>
                    <Col {...col1}>
                        <FormItem label="成本价" name="supplierSupplyPrice" rules={[{ required: true, message: "请输入成本价" }]}>
                            <Input disabled placeholder="请输入成本价" />
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="划线价" name="supplierMarketPrice" rules={[{ required: true, message: "请输入划线价" }]}>
                            <Input placeholder="请输入划线价" />
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="销售价" name="sellPrice" rules={[{ required: true, message: "请选择销售价" }]}>
                            <Input placeholder="请输入销售价" />
                        </FormItem>
                    </Col>
                    <Col {...col1}>
                        <FormItem label="尺码国别" name="sizeCountry">
                            <Select
                                placeholder="请选择尺码国别"
                            >{
                                    countryList && countryList.map((country, index) => (
                                        <Option key={country} value={country}>{country}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    </Col>
                    <Col {...col2}>
                        <FormItem label="销售属性" name="saleAttribute" rules={[{ required: true, message: "请选择销售价" }]}>
                            <RadioGroup disabled>
                                {
                                    saleList.map(sale => (
                                        <Radio value={sale} key={sale}>{sale}</Radio>
                                    ))
                                }
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col {...col3}>
                        <FormItem label="尺码" name="skus" rules={[{ required: true, message: "请输入尺码" }]}>
                            <Size />
                        </FormItem>
                    </Col>
                </Row>
            </Card> */}
        </Form>
    </>
}
const mapStateToProps = state => {
    return {
        sexList: state.sexList,
        luxuryList: state.luxuryList,
        countryList: state.countryList,
        deliveryList: state.deliveryList,
        refundServiceList: state.refundServiceList,
        saleList: state.saleList
    }
}

export default connect(mapStateToProps, {})(withRouter(Public));