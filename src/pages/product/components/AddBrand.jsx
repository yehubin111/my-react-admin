import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { requestUpdateBrand } from 'service/product';

import { Modal, Form, message } from 'antd';
import MainFormItems from "components/MainFormItems";

const AddBrand = (props) => {
    const { visible, onCancel, onOk, editData = {} } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const [loading, changeLoading] = useState(false);
    const config = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
    }
    function handleCancel() {
        form.resetFields();
        onCancel();
    }

    useEffect(() => {
        if (editData.id) {
            form.setFieldsValue({
                nameZh: editData.nameZh,
                nameEn: editData.nameEn
            })
            setTheme("编辑");
        }
    }, [editData]);

    const formItems = [
        {
            label: "品牌名称(中文)",
            name: "nameZh",
            placeholder: "50个字符以内",
            type: "input"
        },
        {
            label: "品牌名称(英文)",
            name: "nameEn",
            rules: [{ required: true, message: '请输入英文名称' }],
            placeholder: "50个字符以内",
            type: "input"
        }
    ]
    return (
        <Modal title={`${theme}品牌`} visible={visible} confirmLoading={loading} okText="确 定" cancelText="取 消"
            onOk={() => {
                form.submit();
            }}
            onCancel={handleCancel}
        >
            <Form className="form" {...config} form={form} onFinish={values => {
                changeLoading(true);
                if (editData.id) values.id = editData.id;

                requestUpdateBrand(values)
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

export default connect(mapStateToProps, {})(AddBrand);