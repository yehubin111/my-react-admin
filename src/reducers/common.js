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
    { key: 1, name: '男' },
    { key: 2, name: '女' },
    { key: 3, name: '中性' },
    { key: 4, name: '儿童' }
]
export const sexList = (state = defaultSexList, action = {}) => {
    return state;
}
// 商品状态
const defaultStatusList = [
    { key: 1, name: '上架' },
    { key: 0, name: '下架' }
]
export const statusList = (state = defaultStatusList, action = {}) => {
    return state;
}