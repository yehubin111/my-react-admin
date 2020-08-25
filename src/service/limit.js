import Axios from "utils/request";

// 人员管理列表
export function requestUserList(payload = {}) {
    return Axios.post('backUserList', payload);
}
// 新增/编辑用户
export function requestUpdateUser(payload = {}) {
    return Axios.post('backUserAddOrUpdate', payload);
}
// 角色列表
export function requestRoleList(payload = {}) {
    return Axios.post('backRoleList', payload)
}