import moment from "moment";
import constants from "../constants";

const defaultProductData = {
    list: [],
    total: 0
}

export const productData = (state = defaultProductData, action = {}) => {
    const { type, response } = action;
    switch (type) {
        case constants.SAVEPRODUCT:
            let list = response.list;
            list.forEach(product => {
                product.mainPicAddressImage = product.mainPicAddress
                    ? product.mainPicAddress.split(',')[0] + '?imageView2/0/w/100'
                    : "";
                product.supplierSupplyPrice = `￥${product.supplierSupplyPrice}`;
                product.supplierMarketPrice = `￥${product.supplierMarketPrice}`;
                product.sellPrice = `￥${product.sellPrice}`;
                product.createTime = moment(product.createTime).format("YYYY-MM-DD HH:mm:ss");
                product.publishTime = moment(product.publishTime).format("YYYY-MM-DD HH:mm:ss");
            })
            return state = {
                list: list,
                total: response.total
            }
        default:
            return state;
    }
}