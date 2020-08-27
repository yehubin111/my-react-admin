import React, { useState, useEffect } from "react";

import { requestMenuList, requestUpdateRole } from "service/limit";

import { Modal, Form, TreeSelect, message } from "antd";
import MainFormItems from "components/MainFormItems";
// const { SHOW_PARENT } = TreeSelect;

const MenuTree = ({ value, onChange, list }) => {
    const handleChange = (e) => {
        onChange(e)
    }
    return <TreeSelect
        value={value}
        onChange={(e) => {
            handleChange(e)
        }}
        // showCheckedStrategy={SHOW_PARENT}
        placeholder="请选择角色权限"
        treeCheckable
        treeData={list}
    />
}
const AddRole = props => {
    const { visible, onCancel, onOk, editData: role } = props;
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新建");
    const [loading, changeLoading] = useState(false);
    const [backMenuList, setBackMenuList] = useState([]);
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 }
    }

    const menuListFormat = menuList => {
        let list = [];
        let arr = [];
        arr.push({ parent: list, source: menuList });
        while (arr.length > 0) {
            let menus = arr.shift();

            menus.source.forEach(menu => {
                let obj = {
                    title: menu.backMenuName,
                    key: menu.backMenuId,
                    value: menu.backMenuId
                }
                if (menu.backMenuList && menu.backMenuList.length > 0) {
                    obj.children = [];
                    arr.push({ parent: obj.children, source: menu.backMenuList });
                }
                menus.parent.push(obj);
            })
        }
        return list;
    }
    useEffect(() => {
        if (visible)
            requestMenuList()
                .then(response => {
                    let list = menuListFormat(response.list);
                    setBackMenuList(list);
                })
    }, [visible])
    useEffect(() => {
        if (!role.backRoleId) return;
        form.setFieldsValue({
            backRoleName: role.backRoleName,
            backMenuList: role.backMenuList.map(menu => menu.backMenuId)
        })
        setTheme("修改");
    }, [role])

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    }
    const handleSubmit = (values) => {
        values.backMenuList = values.backMenuList.map(menuId => ({ backMenuId: menuId }))
        if (role.backRoleId) values.backRoleId = role.backRoleId;
        requestUpdateRole(values)
            .then(() => {
                message.success(`${theme}成功`);
                changeLoading(false);
                handleCancel();
                onOk();
            })
    }
    const items = [
        {
            label: "角色名称",
            name: "backRoleName",
            type: "input",
            rules: [{ required: true, message: "请输入角色名称" }]
        },
        {
            label: "角色权限设置",
            name: "backMenuList",
            rules: [{ required: true, message: "请选择角色权限" }],
            render: <MenuTree list={backMenuList} />
        }
    ]
    return <Modal form={form} title={`${theme}角色`} visible={visible} okText="确定" cancelText="取消"
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

export default AddRole;