import Axios from "utils/request";

// 商品管理列表
export function requestProductManage(payload = {}) {
    return Axios.post("spuGetList", payload)
}
// 编辑获取商品详情
export function requestGetSpuDetail(payload = {}) {
    return Axios.post("spuGetDetial", payload)
}
// 编辑商品
export function requestSpuEdit(payload = {}) {
    return Axios.post("spuUpdate", payload)
}
// 商品中心批量导出
export function requestSpuExport(payload = {}) {
    return Axios.export("spuExport", payload)
}
// 商品中心批量审核上架
export function requestSpuAuditStand(payload = {}) {
    return Axios.post("spuGoodsAudit", payload);
}
// 商品中心批量下架
export function requestSpuDown(payload = {}) {
    return Axios.post("spuGoodsStandOrDown", payload);
}
// 商品中心批量加入专题
export function requestSpuAddTopic(payload = {}) {
    return Axios.post("spuAddToTopic", payload);
}
// 商品中心批量设置采购规则
export function requestSpuSetRules(payload = {}) {
    return Axios.post("spuSetRules", payload);
}
// 类目管理
export function requestCategoryList(payload = {}) {
    return Axios.post("categoryGetList", payload)
}
// 新增/编辑类目
export function requestUpdateCate(payload = {}) {
    return Axios.post("categoryUpdate", payload)
}
// 采购规则配置列表
export function requestRulesList(payload = {}) {
    return Axios.post("rulesGetList", payload)
}
// 新增/编辑/删除采购规则
export function requestUpdateRule(payload = {}) {
    return Axios.post("rulesUpdate", payload)
}
// 品牌管理列表
export function requestBrandList(payload = {}) {
    return Axios.post("brandGetList", payload)
}
// 新增/编辑品牌
export function requestUpdateBrand(payload = {}) {
    return Axios.post("brandUpdate", payload)
}