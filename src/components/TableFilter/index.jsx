import React from 'react';

import { Button, Input, Select, DatePicker, Form, Space } from "antd";

import styles from "./index.module.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Item: FormItem } = Form;

const FormFilter = (props) => {
    const { config, onFilter, filterRef } = props;
    const [form] = Form.useForm();

    const toResetForm = () => {
        form.resetFields();
        // 清空之后再次提交请求列表数据
        form.submit();
    }
    // 可供外部调用的清空筛选栏操作
    const toOnlyReset = () => {
        form.resetFields();
    }
    if (filterRef) {
        filterRef.current = {
            resetFields: toOnlyReset
        }
    }

    return (
        <Form
            form={form}
            className={`rfw ${styles.sort}`}
            layout="inline"
            onFinish={values => {
                onFilter(values);
            }}
        >
            {
                config.map(cfg => {
                    let child, className;
                    let { type, placeholder, data, label, render, ...item } = cfg;

                    // 优先render
                    if (render) {
                        className = styles.sortinput;
                        child = render;
                    } else
                        switch (type) {
                            case "input":
                                className = styles.sortinput;
                                child = <Input
                                    placeholder={placeholder ? placeholder : label}
                                    className={styles.line}
                                    allowClear
                                />;
                                break;
                            case "select":
                                className = styles.sortinput;
                                child = <Select
                                    placeholder={placeholder ? placeholder : label}
                                    className={styles.line}
                                    allowClear>{
                                        data && data.map((dt, index) => (
                                            typeof dt === "object"
                                                ? <Option key={dt.value} value={dt.value}>{dt.label}</Option>
                                                : <Option key={index} value={dt}>{dt}</Option>
                                        ))
                                    }
                                </Select>;
                                break;
                            case "dateRange":
                                className = styles.sortrange;
                                child = <RangePicker
                                    format="YYYY-MM-DD"
                                    className={styles.line}
                                    allowClear
                                    placeholder={placeholder}
                                />;
                                break;
                            default:
                                break;
                        }
                    item.key = item.key ? item.key : item.name;
                    return (
                        <FormItem className={className} {...item}>{child}</FormItem>
                    )
                })
            }
            <FormItem className={styles.sortctrl}>
                <div className={`rf jfe`}>
                    <Space size="middle">
                        <Button
                            htmlType="button"
                            onClick={toResetForm}
                        >
                            重 置
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            搜 索
                        </Button>
                    </Space>
                </div>
            </FormItem>
        </Form>
    )
}

export default FormFilter;