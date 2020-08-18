const defaultChildExceptionStatusList = [{
    value: 1,
    label: "已退款"
},
{
    value: 2,
    label: "退款失败"
},
{
    value: 3,
    label: "已退款"
},
{
    value: 0,
    label: "无退款"
}]

export const childExceptionStatusList = (state = defaultChildExceptionStatusList, action = {}) => {
    return state;
}

const defaultOrderStatusList = [
    {
        value: "",
        label: "全部",
        default: true
    },
    {
        value: 0,
        label: "待支付"
    }, {
        value: 100,
        label: "待确认"
    },
    {
        value: 110,
        label: "待发货"
    },
    {
        value: 200,
        label: "已发货"
    },
    {
        value: 400,
        label: "已完成"
    },
    {
        value: 500,
        label: "已退款"
    },
    {
        value: 600,
        label: "已取消"
    }
]
export const orderStatusList = (state = defaultOrderStatusList, action = {}) => {
    return state;
}