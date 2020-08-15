import Axios from "utils/request";
import { exportExcelFromData } from "utils/common";

import { message } from "antd";

// 商品管理列表
export function requestProductManage(payload = {}) {
    return Axios.post("spulist", payload)
}
// 商品管理批量导出
export function requestProductExport(payload = {}) {
    return Axios.export("batchexport", payload)
        .then(response => {
            message.success("导出成功");
            exportExcelFromData(response);
        })
}
// 商品下架
export function requestProductAudit(payload = {}) {
    return Axios.post("productaudit", payload)
}
// 商品上架
export function requestProductStand(payload = {}) {
    return Axios.post("productstand", payload)
}
// 编辑获取商品详情
export function requestGetSpuDetail(payload = {}) {
    return Axios.post("spuGetDetial", payload)
}
// 编辑商品
export function requestSpuEdit(payload = {}) {
    return Axios.post("spuUpdate", payload)
}
// 类目管理
export function requestCategoryList(payload = {}) {
    return Axios.post("catelist", payload)
}