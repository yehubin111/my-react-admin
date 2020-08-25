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
    collapsed: false,
    mobileNormalWidth: 576,
    isMobile: true
  };
  componentDidMount() {
    let screenWidth = document.body.clientWidth;
    if (screenWidth < this.state.mobileNormalWidth) {
      this.setState({
        isMobile: true
      })
    } else {
      this.setState({
        isMobile: false
      })
    }
    // 监听屏幕尺寸编号
    // this.screenWatch();
  }
  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.screenResize);
  // }
  // screenWatch() {
  //   window.addEventListener("resize", this.screenResize.bind(this))
  // }
  // screenResize(e) {
  //   console.log(e.target.innerWidth);
  //   if (e.target.innerWidth < this.state.mobileNormalWidth) {
  //     this.setState({
  //       isMobile: true
  //     })
  //   } else {
  //     this.setState({
  //       isMobile: false
  //     })
  //   }
  // }
  onClose() {
    this.setState({
      collapsed: false
    })
  }
  render() {
    const { routes, redirectFrom, redirectTo, redirectKey } = this.props;
    const { collapsed, isMobile } = this.state;
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
              // collapsedWidth={0}
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
            // collapsedWidth={0}
            trigger={null}
            className={styles.sider}
          >
            <div className={`rf jc ${styles.logo}`}>
              <img src={logo} alt="" />
            </div>
            <MenuNav routes={routes} />
          </Sider>
        }
        <wrapContext.Provider value={{
          device: isMobile ? "h5" : "web"
        }}>
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
        </wrapContext.Provider>
      </Layout>
    );
  }
}

export default withRouter(BasicLayout);
