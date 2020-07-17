import Axios from "utils/request";

// 用户管理列表
export function requestUserList(payload = {}) {
    return Axios.post('userlist', payload)
}
// 邀请码管理列表
export function requestInvitecodeList(payload = {}) {
    return Axios.post('invitecodelist', payload)
}
// 新增/编辑邀请码
export function requestChangeInvitecode(payload = {}) {
    return Axios.post('changeinvitecode', payload)
}