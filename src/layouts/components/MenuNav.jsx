// import React, { Component } from "react";
// import { Menu } from "antd";
// import { Link, withRouter } from "react-router-dom";

// class MenuNav extends Component {
//   state = {
//     openKeys: [],
//     selectedKeys: []
//   };
//   componentDidMount() {
//     let { location: { pathname: path }, routes } = this.props;
//     this.menuSelect(routes, path);
//   }
//   handleClick(e) {
//     this.setState({
//       selectedKeys: [e.key]
//     });
//   }
//   handleOpenChange(e) {
//     this.setState({
//       openKeys: [e[e.length - 1]]
//     });
//   }
//   menuCreate(routes) {
//     return routes.map(router => {
//       // 隐藏菜单
//       if (router.hidden) return null;
//       if (router.children && router.children.length > 0) {
//         return (
//           <Menu.SubMenu key={router.key} icon={router.meta.icon} title={router.meta.name}>
//             {this.menuCreate(router.children)}
//           </Menu.SubMenu>
//         );
//       } else {
//         return (
//           <Menu.Item key={router.key} icon={router.meta.icon}>
//             <Link to={router.path}>{router.meta.name}</Link>
//           </Menu.Item>
//         );
//       }
//     });
//   }
//   menuSelect(routes, path) {
//     let defaultOpenKeys = [],
//       defaultSelectedKeys = [];
//     let patharr = path.split("/").filter(v => v);
//     // 深度遍历
//     patharr.forEach((_, index) => {
//       let route = routes.find(
//         rt => rt.path === `/${patharr.slice(0, index + 1).join("/")}`
//       );
//       if (!route) { }
//       else if (route.children && route.children.length > 0) {
//         routes = route.children;
//         defaultOpenKeys.push(route.key);
//       } else {
//         defaultSelectedKeys.push(route.key);
//       }
//     });
//     this.setState({
//       openKeys: defaultOpenKeys,
//       selectedKeys: defaultSelectedKeys
//     })
//     return { defaultOpenKeys, defaultSelectedKeys };
//   }
//   render() {
//     let { routes, onRoute } = this.props;
//     let { selectedKeys, openKeys } = this.state;
    
//     return (
//       <Menu
//         theme="dark"
//         mode="inline"
//         onOpenChange={e => {
//           this.handleOpenChange(e);
//         }}
//         // defaultOpenKeys={defaultOpenKeys}
//         // defaultSelectedKeys={defaultSelectedKeys}
//         selectedKeys={selectedKeys}
//         openKeys={openKeys}
//         onClick={(e) => {
//           this.handleClick(e);
//           onRoute && onRoute();
//         }}
//       >
//         {this.menuCreate(routes)}
//       </Menu>
//     );
//   }
// }

// export default withRouter(MenuNav);


import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";

const MenuNav = props => {
  const { location: { pathname: path }, routes, onRoute } = props;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    toSelectMenu(routes, path);
  }, [path])

  const toSelectMenu = (routes, path) => {
    let defaultOpenKeys = [],
      defaultSelectedKeys = [];
    let patharr = path.split("/").filter(v => v);
    // 深度遍历
    patharr.forEach((_, index) => {
      /**
       * 20201006优化当路由包含参数的情况下，无法匹配到左侧菜单
       */
      let route = routes.find(
        rt => {
          let path = "^" + rt.path.replace(/(\/:[^\/]*)/g, "[^/]*") + "$";
          let reg = new RegExp(path);
          return reg.test(`/${patharr.slice(0, index + 1).join("/")}`);
          // rt.path === `/${patharr.slice(0, index + 1).join("/")}`
        }
      );
      if (!route) { }
      else if (route.children && route.children.length > 0) {
        routes = route.children;
        defaultOpenKeys.push(route.key);
      } else {
        defaultSelectedKeys.push(route.key);
      }
    });
    setSelectedKeys(defaultSelectedKeys);
    setOpenKeys(defaultOpenKeys);

    return { defaultOpenKeys, defaultSelectedKeys };
  }
  const toCreateMenu = (routes) => {
    return routes.map(router => {
      // 隐藏菜单
      if (router.hidden) return null;
      if (router.children && router.children.length > 0) {
        return (
          <Menu.SubMenu key={router.key} icon={router.meta.icon} title={router.meta.name}>
            {toCreateMenu(router.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={router.key} icon={router.meta.icon}>
            <Link to={router.path.split(":")[0]}>{router.meta.name}</Link>
          </Menu.Item>
        );
      }
    });
  }
  const handleClick = (e) => {
    setSelectedKeys([e.key]);
  }
  const handleOpenChange = (e) => {
    setOpenKeys([e[e.length - 1]])
  }
  return <Menu
    theme="dark"
    mode="inline"
    onOpenChange={e => {
      handleOpenChange(e);
    }}
    // defaultOpenKeys={defaultOpenKeys}
    // defaultSelectedKeys={defaultSelectedKeys}
    selectedKeys={selectedKeys}
    openKeys={openKeys}
    onClick={(e) => {
      handleClick(e);
      onRoute && onRoute();
    }}
  >
    {toCreateMenu(routes)}
  </Menu>
}

export default withRouter(MenuNav);





