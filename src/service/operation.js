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