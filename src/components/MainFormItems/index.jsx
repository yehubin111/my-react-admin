import React from "react";

import { Form, Input, DatePicker, Switch, Select, Row, Col, Radio } from "antd";
import Upload from "components/Upload";
const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;


const VerticalItems = ({ col = {}, index, children }) => {
    const col1 = {
        lg: 6,
        md: 12,
        sm: 24
    }
    const col2 = {
        xl: { span: 6, offset: 2 },
        lg: { span: 8 },
        md: { span: 12 },
        sm: 24
    }
    const col3 = {
        xl: { span: 8, offset: 2 },
        lg: { span: 10 },
        md: { span: 24 },
        sm: 24
    }
    return <Col {...eval(`col${index % 3 + 1}`)} {...col}>
        {children}
    </Col>
}

const MainFormItems = props => {
    const { items, layout } = props;

    const getItems = (config) => {
        let child;
        let { type, placeholder, render, data, col, options = {}, ...item } = config;

        // 优先render
        if (render) child = render;
        else
            switch (type) {
                case "input":
                    child = <Input
                        placeholder={placeholder ? placeholder : `请输入${item.label}`}
                        {...options}
                    />;
                    break;
                case "textarea":
                    child = <TextArea
                        autoSize={{ minRows: 6 }}
                        placeholder={placeholder ? placeholder : `请输入${item.label}`}
                        {...options}
                    />;
                    break;
                case "upload":
                    child = <Upload {...options} />;
                    break;
                case "radio":
                    child = <RadioGroup options={Array.isArray(data) && data} {...options} />
                    break;
                case "select":
                    child = <Select
                        placeholder={placeholder ? placeholder : `请选择${item.label}`}
                        {...options}
                    >{
                            data && data.map((dt, index) => (
                                typeof dt === "object"
                                    ? <Option key={dt.value} value={dt.value}>{dt.label}</Option>
                                    : <Option key={index} value={dt}>{dt}</Option>
                            ))
                        }
                    </Select>;
                    break;
                case "dateRange":
                    child = <RangePicker
                        format="YYYY-MM-DD"
                        style={{ width: "100%" }}
                        placeholder={placeholder}
                        {...options}
                    />;
                    break;
                case "switch":
                    child = <Switch
                        {...options}
                    />;
                    break;
                default:
                    break;
            }
        // 默认情况下key等于该行的name
        item.key = item.key ? item.key : item.name;
        return <FormItem {...item}>{child}</FormItem>
    }
    return layout === "vertical"
        ? <Row gutter={16}>
            {items.map((item, index) => {
                return <VerticalItems col={item.col} index={index} key={item.name}>
                    {getItems(item)}
                </VerticalItems>;
            })}
        </Row>
        : items.map(item => {
            return getItems(item)
        })

}

export default MainFormItems;