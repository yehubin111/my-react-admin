import Axios from "utils/request";

// 采购单管理列表
export function requestOrderList(payload = {}) {
    return Axios.post('orderList', payload);
}
// 收货人详情列表
export function requesetUpdateReceiver(payload = {}) {
    return Axios.post('orderAddressUpdate', payload)
}
// 确认付款
export function requestConfirmPay(payload = {}) {
    return Axios.post('orderSetPaid', payload)
}
// 订单取消
export function requestOrderCancel(payload = {}) {
    return Axios.post('orderCancel', payload)
}
// 订单物流
export function requestOrderLogistics(payload = {}) {
    return Axios.post('orderLogisticsList', payload)
}