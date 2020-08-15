const defaultChildExceptionStatusList = [{
    key: 1,
    label: "已退款"
},
{
    key: 2,
    label: "退款失败"
},
{
    key: 3,
    label: "已退款"
},
{
    key: 0,
    label: "无退款"
}]

export const childExceptionStatusList = (state = defaultChildExceptionStatusList, action = {}) => {
    return state;
}

const defaultOrderStatusList = [
    {
        key: "",
        label: "全部",
        default: true
    },
    {
        key: 0,
        label: "待支付"
    }, {
        key: 100,
        label: "待确认"
    },
    {
        key: 110,
        label: "待发货"
    },
    {
        key: 200,
        label: "已发货"
    },
    {
        key: 400,
        label: "已完成"
    },
    {
        key: 500,
        label: "已退款"
    },
    {
        key: 600,
        label: "已取消"
    }
]
export const orderStatusList = (state = defaultOrderStatusList, action = {}) => {
    return state;
}