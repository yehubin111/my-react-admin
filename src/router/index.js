import React, { Component } from "react";
import { Switch, Route, Redirect, BrowserRouter, Router } from "react-router-dom";
import { connect } from "react-redux";

import history from "utils/history";
import { wrapContext } from "utils/context";
import defaultConfig from "defaultConfig";
import { routerConfig, moduleRouter, baseRouter } from "./config";

class RouteConfig extends Component {
  state = {
    isMobile: false,
    mobileNormalWidth: 576
  }
  // 路由权限判断
  getLimitMenus() {
    let menus = [];
    let { userInfo: baseStorage } = this.props;
    /**
     * 20200828删除token判断条件
     * token丢失情况下，依然会生成路由
     * 重新登录逻辑在进入路由中执行
     */
    let limits = baseStorage.backMenuList ? baseStorage.backMenuList : [];

    // 尝试过循环，不太好实现子路由为空不添加父路由的逻辑，所以选择递归
    function toCycleLimit(lms, rts, ms, noLimit) {
      rts.forEach(rt => {
        /**
         * noLimit为true的直接添加，否则按照name匹配权限路由
         * 父级noLimit则子级继承noLimit
         * token失效权限判断时需要用到
         */
        if (noLimit || rt.noLimit) {
          rt.noLimit = true;
          if (rt.children) {
            let child = rt.children;
            rt.children = [];
            toCycleLimit(null, child, rt.children, rt.noLimit);
          }
          ms.push(rt);
        } else {
          let limit = lms.find(lm => lm.backMenuName === (rt.meta && rt.meta.name));
          if (limit) {
            if (rt.children) {
              // 由于引用，会影响原数组
              let child = rt.children;
              rt.children = [];
              toCycleLimit(limit.backMenuList, child, rt.children);
            }
            if (rt.children && rt.children.length > 0)
              rt.redirect = rt.children[0].path;
            if ((rt.children && rt.children.length > 0) || !rt.children)
              ms.push(rt);
          }
        }
      })
    }
    toCycleLimit(limits, moduleRouter, menus);
    // 为了兼容缓存无菜单的情况，需要返回结果
    return menus;
  }
  setRedirectLink(menus) {
    /**
     * basic重定向逻辑
     * 如果获取到权限路由，并且可以拿到受权限约束的路由，则basic重定向路径为该页面
     * 否则重定向路径为登录页
     */
    let mode = menus.find(router => !router.hidden);
    let base = moduleRouter.find(router => router.key === 'base');
    let basic = baseRouter.find(router => router.key === 'basic');
    let redirect = !mode ? base.redirect : mode.redirect;

    basic.redirect = redirect;
    return redirect;
  }
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
    // // 监听屏幕尺寸变化
    // this.screenWatch();
  }
  componentWillUnmount() {
    console.log("unbind resize")
    window.removeEventListener("resize", this.screenResize.bind(this));
  }
  screenWatch() {
    console.log("bind resize")
    window.addEventListener("resize", this.screenResize.bind(this))
  }
  screenResize(e) {
    console.log(e.target.innerWidth);
    if (e.target.innerWidth < this.state.mobileNormalWidth) {
      this.setState({
        isMobile: true
      })
    } else {
      this.setState({
        isMobile: false
      })
    }
  }
  render() {
    // const { token } = this.props;
    const { isMobile } = this.state;
    let menus = this.getLimitMenus();
    // 设置basic重定向地址
    this.setRedirectLink(menus);

    return (
      <wrapContext.Provider value={{
        device: isMobile ? "h5" : "web"
      }}>
        <BrowserRouter>
          <Switch>
            {routerConfig.map(router => {
              if (router.path === "/") {
                return <Redirect exact key={router.key} from={router.path} to={router.redirect}></Redirect>
              } else {
                let component = require(`../${
                  router.children ? "layouts" : "pages"
                  }${router.component}`).default;
                return (
                  <Route
                    path={router.path}
                    key={router.key}
                    render={() => {
                      // 拿到权限路由之后，渲染子路由
                      menus = this.getLimitMenus();
                      return React.createElement(component, {
                        routes: menus,
                        redirectFrom: router.path,
                        redirectTo: router.redirect,
                        redirectKey: router.key
                      })
                    }}
                  />
                );
              }
            })}
          </Switch>
        </BrowserRouter>
      </wrapContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    token: localStorage.getItem(`${defaultConfig.productName}-token`)
  }
}

export default connect(mapStateToProps, {})(RouteConfig)