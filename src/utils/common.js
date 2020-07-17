import React from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export function easyModal(message, fn) {
    Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `是否${message}`,
        okText: '确 认',
        cancelText: '取 消',
        onOk: fn
    });
}

// 根据二进制流导出excel
export function exportExcelFromData({ data, filename }) {
    let excelBlob = new Blob([data], {
        type: 'application/vnd.ms-excel'
    });

    // 创建一个a标签
    let oA = document.createElement("a");
    // 利用URL.createObjectURL()方法为a元素生成blob URL
    oA.href = URL.createObjectURL(excelBlob);
    // 给文件命名
    oA.download = `${filename}.xlsx`;
    // 模拟点击
    oA.click();
}