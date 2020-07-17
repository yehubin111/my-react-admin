import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { requestTopicList } from 'service/common';
import { requestChangeBannerStatus } from 'service/operation';
import { saveTopic } from 'actions';

import { Modal, Form, Input, DatePicker, Radio, Select, Switch, message } from "antd";
import Upload from "components/Upload";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
        <>
            <RadioGroup options={options} value={value.columnType} />
            <Select
                placeholder="请选择绑定专题"
                className="select"
                value={value.columnContent}
                onChange={handleChange}
            >{
                    topicData.list.map(topic => (
                        <Option key={topic.id} value={topic.id}>{topic.topicName}</Option>
                    ))
                }
            </Select>
        </>
    )
}
const AddBanner = (props) => {
    const { visible, editId, bannerList: { list }, onOk, onCancel, topicData, saveTopic } = props;
    const [loading, changeLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme, changeTheme] = useState("新增");
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 15 },
        initialValues: {
            shelfStatus: false,
            column: {
                columnType: 0,
                columnContent: undefined
            }
        }
    };
    const timeFormat = "YYYY-MM-DD HH:mm:ss";

    function modalCancel() {
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
        if (!editId) return;
        let banner = list.find(banner => banner.id === editId);
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
        changeTheme("编辑");
    }, [editId])

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
        if (editId) payload.id = editId;

        requestChangeBannerStatus(payload)
            .then(() => {
                message.success(`${theme}成功`);
                changeLoading(false);
                modalCancel();
                onOk();
            })
    }

    return (
        <Modal form={form} title={`${theme}banner`} visible={visible} okText="确定" cancelText="取消"
            width={600}
            confirmLoading={loading}
            onCancel={modalCancel}
            onOk={() => {
                form.submit();
            }}
        >
            <Form className="form" {...layout} form={form} onFinish={values => {
                changeLoading(true);
                handleSubmit(values);
            }}>
                <FormItem
                    label="banner标题"
                    name="columnTitle"
                    rules={[{ required: true, message: 'banner标题不能为空' }]}
                >
                    <Input placeholder="请输入标题，最多20个字" className="input" />
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
                        className="timerange"
                        format={timeFormat}
                        showTime
                        placeholder={['开始时间', '截止时间']}
                    />
                </FormItem>
                <FormItem
                    label="绑定类型"
                    name="column"
                    rules={[{
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
                </FormItem>
            </Form>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        topicData: state.topicData,
        bannerList: state.bannerList
    }
}

export default connect(mapStateToProps, { saveTopic })(AddBanner);