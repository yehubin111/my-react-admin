import React, { useEffect } from 'react';

import { Button, Input, Select, DatePicker, Form, Space } from "antd";

import styles from "./index.module.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Item: FormItem } = Form;

const FormFilter = (props) => {
    const { config, onSearch, onReset, setForm } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        setForm && setForm(form);
    }, [])

    const formReset = () => {
        form.resetFields();
        // 重置数据回调
        onReset && onReset();
        // 清空之后再次提交请求列表数据
        form.submit();
    }

    return (
        <Form
            form={form}
            className={`rfw ${styles.sort}`}
            layout="inline"
            onFinish={values => {
                onSearch(values);
            }}
        >
            {
                config.map(cfg => {
                    let child, className;
                    switch (cfg.type) {
                        case "input":
                            className = styles.sortinput;
                            child = <Input
                                placeholder={cfg.placeholder ? cfg.placeholder : cfg.title}
                                className={styles.line}
                                allowClear
                            />;
                            break;
                        case "select":
                            className = styles.sortinput;
                            child = <Select
                                placeholder={cfg.placeholder ? cfg.placeholder : cfg.title}
                                className={styles.line}
                                allowClear>{
                                    cfg.data.map((dt, index) => (
                                        typeof dt === "object"
                                            ? <Option key={dt.key} value={dt.key}>{dt.name}</Option>
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
                                placeholder={cfg.placeholder}
                            />;
                            break;
                        default:
                            break;
                    }

                    return (
                        <FormItem name={cfg.key} key={cfg.key} className={className}>{child}</FormItem>
                    )
                })
            }
            <FormItem className={styles.sortctrl}>
                <div className={`rf jfe`}>
                    <Space size="middle">
                        <Button
                            htmlType="button"
                            onClick={formReset}
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