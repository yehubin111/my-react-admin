import React, { Component } from "react";
import { connect } from "react-redux";
import md5 from 'js-md5';
import { withRouter } from "react-router-dom";

import styles from "./page.module.scss";
import defaultConfig from "defaultConfig";
import { saveUserInfo, saveQiniuInfo } from 'actions';
import { requestToLogin, requestQiniuToken } from 'service/base';

import { Button, Input, Form, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const FormItem = Form.Item;
const { Password } = Input;
const { logo, introduce } = defaultConfig;

class Login extends Component {
  state = {
    loading: false
  }
  changeLoading(status) {
    this.setState({
      "loading": status
    })
  }
  render() {
    const { loading } = this.state;
    const { saveUserInfo, saveQiniuInfo, location, history } = this.props;

    return (
      <div className={`cf ac jc ${styles.login}`}>
        <div className={styles.info}>
          <p className={`cf ac ${styles.logo}`}>
            <img alt="logo" src={logo} />
          </p>
          {/* <p className={styles.title}>{title}</p> */}
          <p className={styles.introduce}>{introduce}</p>
        </div>
        <Form
          className={styles.content}
          onFinish={async values => {
            // loading
            this.changeLoading(true);
            values.backUserPassword = md5(values.backUserPassword);
            try {
              const response = await requestToLogin(values);
              // 登录成功之后获取七牛token和域名
              const qiniu = await requestQiniuToken();
              if (response) {
                /**
                 * 保存token
                 * 暂未找到组件外js文件内使用redux状态方法，token单独保存
                 */
                localStorage.setItem(`${defaultConfig.productName}-token`, response.token);
                // 保存信息
                saveUserInfo(response);
                saveQiniuInfo(qiniu);
                // 根据路由和来源页面跳转
                if (response.backMenuList && response.backMenuList.length > 0) {
                  message.success("登录成功");

                  let redirect = location.search.match(/(?<=\?redirect=).*/);
                  setTimeout(() => {
                    history.push(redirect ? decodeURIComponent(redirect[0]) : "/");
                  //   console.log('redirect')
                  //   history.push("/");
                    // window.location.href = redirect ? decodeURIComponent(redirect[0]) : "/";
                  }, 0)
                } else message.error("请给该角色配置权限");
              }
            } catch (err) {
              // loading over
              this.changeLoading(false);
            }
          }}
        >
          <FormItem
            name="backUserAccount"
            rules={[{ required: true, message: "请输入您的用户名" }]}
          >
            <Input
              size="large"
              className={styles.input}
              placeholder="请输入您的用户名"
              prefix={<UserOutlined />}
            />
          </FormItem>
          <FormItem
            name="backUserPassword"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Password
              size="large"
              className={styles.input}
              placeholder="请输入密码"
              prefix={<LockOutlined />}
            />
          </FormItem>
          <Button
            size="large"
            className={styles.button}
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            登 录
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}

export default connect(mapStateToProps, { saveUserInfo, saveQiniuInfo })(withRouter(Login));
