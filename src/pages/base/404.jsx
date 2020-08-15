import React from 'react';
import { Result, Button } from 'antd';
import { withRouter } from "react-router-dom";

import styles from "./page.module.scss";

const NoMatch = (props) => {
    return (
        <div className={`rf ac jc ${styles.unusual}`}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => {
                    props.history.push("/");
                }}>Back Home</Button>}
            />
        </div>
    )
}

export default withRouter(NoMatch);