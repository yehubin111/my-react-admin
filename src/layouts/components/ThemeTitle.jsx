import React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import { typeOf } from "utils/common";

import styles from "./comp.module.scss";
import { Breadcrumb } from "antd";

const ThemeTitle = props => {
  let { routes } = props;
  let { pathname: path } = useLocation();
  let patharr = path.split("/").filter(v => v);
  // 匹配
  let reg = /\/\:.+\??/;
  return (
    <div className={styles.themetitle}>
      <Breadcrumb>
        {patharr.map((_, index) => {
          if (typeOf(routes) != "Array") return;
          let route = routes.find(
            rt => rt.path.replace(reg, "") === `/${patharr.slice(0, index + 1).join("/")}`
          );
          if (!route) return null;
          else if (route.children && route.children.length > 0) {
            routes = route.children;
            return (
              <Breadcrumb.Item key={route.key}>{route.meta.name}</Breadcrumb.Item>
            );
          } else {
            routes = route;
            return (
              <Breadcrumb.Item key={route.key}>
                <Link to={route.path}>{route.meta.name}</Link>
              </Breadcrumb.Item>
            );
          }
        })}
      </Breadcrumb>
      <h1 className={styles.title}>{routes.meta ? routes.meta.name : ""}</h1>
      {routes.meta && routes.meta.introduce && (
        <p className={styles.introduce}>{routes.meta.introduce}</p>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, {})(ThemeTitle);
