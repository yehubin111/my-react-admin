import Axios from "utils/request";

// banner管理列表
export function requestBannerList(payload = {}) {
    return Axios.post('bannerlist', payload);
}
// banner管理排序
export function requestBannerSort(payload = {}) {
    return Axios.post('bannersort', payload);
}
// banner列表状态更改
export function requestChangeBannerStatus(payload = {}) {
    return Axios.post('bannerstatus', payload);
}
// 运营管理列表
export function requestSystemList(payload = {}) {
    return Axios.post('systemlist', payload);
}
// 专题库管理列表
export function requestTopicList(payload = {}) {
    return Axios.post('topiclist', payload);
}
// 专题库商品列表
export function requestTopicSpuList(payload = {}) {
    return Axios.post('topicspulist', payload);
}
// 专题库商品保存排序
export function requestSaveTopicSpuSort(payload = {}) {
    return Axios.post('topicsort', payload);
}
// 专题库商品保存删除
export function requestSaveTopicSpuDel(payload = {}) {
    return Axios.post('topicdel', payload);
}