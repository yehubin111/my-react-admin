import React, { useEffect, useState } from "react";

import {
    requestSpuAuditStand
} from "service/product";

import { Modal, Form, message } from "antd";
import MainFormItems from "components/MainFormItems";

const BatchCtrl = props => {
    const { visible, onCancel, selectedRowKeys, payload, ctrlKey, onOk } = props;
    const [form] = Form.useForm();
    const [confirmLoading, changeConfirmLoading] = useState(false);
    const auditList = [
        { value: 0, label: "审核通过上架" },
        { value: 1, label: "审核通过下架" }
    ]
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        initialValues: {
            isStand: 0
        }
    }

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    }
    // 批量上下架
    const toAudit = params => {
        changeConfirmLoading(true);
        requestSpuAuditStand(params)
            .then(() => {
                changeConfirmLoading(false);
                message.success("操作成功");
                onOk();
                handleCancel();
            })
    }
    const handleFinish = values => {
        delete payload.pageIndex;
        delete payload.pageSize;

        let params = {};
        params.isStand = values.isStand;
        if (ctrlKey === "1") {
            params.auditStatus = payload.auditStatus;
            params.ids = selectedRowKeys.join(',');
            toAudit(params);
        } else {
            params = Object.assign({}, params, payload);
            toAudit(params);
        }
    }
    const items = [
        {
            label: "审核上下架",
            name: "isStand",
            type: "radio",
            data: auditList
        }
    ]
    return <Modal title="批量审核" visible={visible}
        width={600}
        okText="确定"
        cancelText="取消"
        confirmLoading={confirmLoading}
        onOk={() => {
            form.submit();
        }} onCancel={() => {
            handleCancel();
        }}>
        <Form form={form} {...config} onFinish={values => {
            handleFinish(values);
        }}>
            <MainFormItems items={items} />
        </Form>
    </Modal>
}

export default BatchCtrl;