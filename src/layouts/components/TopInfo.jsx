import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styles from './comp.module.scss';
import logo from '../../assets/images/logo.png';
import { loginOut } from 'actions';

import { Dropdown, Menu, Space, Button, Tag } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, ExportOutlined, CloseOutlined } from '@ant-design/icons';


class TopInfo extends Component {
    render() {
        const { onMenu, collapsed, userInfo, loginOut, location } = this.props;
        const menu = (
            <Menu>
                <Menu.Item>
                    <p className={styles.downmenu} onClick={() => {
                        loginOut(location.pathname);
                    }}><ExportOutlined /> 退出登录</p>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className={`rf jfe ac ${styles.top}`}>
                {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: styles.menu,
                    onClick: onMenu
                })} */}
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
                            <img className={styles.face} src={logo} alt="" />
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

export default connect(mapStateToProps, { loginOut })(withRouter(TopInfo));