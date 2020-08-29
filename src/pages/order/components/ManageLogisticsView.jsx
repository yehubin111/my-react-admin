import React, { useEffect, useState } from "react";

import { requestOrderLogistics } from "service/order";

import { Modal, Timeline, Space, Button } from "antd";

const ManageLogisticsView = props => {
    const { visible, onCancel, orderId } = props;
    const [tyLogistics, setTyLogistics] = useState(null);
    const [logisticsCompany, setLogisticsCompany] = useState([]);
    const [logisticsList, setLogisticsList] = useState([]);

    useEffect(() => {
        if (orderId) {
            let payload = {
                isShowtLogisticsTrack: 1,
                orderId
            }
            requestOrderLogistics(payload)
                .then(response => {
                    let logistics = response;
                    // 通用仓
                    setTyLogistics(logistics.logisticsCompanyList.find(v => v.isTyLogistics === 1));
                    // 物流公司
                    setLogisticsCompany(logistics.logisticsCompanyList.filter(v => v.isTyLogistics !== 1));
                    // 物流轨迹
                    setLogisticsList(logistics.logisticsTraceList);
                })
        }
    }, [orderId])

    const handleCancel = () => {
        onCancel();
    }
    return <Modal title="物流信息" visible={visible} okText=""
        width={600}
        onCancel={handleCancel}
        footer={<Button onClick={() => {
            handleCancel();
        }}>关闭</Button>}
    >
        <Space direction="vertical" size={32}>
            {tyLogistics && <p>
                供应商-通用仓：{tyLogistics.logisticsCompanyName}--{tyLogistics.logisticsCode}
            </p>}
            <Space direction="vertical" size="small">
                {logisticsCompany.map((company, index) => (
                    <p key={index}>
                        物流段{index + 1}：{company.logisticsCompanyName}--{company.logisticsCode}
                    </p>
                ))}
            </Space>
            <Timeline mode="left">
                {
                    logisticsList.map((logistics, index) => (
                        <Timeline.Item key={index} color={index === 0 ? "green" : "blue"}>
                            <p>{logistics.optTime}</p>
                            <p>{logistics.content}</p>
                        </Timeline.Item>
                    ))
                }
            </Timeline>
        </Space>
    </Modal>
}

export default ManageLogisticsView;