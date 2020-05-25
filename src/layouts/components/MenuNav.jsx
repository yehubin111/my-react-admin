import React, { Component } from 'react';
import { Menu, Button } from 'antd';
import { PieChartOutlined } from '@ant-design/icons'

class MenuNav extends Component {
    render() {
        return (
            <Menu theme="dark" mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>nav1</Menu.Item>
                <Menu.Item key="2" icon={<PieChartOutlined />}>nav2</Menu.Item>
                <Menu.Item key="3" icon={<PieChartOutlined />}>nav3</Menu.Item>
                <Menu.SubMenu key="sub1" icon={<PieChartOutlined />} title="Navigation">
                    <Menu.Item key="4">nav4</Menu.Item>
                    <Menu.Item key="5">nav5</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="sub2" icon={<PieChartOutlined />} title="Navigation">
                    <Menu.Item key="6">nav4</Menu.Item>
                    <Menu.Item key="7">nav5</Menu.Item>
                </Menu.SubMenu>
            </Menu>
        )
    }
}

export default MenuNav;