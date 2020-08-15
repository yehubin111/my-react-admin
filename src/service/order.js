import Axios from "utils/request";

// banner管理列表
export function requestOrderList(payload = {}) {
    return Axios.post('orderlist', payload);
}