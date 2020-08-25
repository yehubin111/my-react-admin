import React, { useState } from 'react';

import { Modal, Input } from 'antd';
const { TextArea } = Input;

const BatchSearch = props => {
    const { visible, onOk, onCancel } = props;
    const [ids, setIds] = useState("");
    const reg = new RegExp("\\n", "g");

    return (
        <Modal title="批量查找商品" visible={visible}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                onOk(ids.replace(reg, ","));
                setIds("");
            }} onCancel={() => {
                onCancel();
                setIds("");
            }}>
            <TextArea row={4} value={ids} placeholder="请输入需要查找的商品ID，多商品以回车区分" onChange={e => {
                setIds(e.target.value);
            }} />
        </Modal>
    )
}

export default BatchSearch;