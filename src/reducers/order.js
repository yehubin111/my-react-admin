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
        label: "待支付",
        ctrl: ["cancel", "pay"]
    }, {
        value: 100,
        label: "待确认",
        ctrl: ["refund"]
    },
    {
        value: 110,
        label: "待发货",
        ctrl: ["refund"]
    },
    {
        value: 200,
        label: "已发货",
        ctrl: ["refund", "logistics"]
    },
    {
        value: 400,
        label: "已完成",
        ctrl: ["refund", "logistics"]
    },
    {
        value: 500,
        label: "已退款",
        ctrl: []
    },
    {
        value: 600,
        label: "已取消",
        ctrl: []
    }
]
export const orderStatusList = (state = defaultOrderStatusList, action = {}) => {
    return state;
}