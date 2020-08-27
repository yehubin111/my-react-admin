import constants from "../constants";
import defaultConfig from "defaultConfig";
import history from "utils/history";

const defaultQiniuInfo = {
  token: "",
  qnUrl: "",
  deadline: 0
}
export const qiniuInfo = (state = defaultQiniuInfo, action = {}) => {
  let { type, response } = action;
  switch (type) {
    case constants.SAVEQINIUINFO:
      // 计算七牛token过期时间，并保存到本地缓存
      let info = atob(response.token.split(':')[2]);
      let deadline = JSON.parse(info).deadline;
      return state = {
        ...response,
        deadline: deadline * 1000
      }
    default:
      return state;
  }
}

const defaultInfo = {
  backMenuList: [],
  backRoleList: [],
  backUserName: 'Brain',
  token: ''
};
export const userInfo = (state = defaultInfo, action = {}) => {
  let { type, response } = action;
  switch (type) {
    case constants.SAVEINFO:
      // let home = {
      //   backMenuId: 100,
      //   backMenuList: [],
      //   backMenuName: "首页",
      //   createTime: 1574240489000,
      //   createUserId: 1,
      //   delStatus: 0,
      //   modifyTime: 1584326735000,
      //   modifyUserId: 1,
      //   parentBackMenuId: 0
      // }
      // response.backMenuList.unshift(home);
      return state = {
        backMenuList: response.backMenuList,
        backRoleList: response.backRoleList,
        backUserName: response.backUserName
          ? response.backUserName
          : response.backUserAccount,
        token: response.token
      };
    case constants.LOGINOUT:
      // 保存token
      localStorage.removeItem(`${defaultConfig.productName}-token`);

      let redirect = response;
      history.push("/base/login?redirect=" + encodeURIComponent(redirect));
      return state = defaultInfo;
    default:
      return state;
  }
};
