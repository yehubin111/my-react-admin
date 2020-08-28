import React from "react";

import {
  LockOutlined,
  TeamOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  HomeOutlined
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
export const moduleRouter = [
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
  // {
  //   path: "/home",
  //   component: "/BasicLayout",
  //   redirect: "/home/index",
  //   noLimit: true,
  //   meta: {
  //     name: "首页",
  //     icon: <HomeOutlined />
  //   },
  //   key: "home",
  //   children: [
  //     {
  //       path: "/home/index",
  //       component: "/home/index",
  //       meta: {
  //         name: "首页",
  //         icon: "",
  //         introduce: ""
  //       },
  //       key: "homeIndex"
  //     }
  //   ]
  // },
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
          icon: "",
          introduce: ""
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
        path: "/product/audit",
        component: "/product/audit",
        meta: {
          name: "待审核商品",
          icon: ""
        },
        key: "productAudit"
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
      {
        path: "/product/brand",
        component: "/product/brand",
        meta: {
          name: "品牌管理",
          icon: ""
        },
        key: "productBrand"
      },
      {
        path: "/product/rule",
        component: "/product/rule",
        meta: {
          name: "采购规则配置",
          icon: ""
        },
        key: "productRule"
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
export const baseRouter = [
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