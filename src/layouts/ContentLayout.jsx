import React from "react";
import { connect } from "react-redux";

import loading from "router/loading";
// import { wrapContext } from "utils/context";

import { Route, Redirect, Switch } from "react-router-dom";

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
        // let Component = require(`../pages${router.component}`).default;
        let component = () => import(`../pages${router.component}`);
        return (
          <Route
            path={router.path}
            key={router.key}
            render={() => {
              document.title = router.meta.name;
              // return <Component />
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
  return (
    // <wrapContext.Provider value={{
    //   device: "h8"
    // }}>
      <Switch>{routerCreate(routes, redirectFrom, redirectTo, redirectKey)}</Switch>
    // </wrapContext.Provider>
  )
};
export default connect(() => ({}), {})(ContentLayout);
