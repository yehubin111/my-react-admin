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
// 角色权限列表
export function requestMenuList(payload = {}) {
    return Axios.post('backMenuList', payload)
}
// 新增编辑角色
export function requestUpdateRole(payload = {}) {
    return Axios.post('backRoleAddOrUpdate', payload)
}