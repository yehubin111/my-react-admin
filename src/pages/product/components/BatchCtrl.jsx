import React, { useEffect, useState } from "react";

import { useSafeState } from "hooks";
import { requestTopicList, requestRulesList } from "service/common";
import {
    requestSpuAuditStand,
    requestSpuDown,
    requestSpuAddTopic,
    requestSpuSetRules
} from "service/product";

import { Modal, Form, message } from "antd";
import MainFormItems from "components/MainFormItems";

const BatchCtrl = props => {
    const { visible, onCancel, selectedRowKeys, payload, ctrlKey, onOk } = props;
    const [form] = Form.useForm();
    const [topicList, setTopicList] = useSafeState([]);
    const [ruleList, setRuleList] = useSafeState([]);
    const [topicHidden, changeTopicHidden] = useState(false);
    const [standHidden, changeStandHidden] = useState(true);
    const [ruleHidden, changeRuleHidden] = useState(true);
    const [confirmLoading, changeConfirmLoading] = useState(false);
    const actionList = [
        { value: 1, label: "加入专题" },
        { value: 2, label: "上下架" },
        { value: 3, label: "设置采购规则" }
    ]
    const standDownList = [
        { value: 0, label: "批量上架" },
        { value: 1, label: "批量下架" }
    ]
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        initialValues: {
            action: 1,
            isStand: 0
        }
    }
    useEffect(() => {
        requestTopicList()
            .then(response => {
                let list = response.list.map(topic => ({ value: topic.id, label: topic.topicName }));
                setTopicList(list)
            })
        requestRulesList()
            .then(response => {
                let list = response.list.map(rule => ({ value: rule.id, label: rule.rulesName }));
                setRuleList(list)
            })
    }, [])

    const handleCancel = () => {
        form.resetFields();
        changeTopicHidden(false);
        changeStandHidden(true);
        changeRuleHidden(true);
        onCancel();
    }
    const handleOk = () => {
        changeConfirmLoading(false);
        message.success("操作成功");
        onOk();
        handleCancel();
    }
    // 批量上下架
    const toStandOrDown = params => {
        changeConfirmLoading(true);
        if (params.isStand === 0) {
            requestSpuAuditStand(params)
                .then(() => {
                    handleOk();
                })
        } else {
            requestSpuDown(params)
                .then(() => {
                    handleOk();
                })
        }
    }
    // 批量加入专题
    const toAddTopic = params => {
        changeConfirmLoading(true);
        requestSpuAddTopic(params)
            .then(() => {
                handleOk();
            })
    }
    // 批量设置采购规则
    const toSetRules = params => {
        changeConfirmLoading(true);
        requestSpuSetRules(params)
            .then(() => {
                handleOk();
            })
    }
    const handleFinish = values => {
        delete payload.pageIndex;
        delete payload.pageSize;

        let params = {};
        if (values.action === 1) {
            params.topicId = values.topicId;
            if (ctrlKey === "1") {
                params.auditStatus = payload.auditStatus;
                params.ids = selectedRowKeys.join(',');
                toAddTopic(params)
            } else {
                params = Object.assign({}, params, payload);
                toAddTopic(params)
            }
        } else if (values.action === 2) {
            params.isStand = values.isStand;
            if (ctrlKey === "1") {
                params.auditStatus = payload.auditStatus;
                params.ids = selectedRowKeys.join(',');
                toStandOrDown(params);
            } else {
                params = Object.assign({}, params, payload);
                toStandOrDown(params);
            }
        } else {
            params.rulesId = values.rulesId;
            if (ctrlKey === "1") {
                params.auditStatus = payload.auditStatus;
                params.ids = selectedRowKeys.join(',');
                toSetRules(params);
            } else {
                params = Object.assign({}, params, payload);
                toSetRules(params);
            }
        }
    }
    const items = [
        {
            label: "操作类型",
            name: "action",
            type: "radio",
            data: actionList,
            onChange: (e) => {
                if (e.target.value === "1") {
                    changeTopicHidden(false);
                    changeStandHidden(true);
                    changeRuleHidden(true);
                }
                if (e.target.value === "2") {
                    changeTopicHidden(true);
                    changeStandHidden(false);
                    changeRuleHidden(true);
                }
                if (e.target.value === "3") {
                    changeTopicHidden(true);
                    changeStandHidden(true);
                    changeRuleHidden(false);
                }
            },
            options: {
                optionType: "button",
                buttonStyle: "solid"
            }
        },
        {
            label: "专题",
            name: "topicId",
            type: "select",
            hidden: topicHidden,
            data: topicList,
            rules: !topicHidden && [{ required: true, message: "请选择专题" }]
        },
        {
            label: "上下架",
            name: "isStand",
            hidden: standHidden,
            type: "radio",
            data: standDownList
        },
        {
            label: "采购规则",
            name: "setRulesId",
            type: "select",
            hidden: ruleHidden,
            data: ruleList,
            extra: "不选择，默认清除所选商品的采购规则",
            options: {
                allowClear: true
            }
        }
    ]
    return <Modal title="批量操作" visible={visible}
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