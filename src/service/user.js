import Axios from "utils/request";

// 用户管理列表
export function requestUserList(payload = {}) {
    return Axios.post('userGetList', payload)
}
// 邀请码管理列表
export function requestInvitecodeList(payload = {}) {
    return Axios.post('inviteCodeGetList', payload)
}
// 新增/编辑邀请码
export function requestChangeInvitecode(payload = {}) {
    return Axios.post('inviteCodeUpdate', payload)
}
