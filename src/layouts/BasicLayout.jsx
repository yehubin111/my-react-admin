import React, { Component } from 'react';
import { Layout } from 'antd';
import ContentLayout from './ContentLayout';
import MenuNav from './components/MenuNav';

const { Header, Sider, Content, Footer } = Layout;

class BasicLayout extends Component {
    render() {
        return (
            <Layout>
                <Sider>
                    <span className="logo">
                        <img src=""/>
                    </span>
                    <MenuNav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content>
                        <ContentLayout />
                    </Content>
                    <Footer></Footer>
                </Layout>
            </Layout>
        )
    }
}

export default BasicLayout;