import React from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";

import styles from "./layout.module.scss";
import defaultConfig from "defaultConfig";

import ContentLayout from "./ContentLayout";

const { Content, Footer } = Layout;
const { copyright } = defaultConfig;

const BlankLayout = props => {
  const { routes, redirectFrom, redirectTo, redirectKey } = props;

  return (
    <Layout className={styles.layout}>
      <Content>
        <ContentLayout
          routes={routes}
          redirectFrom={redirectFrom}
          redirectTo={redirectTo}
          redirectKey={redirectKey}
        />
      </Content>
      <Footer className={styles.footer}>{copyright}</Footer>
    </Layout>
  );
};

export default withRouter(BlankLayout);
