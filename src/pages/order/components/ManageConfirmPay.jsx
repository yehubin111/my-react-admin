import React, { useState } from "react";

import { requestConfirmPay } from "service/order";

import { Modal, Form, message } from "antd";
import MainFormItems from "components/MainFormItems";

const ConfirmPay = props => {
    const { visible, orderId, onCancel, onOk } = props;
    const [form] = Form.useForm();
    const [loading, changeLoading] = useState(false);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        initialValues: {
            payType: "1"
        }
    }
    const payTypeList = [
        {
            label: "线下支付宝转账",
            value: "1"
        },
        {
            label: "线下银行转账",
            value: "2"
        }
    ]

    const items = [
        {
            label: "付款方式",
            name: "payType",
            type: "radio",
            data: payTypeList
        },
        {
            label: "付款流水号",
            name: "payTradeNo",
            type: "input",
            rules: [{ required: true, message: "请输入付款流水号" }]
        },
        {
            label: "实付金额",
            name: "totalFee",
            type: "input",
            rules: [{ required: true, message: "请输入实付金额" }],
            options: {
                prefix: "￥",
                suffix: "元"
            }
        },
        {
            label: "操作密码",
            name: "orderSetPaidPwd",
            type: "input",
            rules: [{ required: true, message: "请输入收货地址" }],
            options: {
                type: "password"
            }
        }
    ]
    const handleCancel = () => {
        form.resetFields();
        changeLoading(false);
        onCancel();
    }
    const handleSubmit = values => {
        let payload = {
            ...values,
            orderId
        }

        requestConfirmPay(payload)
            .then(response => {
                message.success("确认成功");
                handleCancel();
                onOk();
            }).catch(() => {
                changeLoading(false);
            })
    }
    return <Modal title="收货人详情" visible={visible} okText="确定" cancelText="取消"
        width={600}
        confirmLoading={loading}
        onCancel={handleCancel}
        onOk={() => {
            form.submit();
        }}
    >
        <Form className="form" {...config} form={form} onFinish={values => {
            changeLoading(true);
            handleSubmit(values);
        }}>
            <MainFormItems items={items} />
        </Form>
    </Modal>
}

export default ConfirmPay;