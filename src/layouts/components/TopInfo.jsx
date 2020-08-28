import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './comp.module.scss';
import head from 'assets/images/head.jpg';
import defaultConfig from "defaultConfig";

import { Dropdown, Menu, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';

const { logo } = defaultConfig;

class TopInfo extends Component {
    render() {
        const { onMenu, collapsed, userInfo, location, isMobile, history } = this.props;
        const menu = (
            <Menu>
                <Menu.Item>
                    <p className={styles.downmenu} onClick={() => {
                        // 保存token
                        localStorage.removeItem(`${defaultConfig.productName}-token`);
                        let redirect = location.pathname;
                        history.push("/base/login?redirect=" + encodeURIComponent(redirect));
                    }}><ExportOutlined /> 退出登录</p>
                </Menu.Item>
                <Menu.Item>
                    <p className={styles.downmenu} onClick={() => {

                    }}><EditOutlined /> 修改密码</p>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className={`rf jsb ac ${styles.top}`}>
                {isMobile ? <div className={`rf ac ${styles.left}`}>
                    <img className={styles.logo} src={logo} alt="" />
                    {
                        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: styles.menu,
                            onClick: onMenu
                        })
                    }
                </div> : <span></span>}
                {/* <Space size="small" className={styles["cache-list"]}> */}
                {/* <Tag className={styles.cache} closeIcon={<CloseOutlined />} closable onClose={() => {}}>
                        商品管理
                    </Tag>
                    <Tag className={styles.cache} closable onClose={() => {}}>
                        banner管理
                    </Tag> */}
                {/* <Button type="primary">商品管理<CloseOutlined /></Button> */}
                {/* <span className={styles.cache}>商品管理<CloseOutlined /></span>
                    <span className={styles.cache}>banner管理<CloseOutlined /></span> */}
                {/* </Space> */}
                <div className={styles.right}>
                    <Dropdown overlay={menu}>
                        <p className={styles.head}>
                            <Avatar className={styles.face} src={head} size={28} />
                            <span className={styles.user}>{userInfo.backUserName}</span>
                        </p>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps, {})(withRouter(TopInfo));