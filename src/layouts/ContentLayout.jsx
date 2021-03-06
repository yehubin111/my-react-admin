import React, { Suspense } from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";

import defaultConfig from "defaultConfig";

import { message } from "antd";
import PageLoading from "components/PageLoading";

const { productName } = defaultConfig;

const ContentLayout = props => {
  const { routes, redirectFrom, redirectTo, redirectKey } = props;

  const routerCreate = (routes, redirectFrom, redirectTo, redirectKey) => {
    let routers = routes.map(router => {
      if (router.children && router.children.length > 0) {
        return routerCreate(
          router.children,
          router.path,
          router.redirect,
          router.key
        );
      } else {
        // 组件懒加载
        let Component = React.lazy(() => import(`../pages${router.component}`));
        return (
          <Route
            path={router.path}
            key={router.key}
            render={() => {
              document.title = router.meta.name;
              let token = localStorage.getItem(`${productName}-token`);
              // 页面加载的时候，判断token是否存在
              if (!token && !router.noLimit) {
                setTimeout(() => {
                  message.destroy("tokenFailure");
                  message.warning({ content: "token失效，请重新登录", key: "tokenFailure" });
                }, 0)
                let redirect = router.path;
                return <Redirect to={`/base/login?redirect=${encodeURIComponent(redirect)}`}></Redirect>
              };
              return <Suspense fallback={<PageLoading />}>
                <Component />
              </Suspense>
            }}
          />
        );
      }
    });

    if (redirectTo)
      routers.push(
        <Redirect
          exact
          from={redirectFrom}
          to={redirectTo}
          key={redirectKey}
        ></Redirect>
      );
    return routers;
  };
  // return <>{routerCreate(routes, redirectFrom, redirectTo, redirectKey)}</>;  // <Suspense fallback={<PageLoading />}>
  return (
    <Switch>
      {routerCreate(routes, redirectFrom, redirectTo, redirectKey)}
      <Redirect
        exact
        from="*"
        to="/base/404"
        key="404"
      ></Redirect>
    </Switch>
  )
};

// const mapStateToProps = (state) => {
//   return {

//   }
// }
export default connect(() => ({}), {})(ContentLayout);
