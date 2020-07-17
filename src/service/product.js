import Axios from "utils/request";

// 商品管理列表
export function requestProductManage(payload = {}) {
    return Axios.post("spulist", payload)
}
// 商品管理批量导出
export function requestProductExport(payload = {}) {
    return Axios.export("batchexport", payload)
}