import Axios from "utils/request";

// 人员管理列表
export function requestUserList(payload = {}) {
    return Axios.post('backUserList', payload);
}