import React from 'react';

import styles from './index.module.scss';

const FormHeader = (props) => {
    const { ctrl, title = "列表表格" } = props;
    return (
        <div className={`rf jsb ac ${styles.header}`}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.ctrl}>{ctrl}</div>
        </div>
    )
}

export default FormHeader;