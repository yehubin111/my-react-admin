import Axios from "utils/request";

// 登录
export function requestToLogin(payload = {}) {
    return Axios.post("backUserLogin", payload)
}
// 获取七牛token和域名
export function requestQiniuToken(payload = {}) {
    return Axios.post("commonGetQiniuToken", payload)
}