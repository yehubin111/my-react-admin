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
    return Axios.post("brandIdNameList", payload)
}
// 产地列表
export function requestOriginList(payload = {}) {
    return Axios.post("originGetList", payload)
}
// 季节列表
export function requestSeasonList(payload = {}) {
    return Axios.post("seasonGetList", payload)
}
// 采购规则列表
export function requestRuleList(payload = {}) {
    return Axios.post("baserule", payload)
}
// 类目列表
export function requestCategoryList(payload = {}) {
    return Axios.post("categoryIdNameList", payload)
}
// 仓库下拉列表
export function requestStorageList(payload = {}) {
    return Axios.post("storageGetList", payload)
}
export function requestRulesList(payload = {}) {
    return Axios.post("rulesIdNameList", payload)
}
