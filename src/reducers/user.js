import moment from 'moment';

import constants from "../constants";

const defaultUserManageData = {
  list: [],
  total: 0
};

export const userManageData = (state = defaultUserManageData, action = {}) => {
  let { type, response } = action;
  switch (type) {
    case constants.SAVEUSERLIST:
      let list = response.list;
      list.forEach(user => {
        user.createTime = moment(user.createTime).format('YYYY-MM-DD HH:mm:ss')
      })
      return (state = {
        list,
        total: response.total
      });
    default:
      return state;
  }
};

const defaultInvitationList = {
  list: [],
  total: 0
}
const statusList = [
  { key: 1, name: '作废' },
  { key: 0, name: '正常' }
]
export const userInvitationData = (state = defaultInvitationList, action = {}) => {
  let { type, response } = action;
  switch (type) {
    case constants.SAVEINVITATIONLIST:
      let list = response.list;
      list.forEach(invite => {
        invite.statusName = statusList.find(status => status.key === invite.delStatus).name;
      })
      return (state = {
        list,
        total: response.total
      })
    default:
      return state;
  }
}