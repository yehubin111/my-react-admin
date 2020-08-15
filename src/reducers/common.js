import constants from "../constants";

// 专题列表
const defaultTopic = {
    list: []
}
export const topicData = (state = defaultTopic, action = {}) => {
    const { type, response } = action;
    switch (type) {
        case constants.SAVETOPIC:
            return (
                state = {
                    list: response.list
                }
            )
        default:
            return state;
    }
}

// 品牌下拉列表
const defaultBrand = {
    list: []
}
export const brandData = (state = defaultBrand, action = {}) => {
    const { type, response } = action;
    switch (type) {
        case constants.SAVEBRAND:
            return (
                state = {
                    list: response.list
                }
            )
        default:
            return state;
    }
}

// 发货仓库
const defaultStoreList = ['国内仓', '海外仓']
export const storeList = (state = defaultStoreList, action = {}) => {
    return state;
}
// 奢侈品属性
const defaultLuxuryList = ['轻奢', '非轻奢', '重奢']
export const luxuryList = (state = defaultLuxuryList, action = {}) => {
    return state;
}
// 销售属性
const defaultSaleList = ['预售', '非预售']
export const saleList = (state = defaultSaleList, action = {}) => {
    return state;
}
// 性别
const defaultSexList = [
    { key: 1, label: '男' },
    { key: 2, label: '女' },
    { key: 3, label: '中性' },
    { key: 4, label: '儿童' }
]
export const sexList = (state = defaultSexList, action = {}) => {
    return state;
}
// 商品状态
const defaultStatusList = [
    { key: 1, label: '上架' },
    { key: 0, label: '下架' }
]
export const statusList = (state = defaultStatusList, action = {}) => {
    return state;
}
// 尺码国别
const defaultCountryList = ['国际码', '意码', '法码', '英码', '美码', '日码', '数字标准码', '欧码', '中国码', '俄码', '德码', '澳码', '韩码'];
export const countryList = (state = defaultCountryList, action = {}) => {
    return state;
}
// 退货服务
const defaultRefundServiceList = [
    { key: 0, label: "不支持无理由退货" },
    { key: 1, label: "支持7天无理由退货" }
]
export const refundServiceList = (state = defaultRefundServiceList, action = {}) => {
    return state;
}
// 运费
const defaultDeliveryList = [
    { key: 0, label: "免运费" }
]
export const deliveryList = (state = defaultDeliveryList, action = {}) => {
    return state;
}