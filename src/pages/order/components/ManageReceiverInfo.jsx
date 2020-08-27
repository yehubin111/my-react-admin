import React, { useState, useEffect } from "react";

import { requesetUpdateReceiver } from "service/order";

import { Modal, Form, message } from "antd";
import MainFormItems from "components/MainFormItems";
import Area from "components/Area";

const ReceiverInfo = props => {
    const { visible, receiver, onCancel, onOk } = props;
    const [form] = Form.useForm();
    const [loading, changeLoading] = useState(false);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
    }

    useEffect(() => {
        if (receiver.orderId) {
            form.setFieldsValue({
                receiverName: receiver.receiverName,
                receiverPhone: receiver.receiverPhone,
                receiverArea: [receiver.receiverProvince, receiver.receiverCity, receiver.receiverRegion],
                receiverAddress: receiver.receiverAddress
            })
        }
    }, [receiver]);

    const items = [
        {
            label: "收货人",
            name: "receiverName",
            type: "input",
            rules: [{ required: true, message: "请输入收货人" }]
        },
        {
            label: "收货人手机",
            name: "receiverPhone",
            type: "input",
            rules: [{ required: true, message: "请输入收货人手机" }]
        },
        {
            label: "省市区",
            name: "receiverArea",
            rules: [{ required: true, message: "请输入收货人手机" }],
            render: <Area />
        },
        {
            label: "收货地址",
            name: "receiverAddress",
            type: "input",
            rules: [{ required: true, message: "请输入收货地址" }]
        }
    ]
    const handleCancel = () => {
        form.resetFields();
        changeLoading(false);
        onCancel();
    }
    const handleSubmit = values => {
        let payload = {
            ...values
        }
        payload.receiverProvince = payload.receiverArea[0];
        payload.receiverCity = payload.receiverArea[1];
        payload.receiverRegion = payload.receiverArea[2];
        payload.orderId = receiver.orderId;
        delete payload.receiverArea;

        requesetUpdateReceiver(payload)
            .then(response => {
                message.success("修改成功");
                handleCancel();
                onOk();
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

export default ReceiverInfo;