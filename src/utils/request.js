// import {  } from "redux";
import axios from "axios";
import Api from "./api";
import defaultConfig from "defaultConfig";
import { message } from "antd";
import { exportExcelFromData } from "utils/common";

class Axios {
  axios = axios.create({
    baseURL: defaultConfig.api.path,
    timeout: 60000,
    headers: {
      Authorization: ""
    }
  });
  constructor() {
    // 初始化axios拦截器
    this.init();
  }
  init() {
    // request拦截器
    this.axios.interceptors.request.use(
      config => {
        /**
         * 参数非空排除
         * 排除空字符串以及null
         */
        let data = config.data;
        let rdata = {};
        let token = localStorage.getItem(`${defaultConfig.productName}-token`);

        Object.keys(data).forEach(v => {
          if (data[v] !== "" && data[v] !== null) rdata[v] = data[v];
        });
        config.data = Object.assign({}, rdata);
        config.headers.Authorization = token;
        return config;
      },
      err => {
        console.log(err);
        return Promise.reject(err);
      }
    );

    // response拦截器
    this.axios.interceptors.response.use(
      response => {
        const r = response.data;
        // 暂时只是导出接口特殊情况
        if (r.code === undefined) {
          let exportname = response.headers["content-disposition"]
            ? response.headers["content-disposition"].match(/(?<==).*/g)[0]
            : "无名";
          return { data: r, filename: decodeURIComponent(exportname) };
        } else if (r.code === "0") {
          return r.data;
        } else {
          const msg = r.msg;
          // 1003 token失效情况，跳转登录
          if (r.code === "1003") {
            localStorage.removeItem(`${defaultConfig.productName}-token`);
          }
          message.error(msg);
          return Promise.reject(msg);
        }
      },
      err => {
        console.log(err);
        return Promise.reject(err);
      }
    );
  }
  post(apiname, params) {
    const url = apiname.indexOf("http") === -1 ? Api[apiname] : apiname;
    let requestBody = {
      url,
      data: params,
      method: "post"
    };
    return new Promise((resolve, reject) => {
      this.axios(requestBody).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error)
      });
    });
  }
  get(apiname, params) {
    let url = apiname.indexOf("http") === -1 ? Api[apiname] : apiname;
    let str = "";
    Object.keys(params).forEach(v => {
      str += `&${v}=${params[v]}`;
    });
    url = `${url}${str ? `?${str.substr(1)}` : ""}`;
    let requestBody = {
      url,
      data: {},
      method: "get"
    };

    return new Promise((resolve, reject) => {
      this.axios(requestBody).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error)
      });
    });
  }
  export(apiname, params) {
    let url = apiname.indexOf("http") === -1 ? Api[apiname] : apiname;
    let requestBody = {
      url,
      data: params,
      method: "post",
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      responseType: "blob"
    };
    return new Promise((resolve, reject) => {
      this.axios(requestBody).then(response => {
        message.success("导出成功");
        exportExcelFromData(response);
        resolve(response);
      });
    });
  }
}

export default new Axios();
