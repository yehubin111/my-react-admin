import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { requestChangeInvitecode } from 'service/user';

import { Modal, Form, message } from 'antd';
import MainFormItems from "components/MainFormItems";

const AddInviteCode = (props) => {
    const { visible, onCancel, onOk, editData } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
    }
    function handleCancel() {
        form.resetFields();
        onCancel();
    }

    useEffect(() => {
        if (editData.id) {
            form.setFieldsValue({
                codeName: editData.codeName
            })
            setTheme("编辑");
        }
    }, [editData]);

    const formItems = [
        {
            label: "渠道/用途",
            name: "codeName",
            rules: [{ required: true, message: '请输入邀请码名称' }],
            type: "input"
        }
    ]
    return (
        <Modal title={`${theme}邀请码`} visible={visible} okText="确 定" cancelText="取 消"
            onOk={() => {
                form.submit();
            }}
            onCancel={handleCancel}
        >
            <Form className="form" {...config} form={form} onFinish={values => {
                if (editData.id) values.id = editData.id;
                requestChangeInvitecode(values)
                    .then(() => {
                        message.success(`${theme}成功`);
                        onOk();
                        handleCancel();
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

export default connect(mapStateToProps, {})(AddInviteCode);