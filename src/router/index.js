import React, { Component } from "react";
import history from "utils/history";
import { Switch, Route, Router, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import defaultConfig from "defaultConfig";
import { toLoginOut } from 'actions';

import {
  LockOutlined,
  TeamOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from "@ant-design/icons";

/**
 * key: String 页面组件标识，唯一
 * meta: Object 额外信息，必填 
 *    { name: String, icon: String }
 * hidden: Boolean 是否显示在左侧菜单栏
 * noLimit: Boolean 是否受权限管理约束 包括
 * redirect: String 会生成一个Redirect路由组件
 * children: Array 子组件
 */
const moduleRouter = [
  {
    path: "/base",
    component: "/BlankLayout",
    redirect: "/base/login",
    key: "base",
    noLimit: true,
    hidden: true,
    meta: {
      name: "基础",
      icon: ""
    },
    children: [
      {
        path: "/base/login",
        component: "/base/login",
        hidden: true,
        meta: {
          name: "登录",
          icon: ""
        },
        key: "login"
      }
    ]
  },
  {
    path: "/product",
    component: "/BasicLayout",
    redirect: "/product/manage",
    meta: {
      name: "商品中心",
      icon: <AppstoreOutlined />
    },
    key: "product",
    children: [
      {
        path: "/product/manage",
        component: "/product/manage",
        meta: {
          name: "商品管理",
          icon: ""
        },
        key: "productManage"
      },
      {
        path: "/product/public/:productId",
        component: "/product/public",
        hidden: true,
        noLimit: true,
        meta: {
          name: "编辑商品",
          icon: ""
        },
        key: "productEdit"
      },
      {
        path: "/product/category",
        component: "/product/category",
        meta: {
          name: "类目管理",
          icon: ""
        },
        key: "productCategory"
      },
    ]
  },
  {
    path: "/operation",
    component: "/BasicLayout",
    redirect: "/operation/banner",
    meta: {
      name: "运营管理",
      icon: <LineChartOutlined />
    },
    key: "operation",
    children: [
      {
        path: "/operation/banner",
        component: "/operation/banner",
        meta: {
          name: "banner管理",
          icon: ""
        },
        key: "operationBanner"
      },
      {
        path: "/operation/programa",
        component: "/operation/programa",
        meta: {
          name: "专栏管理",
          icon: ""
        },
        key: "operationPrograma"
      },
      {
        path: "/operation/topic",
        component: "/operation/topic",
        meta: {
          name: "专题库管理",
          icon: ""
        },
        key: "operationTopic"
      },
      {
        path: "/operation/system",
        component: "/operation/system",
        meta: {
          name: "运营配置",
          icon: ""
        },
        key: "operationSystem"
      }
    ]
  },
  {
    path: "/order",
    component: "/BasicLayout",
    redirect: "/order/manage",
    meta: {
      name: "采购单管理",
      icon: <UnorderedListOutlined />
    },
    key: "order",
    children: [
      {
        path: "/order/manage",
        component: "/order/manage",
        meta: {
          name: "全部采购单",
          icon: ""
        },
        key: "orderManage"
      }
    ]
  },
  {
    path: "/user",
    component: "/BasicLayout",
    redirect: "/user/manage",
    meta: {
      name: "用户管理",
      icon: <TeamOutlined />
    },
    key: "user",
    children: [
      {
        path: "/user/other",
        component: "/BlankLayout",
        redirect: "/user/other/main",
        meta: {
          name: "其他管理",
          icon: ""
        },
        key: "userOther",
        children: [
          {
            path: "/user/other/main",
            component: "/user/other/main",
            meta: {
              name: "重要信息",
              icon: ""
            },
            key: "userOtherMain"
          }
        ]
      },
      {
        path: "/user/manage",
        component: "/user/manage",
        meta: {
          name: "用户管理",
          icon: "",
          introduce: ""
        },
        key: "userManage"
      },
      {
        path: "/user/invitation",
        component: "/user/invitation",
        meta: {
          name: "邀请码管理",
          icon: ""
        },
        key: "userInvitation"
      }
    ]
  },
  {
    path: "/limit",
    component: "/BasicLayout",
    redirect: "/limit/users",
    meta: {
      name: "权限管理",
      icon: <LockOutlined />
    },
    key: "limit",
    children: [
      {
        path: "/limit/users",
        component: "/limit/users",
        meta: {
          name: "人员管理",
          icon: ""
        },
        key: "limitUsers"
      },
      {
        path: "/limit/roles",
        component: "/limit/roles",
        meta: {
          name: "角色管理",
          icon: ""
        },
        key: "limitRoles"
      }
    ]
  }
];
const baseRouter = [
  // 重定向
  {
    path: "/",
    component: "/BasicLayout",
    redirect: "/user/manage",
    noLimit: true,
    key: "basic"
  },
  {
    path: "*",
    component: "/base/404",
    noLimit: true,
    hidden: true,
    meta: {
      name: "404",
      icon: ""
    },
    key: "404"
  }
];

export const routerConfig = [...moduleRouter, ...baseRouter];

class RouteConfig extends Component {
  // 路由权限判断
  getLimitMenus() {
    let menus = [];
    let { userInfo: baseStorage, token } = this.props;
    let limits = token && baseStorage.backMenuList ? baseStorage.backMenuList : [];

    // 尝试过循环，不太好实现子路由为空不添加父路由的逻辑，所以选择递归
    function toCycleLimit(lms, rts, ms) {
      rts.forEach(rt => {
        // noLimit为true的直接添加，否则按照name匹配权限路由
        if (rt.noLimit) {
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
     * 如果获取到权限路由，并且可以拿到受权限约束的路由，则basic重定向路径未该页面
     * 否则重定向路径为登录页
     */
    let mode = menus.find(router => !router.noLimit);
    let base = moduleRouter.find(router => router.key === 'base');
    let basic = baseRouter.find(router => router.key === 'basic');
    let redirect = !mode ? base.redirect : mode.redirect;

    basic.redirect = redirect;
    return redirect;
  }
  render() {
    const { toLoginOut, token } = this.props;
    let menus = this.getLimitMenus();
    // 设置basic重定向地址
    this.setRedirectLink(menus);

    return (
      <Router history={history}>
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
                    // 路由加载的时候，判断token是否存在
                    if (!token && !router.noLimit) {
                      toLoginOut(router.path);
                      return;
                    };
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
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    token: localStorage.getItem(`${defaultConfig.productName}-token`)
  }
}

export default connect(mapStateToProps, { toLoginOut })(RouteConfig)