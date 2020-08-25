import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { requestUpdateCate } from 'service/product';

import { Modal, Form, message } from 'antd';
import MainFormItems from "components/MainFormItems";

const AddCategory = (props) => {
    const { visible, onCancel, onOk, editData = {}, parent = {}, level } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const [loading, changeLoading] = useState(false);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
    }
    function handleCancel() {
        form.resetFields();
        onCancel();
    }

    useEffect(() => {
        if (parent.nameZh)
            form.setFieldsValue({
                parentName: parent.nameZh
            })
    }, [parent])
    useEffect(() => {
        if (editData.id) {
            form.setFieldsValue({
                nameZh: editData.nameZh
            })
            setTheme("编辑");
        }
    }, [editData]);

    const formItems = [
        {
            label: "上级",
            name: "parentName",
            type: "input",
            options: {
                disabled: true
            }
        },
        {
            label: "类目名称",
            name: "nameZh",
            rules: [{ required: true, message: '请输入类目名称' }],
            type: "input"
        }
    ]
    return (
        <Modal title={`${theme}类目`} visible={visible} confirmLoading={loading} okText="确 定" cancelText="取 消"
            width={600}
            onOk={() => {
                form.submit();
            }}
            onCancel={handleCancel}
        >
            <Form className="form" {...config} form={form} onFinish={values => {
                changeLoading(true);
                values.parentId = parent.id;
                values.categoryLevel = level;
                if (editData.id) values.id = editData.id;
                delete values.parentName;

                requestUpdateCate(values)
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

export default connect(mapStateToProps, {})(AddCategory);