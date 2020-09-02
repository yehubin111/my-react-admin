import React, { Component } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";

import { wrapContext } from "utils/context";
import defaultConfig from "defaultConfig";
import { moduleRouter } from "./config";

const { productName } = defaultConfig;

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
    // 先处理最外层layout路由
    moduleRouter.forEach(layoutRouter => {
      if (layoutRouter.children) {
        let child = layoutRouter.children;
        layoutRouter.children = [];
        let router = {
          ...layoutRouter
        }
        toCycleLimit(limits, child, layoutRouter.children);
        router.redirect = router.children[0]
          ? (router.children[0].redirect || router.children[0].path)
          : "";
        menus.push(router)
      }
    })

    // 为了兼容缓存无菜单的情况，需要返回结果
    return menus;
  }
  setRedirectLink(menus) {
    /**
     * basic重定向逻辑
     * 如果获取到权限路由，并且可以拿到受权限约束的路由，则basic重定向路径为该页面
     * 否则重定向路径为登录页
     */
    let mode = menus.find(router => router.key === 'BasicLayout');
    let base = menus.find(router => router.key === 'BlankLayout');
    let redirect = !mode.redirect ? base.redirect : mode.redirect;

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
  // componentWillUnmount() {
  //   console.log("unbind resize")
  //   window.removeEventListener("resize", this.screenResize.bind(this));
  // }
  // screenWatch() {
  //   console.log("bind resize")
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
  // routerMerge(oldRouters) {
  //   let newRouters = [];
  //   // 针对第一层路由，如果组件地址相同，则抽离出一层，当做共同的最外层
  //   oldRouters.forEach(oldRt => {
  //     let layoutRt = newRouters.find(newRt => newRt.component === oldRt.component);
  //     if (!layoutRt) {
  //       layoutRt = {
  //         path: oldRt.path === "/base" ? "/base" : "/",
  //         redirect: oldRt.redirect,
  //         component: oldRt.component,
  //         children: []
  //       }
  //       newRouters.push(layoutRt);
  //     }
  //     layoutRt.children.push(oldRt)
  //   })
  //   return newRouters;
  // }
  render() {
    const { isMobile } = this.state;
    let menus = this.getLimitMenus();
    // 设置basic重定向地址
    let redirect = this.setRedirectLink(menus);

    const routerConfig = [...menus]; // [...menus, ...baseRouter]
    return (
      <wrapContext.Provider value={{
        device: isMobile ? "h5" : "web"
      }}>
        <BrowserRouter>
          <Switch>
            <Redirect exact key="/" from="/" to={redirect}></Redirect>
            {routerConfig.map(router => {
              // if (router.path === "/") {
              //   return <Redirect exact key={router.key} from={router.path} to={router.redirect}></Redirect>
              // } else {
              let Component = require(`../${
                router.children ? "layouts" : "pages"
                }${router.component}`).default;
              return (
                <Route
                  path={router.path}
                  key={router.component}
                  render={() => {
                    // // 拿到权限路由之后，渲染子路由
                    return React.createElement(Component, {
                      routes: router.children,
                      // redirectFrom: router.path,
                      // redirectTo: router.redirect,
                      // redirectKey: router.key
                    })
                  }}
                />
              );
              // }
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
    token: localStorage.getItem(`${productName}-token`)
  }
}

export default connect(mapStateToProps, {})(RouteConfig)