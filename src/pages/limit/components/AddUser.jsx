import React, { useState, useEffect } from "react";
import MD5 from "js-md5";

import { requestUpdateUser, requestRoleList } from "service/limit";

import { Form, Modal, message } from "antd";
import MainFormItems from "components/MainFormItems";

const AddUser = props => {
    const { visible, onOk, onCancel } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const [loading, changeLoading] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
    }

    useEffect(() => {
        if (visible) {
            requestRoleList()
                .then(response => {
                    setRoleList(response.list.map(role => ({
                        ...role,
                        value: role.backRoleId,
                        label: role.backRoleName
                    })));
                })
        }
    }, [visible])

    const items = [
        {
            label: "姓名",
            name: "backUserName",
            type: "input",
            rules: [{ required: true, message: '姓名不能为空' }]
        },
        {
            label: "登录名",
            name: "backUserAccount",
            type: "input",
            rules: [{ required: true, message: '登录名不能为空' }]
        },
        {
            label: "密码",
            name: "backUserPassword",
            type: "input",
            options: {
                type: "password"
            }
        },
        {
            label: "确认密码",
            name: "backUserPasswordAgain",
            type: "input",
            rules: [
                ({ getFieldValue }) => ({
                    validator(rule, value) {
                        let password = getFieldValue('backUserPassword');
                        if (!password || (password && password === value)) {
                            return Promise.resolve();
                        }
                        return Promise.reject('两次输入的密码不一样');
                    },
                })
            ],
            options: {
                type: "password"
            }
        },
        {
            label: "角色",
            name: "backRoleList",
            type: "checkbox",
            data: roleList,
            rules: [{
                required: true,
                validator(rule, value) {
                    if (value && value.length > 0) {
                        return Promise.resolve();
                    }
                    return Promise.reject('请选择角色');
                }
            }]
        },
    ]
    const handleCancel = () => {
        form.resetFields();
        onCancel();
    }
    const handleSubmit = (values) => {
        let payload = {
            ...values,
            backUserPassword: values.backUserPassword ? MD5(values.backUserPassword) : "",
            backRoleList: values.backRoleList.map(roleId => ({ backRoleId: roleId }))
        };
        delete payload.backUserPasswordAgain;

        requestUpdateUser(payload)
            .then(response => {
                message.success(`${theme}成功`);
                changeLoading(false);
                handleCancel();
                onOk();
            })
    }
    return (
        <Modal form={form} title={`${theme}用户`} visible={visible} okText="确定" cancelText="取消"
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
    )
}

export default AddUser;