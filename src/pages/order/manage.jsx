import React from 'react';
import { connect } from 'react-redux';

import { requestOrderList } from 'service/order';

import { Button } from "antd";
import MainTable from "components/MainTable";
import ManageTable  from "./components/ManageTable";

const OrderManage = (props) => {
    const { childExceptionStatusList, orderStatusList } = props;

    const getListData = payload => {
        payload.startTime = payload.time
            ? payload.time[0].format("YYYY-MM-DD") + " 00:00:00"
            : "";
        payload.endTime = payload.time
            ? payload.time[1].format("YYYY-MM-DD") + " 23:59:59"
            : "";
        delete payload.time;
        return requestOrderList(payload);
    }
    const filterConfig = [
        {
            label: "订单号",
            type: "input",
            name: "mainOrderCode"
        },
        {
            label: "退款状态",
            type: "select",
            name: "isRefund",
            data: childExceptionStatusList
        },
        {
            label: "收货人联系电话",
            type: "input",
            name: "receiverPhone"
        },
        {
            label: "收货人姓名",
            type: "input",
            name: "receiverName"
        },
        {
            label: "商品ID",
            type: "input",
            name: "skuId"
        },
        {
            label: "下单账号",
            type: "input",
            name: "phone"
        },
        {
            label: "商品名称",
            type: "input",
            name: "spuName"
        },
        {
            label: "订单日期",
            placeholder: ["订单开始日期", "订单结束日期"],
            type: "daterange",
            name: "time"
        },
    ]
    
    return (
        <>
            <MainTable
                title="全部采购单"
                filterConfig={filterConfig}
                onRequest={payload => getListData(payload)}
                headerTab={{
                    key: "orderStatus",
                    config: orderStatusList
                }}
                headerCtrl={
                    <Button type="primary" onClick={() => {
                        // changeAddStatus(true)
                    }}>
                        导出Excel
                    </Button>
                }
                tableRender={ManageTable}
                // tableConfig={{
                //     bordered: true,
                //     columns,
                //     scroll: {
                //         x: 1550
                //     },
                //     rowKey: "orderDetailId"
                // }}
            />
            
        </>
    )
}

const mapStateToProps = state => {
    return {
        childExceptionStatusList: state.childExceptionStatusList,
        orderStatusList: state.orderStatusList
    }
}

export default connect(mapStateToProps, {})(OrderManage);