import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { requestChangeInvitecode } from 'service/user';

import { Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;

const AddInviteCode = (props) => {
    const { visible, onCancel, onOk, editId, userInvitationData: { list } } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    function handleCancel() {
        form.resetFields();
        onCancel();
    }

    useEffect(() => {
        if (editId) {
            let editData = list.find(invite => invite.id === editId);
            form.setFieldsValue({
                codeName: editData.codeName
            })
            setTheme("编辑");
        }
    }, [editId]);
    return (
        <Modal title={`${theme}邀请码`} visible={visible} okText="确 定" cancelText="取 消"
            onOk={() => {
                form.submit();
            }}
            onCancel={handleCancel}
        >
            <Form form={form} onFinish={values => {
                if (editId) values.id = editId;
                requestChangeInvitecode(values)
                    .then(() => {
                        message.success(`${theme}成功`);
                        onOk();
                        handleCancel();
                    })
            }}>
                <FormItem
                    label="渠道/用途"
                    name="codeName"
                    rules={[{ required: true, message: '请输入邀请码名称' }]}
                >
                    <Input
                        placeholder="渠道/用途"
                        allowClear
                    />
                </FormItem>
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