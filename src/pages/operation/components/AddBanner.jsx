import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { requestTopicList } from 'service/common';
import { requestChangeBannerStatus } from 'service/operation';
import { saveTopic } from 'actions';

import { Modal, Form, Radio, Select, message } from "antd";
import MainFormItems from "components/MainFormItems";
const { Option } = Select;
const { Group: RadioGroup } = Radio;

// 绑定类型组件
const Column = ({ value = {}, onChange, topicData }) => {
    const handleChange = (val) => {
        onChange({
            ...value,
            columnContent: val
        });
    }
    const options = [
        { label: '专题', value: 0 }
    ]
    return (
        <div className="rf ac">
            <RadioGroup options={options} value={value.columnType} />
            <Select
                placeholder="请选择绑定专题"
                value={value.columnContent}
                onChange={handleChange}
            // className={styles.sortselect}
            >{
                    topicData.list.map(topic => (
                        <Option key={topic.id} value={topic.id}>{topic.topicName}</Option>
                    ))
                }
            </Select>
        </div>
    )
}
const AddBanner = (props) => {
    const { visible, editData: banner, onOk, onCancel, topicData, saveTopic } = props;
    const [loading, changeLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme, setTheme] = useState("新增");
    const config = {
        labelCol: { span: 5 },
        wrapperCol: { span: 17 },
        initialValues: {
            shelfStatus: false,
            column: {
                columnType: 0,
                columnContent: undefined
            }
        }
    }
    const timeFormat = "YYYY-MM-DD HH:mm:ss";

    function handleCancel() {
        form.resetFields();
        onCancel();
    }
    // 获取专题列表
    useEffect(() => {
        requestTopicList()
            .then(response => {
                saveTopic(response);
            })
    }, []);
    useEffect(() => {
        if (!banner.id) return;
        form.setFieldsValue({
            columnTitle: banner.columnTitle,
            columnPic: banner.columnPic,
            time: [
                moment(new Date(banner.startTime), timeFormat),
                moment(new Date(banner.endTime), timeFormat)
            ],
            column: {
                columnType: banner.columnType,
                columnContent: banner.columnContent * 1
            },
            shelfStatus: Boolean(banner.shelfStatus)
        })
        setTheme("编辑");
    }, [banner, form])

    const handleSubmit = (values) => {
        let payload = {
            isBanner: 0,
            ...values,
            ...values.column
        }
        payload.shelfStatus = Number(payload.shelfStatus);
        payload.startTime = values.time[0].format("YYYY-MM-DD HH:mm:ss");
        payload.endTime = values.time[1].format("YYYY-MM-DD HH:mm:ss");
        delete payload.time;
        delete payload.column;
        // 编辑
        if (banner.id) payload.id = banner.id;

        requestChangeBannerStatus(payload)
            .then(() => {
                message.success(`${theme}成功`);
                changeLoading(false);
                handleCancel();
                onOk();
            })
    }

    const items = [
        {
            label: "banner标题",
            name: "columnTitle",
            type: "input",
            rules: [{ required: true, message: 'banner标题不能为空' }],
            placeholder: "请输入标题，最多20个字"
        },
        {
            label: "图片",
            name: "columnPic",
            type: "upload",
            rules: [{ required: true, message: '请上传图片' }],
            extra: "图片尺寸为1035*600，支持jpg、png、jpeg格式文件"
        },
        {
            label: "展示时间",
            name: "time",
            type: "daterange",
            rules: [{ required: true, message: '请选择展示时间' }],
            options: {
                showTime: true,
                format: timeFormat
            }
        },
        {
            label: "绑定类型",
            name: "column",
            rules: [{
                required: true,
                validator: (rule, value) => {
                    if (value.columnContent) {
                        return Promise.resolve();
                    }
                    return Promise.reject("请选择专题")
                }
            }],
            render: <Column topicData={topicData} />
        },
        {
            label: "是否上架",
            name: "shelfStatus",
            type: "switch",
            valuePropName: "checked",
            options: {
                checkedChildren: "上架",
                unCheckedChildren: "下架"
            }
        },
    ]

    return (
        <Modal form={form} title={`${theme}banner`} visible={visible} okText="确定" cancelText="取消"
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
                {/* <FormItem
                    label="banner标题"
                    name="columnTitle"
                    rules={[{ required: true, message: 'banner标题不能为空' }]}
                >
                    <Input placeholder="请输入标题，最多20个字" />
                </FormItem>
                <FormItem
                    label="图片"
                    name="columnPic"
                    rules={[{ required: true, message: '请上传图片' }]}
                    extra="图片尺寸为1035*600，支持jpg、png、jpeg格式文件"
                >
                    <Upload />
                </FormItem>
                <FormItem
                    label="展示时间"
                    name="time"
                    rules={[{ required: true, message: '请选择展示时间' }]}
                >
                    <RangePicker
                        format={timeFormat}
                        showTime
                        className={styles.sortrange}
                        placeholder={['开始时间', '截止时间']}
                    />
                </FormItem>
                <FormItem
                    label="绑定类型"
                    name="column"
                    rules={[{
                        required: true,
                        validator: (rule, value) => {
                            if (value.columnContent) {
                                return Promise.resolve();
                            }
                            return Promise.reject("请选择专题")
                        }
                    }]}
                >
                    <Column topicData={topicData} />
                </FormItem>
                <FormItem
                    label="是否上架"
                    name="shelfStatus"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                </FormItem> */}
            </Form>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        topicData: state.topicData
    }
}

export default connect(mapStateToProps, { saveTopic })(AddBanner);