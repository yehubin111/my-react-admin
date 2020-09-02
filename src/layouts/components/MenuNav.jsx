import React, { Component } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

class MenuNav extends Component {
  state = {
    openKeys: [],
    selectedKeys: []
  };
  componentDidMount() {
    console.log("nav didMount")
    let { location: { pathname: path }, routes } = this.props;
    this.menuSelect(routes, path);
  }
  handleClick(e) {
    this.setState({
      selectedKeys: [e.key]
    });
  }
  handleOpenChange(e) {
    this.setState({
      openKeys: [e[e.length - 1]]
    });
  }
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
      if (!route) { }
      else if (route.children && route.children.length > 0) {
        routes = route.children;
        defaultOpenKeys.push(route.key);
      } else {
        defaultSelectedKeys.push(route.key);
      }
    });
    this.setState({
      openKeys: defaultOpenKeys,
      selectedKeys: defaultSelectedKeys
    })
    return { defaultOpenKeys, defaultSelectedKeys };
  }
  render() {
    let { routes, onRoute } = this.props;
    let { selectedKeys, openKeys } = this.state;
    
    return (
      <Menu
        theme="dark"
        mode="inline"
        onOpenChange={e => {
          this.handleOpenChange(e);
        }}
        // defaultOpenKeys={defaultOpenKeys}
        // defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onClick={(e) => {
          this.handleClick(e);
          onRoute && onRoute();
        }}
      >
        {this.menuCreate(routes)}
      </Menu>
    );
  }
}

export default withRouter(MenuNav);
