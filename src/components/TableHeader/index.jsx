import React from 'react';

import styles from './index.module.scss';

import { Radio, Space } from 'antd';

const FormHeader = (props) => {
    const { ctrl, tabs, title = "列表表格", onTab } = props;
    const defaultTab = tabs && Array.isArray(tabs) ? tabs.find(tab => tab.default) : null;
    const defaultValue = defaultTab ? defaultTab.key : "";
    return (
        <div className={`rf jsb ac ${styles.header}`}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.ctrl}>
                <Space size="middle">
                    <Radio.Group defaultValue={defaultValue} onChange={e => {
                        onTab(e.target.value);
                    }}>
                        {tabs && tabs.map(tab => <Radio.Button value={tab.key} key={tab.key}>{tab.label}</Radio.Button>)}
                    </Radio.Group>
                    {ctrl}
                </Space>
            </div>
        </div>
    )
}

export default FormHeader;