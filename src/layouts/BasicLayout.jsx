import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import styles from "./layout.module.scss";
import defaultConfig from "defaultConfig";
import { wrapContext } from "utils/context";

import { Layout, Drawer } from "antd";
import ContentLayout from "./ContentLayout";
import MenuNav from "./components/MenuNav";
import TopInfo from "./components/TopInfo";
import ThemeTitle from "./components/ThemeTitle";

const { Header, Sider, Content, Footer } = Layout;
const { copyright, logo } = defaultConfig;

class BasicLayout extends Component {
  state = {
    collapsed: false
  }
  onClose() {
    this.setState({
      collapsed: false
    })
  }
  render() {
    const { routes, redirectFrom, redirectTo, redirectKey } = this.props;
    const { collapsed } = this.state;
    return (
      <wrapContext.Consumer>
        {global => {
          const isMobile = global.device === "h5" ? true : false;
          return (
            <Layout>
              {isMobile
                ? <Drawer
                  placement="left"
                  closable={false}
                  bodyStyle={{
                    padding: 0
                  }}
                  onClose={() => {
                    this.onClose();
                  }}
                  visible={collapsed}
                  width="200"
                >
                  <Sider
                    breakpoint="lg"
                    collapsed={false}
                    trigger={null}
                    className={styles.sider}
                  >
                    <div className={`rf jc ${styles.logo}`}>
                      <img src={logo} alt="" />
                    </div>
                    <MenuNav routes={routes} onRoute={() => {
                      this.onClose();
                    }} />
                  </Sider>
                </Drawer>
                : <Sider
                  breakpoint="lg"
                  collapsed={false}
                  trigger={null}
                  className={styles.sider}
                >
                  <div className={`rf jc ${styles.logo}`}>
                    <img src={logo} alt="" />
                  </div>
                  <MenuNav routes={routes} />
                </Sider>
              }
              <Layout
                className={[styles.layout]}
                style={{ marginLeft: !isMobile ? "200px" : "0px" }}
              >
                <Header className={styles.header}>
                  <TopInfo
                    collapsed={this.state.collapsed}
                    isMobile={isMobile}
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
          )
        }}
      </wrapContext.Consumer>
    );
  }
}

export default withRouter(BasicLayout);
