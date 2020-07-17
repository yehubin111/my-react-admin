import Axios from "utils/request";

/**
 * 基础数据
 */
// 专题列表
export function requestTopicList(payload = {}) {
    return Axios.post("basetopic", payload)
}
// 品牌列表
export function requestBrandList(payload = {}) {
    return Axios.post("basebrand", payload)
}
// 季节列表
export function requestSeasonList(payload = {}) {
    return Axios.post("baseseason", payload)
}
// 采购规则列表
export function requestRuleList(payload = {}) {
    return Axios.post("baserule", payload)
}
