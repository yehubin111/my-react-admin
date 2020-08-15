import React, { Component, useState, useContext, useEffect, useRef } from 'react';
import { Table, Form, Input } from 'antd';

import styles from "./index.module.scss";

const { Item: FormItem } = Form;

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

const EditableCell = ({ editable, dataIndex, record, title, children, handleSave, ...props }) => {
    const [editing, changeEditing] = useState(false);
    const form = useContext(EditableContext);
    const inputRef = useRef();

    const editSave = async (e) => {
        const values = await form.validateFields();
        const valuesFilter = Object.entries(values).filter(value => value[1]);
        handleSave({ ...record, ...Object.fromEntries(valuesFilter) });
        changeEditing(!editing);
    }
    const toToggleEdit = () => {
        changeEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        })
    }
    useEffect(() => {
        if (editing)
            inputRef.current.focus();
    }, [editing])

    let childNode = children;

    if (editable) {
        childNode = editing
            ? (
                <FormItem
                    name={dataIndex}
                    style={{ marginBottom: 0 }}
                >
                    <Input ref={inputRef} onBlur={editSave} />
                </FormItem>
            )
            : (
                <div onClick={toToggleEdit} className={styles["editable-cell-value-wrap"]}>{children}</div>
            )
    }
    return (
        <td {...props}>{childNode}</td>
    )
}

class EditTable extends Component {
    render() {
        const { onEditChange, ...props } = this.props;

        this.props.columns && this.props.columns.forEach(col => {
            if (col.editable)
                col.onCell = record => ({
                    record,
                    dataIndex: col.dataIndex,
                    editable: col.editable,
                    title: col.title,
                    handleSave: onEditChange
                })
        });
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell
            }
        };
        return (
            <Table
                rowClassName={() => styles["editable-row"]}
                components={components}
                {...props} />
        )
    }
}

export default EditTable;