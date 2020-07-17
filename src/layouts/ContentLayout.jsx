import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";

import loading from "router/loading";

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
        // let component = require(`../pages${router.component}`).default;
        let component = () => import(`../pages${router.component}`);
        return (
          <Route
            path={router.path}
            key={router.key}
            render={() => {
              document.title = router.meta.name;
              return React.createElement(loading(component), {});
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
  // return <>{routerCreate(routes, redirectFrom, redirectTo, redirectKey)}</>; <Suspense fallback={<PageLoading />}>
  return <Switch>{routerCreate(routes, redirectFrom, redirectTo, redirectKey)}</Switch>;
};
export default connect(() => ({}), {})(ContentLayout);
