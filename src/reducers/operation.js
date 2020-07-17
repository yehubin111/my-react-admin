import moment from 'moment';

import constants from "../constants";

const defaultBannerStatus = [
    { key: 1, name: "上架" },
    { key: 0, name: "下架" }
]
export const bannerStatus = (state = defaultBannerStatus, action = {}) => {
    return state;
}

const defaultBannerList = {
    list: [],
    total: 0
}
export const bannerList = (state = defaultBannerList, action = {}) => {
    const { type, response } = action;
    switch (type) {
        case constants.SAVEBANNERLIST:
            let list = response.list;
            list.forEach(banner => {
                banner.showTimeFormat = `${moment(banner.startTime).format('YYYY-MM-DD HH:mm:ss')} 至 ${moment(banner.endTime).format('YYYY-MM-DD HH:mm:ss')}`;
                banner.modifyTimeFormat = moment(banner.modifyTime).format('YYYY-MM-DD HH:mm:ss');
                banner.shelfStatusName = defaultBannerStatus.find(status => status.key === banner.shelfStatus).name;
            })
            return (
                state = {
                    list,
                    total: response.total
                }
            )
        default:
            return state;
    }
}