import React, { Component } from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";

import styles from "./layout.module.scss";
import defaultConfig from "defaultConfig";

import ContentLayout from "./ContentLayout";
import MenuNav from "./components/MenuNav";
import TopInfo from "./components/TopInfo";
import ThemeTitle from "./components/ThemeTitle";

const { Header, Sider, Content, Footer } = Layout;
const { copyright, logo } = defaultConfig;

class BasicLayout extends Component {
  state = {
    collapsed: false
  };
  componentDidMount() { }
  render() {
    const { routes, redirectFrom, redirectTo, redirectKey } = this.props;
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsed={this.state.collapsed}
          className={styles.sider}
          onBreakpoint={() => {
            
          }}
        >
          <div className={`rf jc ${styles.logo}`}>
            <img src={logo} alt="" />
          </div>
          <MenuNav routes={routes} />
        </Sider>
        <Layout className={[styles.layout, styles.navLayout]}>
          <Header className={styles.header}>
            <TopInfo
              collapsed={this.state.collapsed}
              onMenu={() => {
                this.setState({
                  collapsed: !this.state.collapsed
                });
              }}
            />
          </Header>
          <ThemeTitle routes={routes} />
          <Content className={styles.content}>
            <ContentLayout
              routes={routes}
              redirectFrom={redirectFrom}
              redirectTo={redirectTo}
              redirectKey={redirectKey}
            />
          </Content>
          <Footer className={styles.footer}>{copyright}</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(BasicLayout);
