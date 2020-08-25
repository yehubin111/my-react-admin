import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { requestUpdateRule } from 'service/product';

import { Modal, Form, message, Radio, Input } from 'antd';
import MainFormItems from "components/MainFormItems";

const RuleType = ({ value = {}, onChange }) => {
    const [typeInfo, setTypeInfo] = useState({ unit: "元", placeholder: "请输入大于500小于1000000的整数" })
    const handleChange = (key, val) => {
        onChange({
            ...value,
            [key]: val
        });
    }
    const options = [
        { label: '消费金额', value: 1 },
        { label: '采购数量', value: 2 }
    ]
    return (
        <>
            <Radio.Group style={{ margin: "5px 0 10px" }} options={options} value={value.rulesType}
                onChange={(e) => {
                    if (e.target.value === 1)
                        setTypeInfo({ unit: "元", placeholder: "请输入大于500小于1000000的整数" })
                    else
                        setTypeInfo({ unit: "件", placeholder: "请输入大于2小于100的整数" })

                    onChange({
                        ...value,
                        rulesType: e.target.value,
                        rulesValue: ""
                    })
                }}
            />
            <Input prefix="满" suffix={`${typeInfo.unit} 可成单`} value={value.rulesValue} placeholder={typeInfo.placeholder}
                onChange={(e) => {
                    handleChange("rulesValue", e.target.value);
                }}
            />
        </>
    )
}
const AddRule = (props) => {
    const { visible, onCancel, onOk, editData = {} } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const [loading, changeLoading] = useState(false);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        initialValues: {
            rules: {
                rulesType: 1,
                rulesValue: ""
            }
        }
    }
    function handleCancel() {
        form.resetFields();
        onCancel();
    }

    useEffect(() => {
        if (editData.id) {
            form.setFieldsValue({
                rulesName: editData.rulesName,
                rules: {
                    rulesType: editData.rulesType,
                    rulesValue: editData.rulesValue
                }
            })
            setTheme("编辑");
        }
    }, [editData]);

    const formItems = [
        {
            label: "规则名称",
            name: "rulesName",
            placeholder: "50个字符以内",
            type: "input"
        },
        {
            label: "规则类型",
            name: "rules",
            rules: [{
                required: true,
                validator: (rule, value) => {
                    if (value.rulesType === 1) {
                        if (!value.rulesValue)
                            return Promise.reject("请选择输入消费金额规则")
                        if (value.rulesValue * 1 <= 500 || value.rulesValue * 1 >= 1000000)
                            return Promise.reject("消费金额必须大于500小于1000000")
                    } else {
                        if (!value.rulesValue)
                            return Promise.reject("请选择输入采购数量规则")
                        if (value.rulesValue * 1 <= 2 || value.rulesValue * 1 >= 100)
                            return Promise.reject("采购数量必须大于2小于100")
                    }
                    return Promise.resolve();
                }
            }],
            render: <RuleType />
        }
    ]
    return (
        <Modal title={`${theme}采购规则`} visible={visible} confirmLoading={loading} okText="确 定" cancelText="取 消"
            width={600}
            onOk={() => {
                form.submit();
            }}
            onCancel={handleCancel}
        >
            <Form className="form" {...config} form={form} onFinish={values => {
                changeLoading(true);
                let payload = {
                    ...values,
                    ...values.rules
                }
                delete payload.rules;
                if (editData.id) payload.id = editData.id;

                requestUpdateRule(payload)
                    .then(() => {
                        message.success(`${theme}成功`);
                        changeLoading(false);
                        onOk();
                        handleCancel();
                    })
                    .catch(() => {
                        changeLoading(false);
                    })
            }}>
                <MainFormItems items={formItems} />
            </Form>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        userInvitationData: state.userInvitationData
    }
}

export default connect(mapStateToProps, {})(AddRule);