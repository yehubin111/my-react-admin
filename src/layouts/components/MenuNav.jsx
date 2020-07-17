import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

class MenuNav extends Component {
  // state = {
  //   openKeys: []
  // };
  componentDidMount() {
  }
  // handleClick(e) {
  //   this.setState({
  //     selectedKeys: [e.key]
  //   });
  // }
  // handleOpenChange(e) {
  //   this.setState({
  //     openKeys: e
  //   });
  // }
  menuCreate(routes) {
    return routes.map(router => {
      // 隐藏菜单
      if (router.hidden) return null;
      if (router.children && router.children.length > 0) {
        return (
          <Menu.SubMenu key={router.key} icon={router.meta.icon} title={router.meta.name}>
            {this.menuCreate(router.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={router.key} icon={router.icon}>
            <Link to={router.path}>{router.meta.name}</Link>
          </Menu.Item>
        );
      }
    });
  }
  menuSelect(routes, path) {
    let defaultOpenKeys = [],
      defaultSelectedKeys = [];
    let patharr = path.split("/").filter(v => v);
    // 深度遍历
    patharr.forEach((_, index) => {
      let route = routes.find(
        rt => rt.path === `/${patharr.slice(0, index + 1).join("/")}`
      );
      if (!route) {}
      else if (route.children && route.children.length > 0) {
        routes = route.children;
        defaultOpenKeys.push(route.key);
      } else {
        defaultSelectedKeys.push(route.key);
      }
    });
    return { defaultOpenKeys, defaultSelectedKeys };
  }
  render() {
    let { location: { pathname: path }, routes } = this.props;
    let { defaultOpenKeys, defaultSelectedKeys } = this.menuSelect(routes, path);
    // console.log(defaultOpenKeys, selectedKeys);
    // let { openKeys } = this.state;
    return (
      <Menu
        theme="dark"
        mode="inline"
        // onOpenChange={e => {
        //   this.handleOpenChange(e);
        // }}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        // openKeys={openKeys}
        // selectedKeys={selectedKeys}
      >
        {this.menuCreate(routes)}
      </Menu>
    );
  }
}

export default withRouter(MenuNav);
