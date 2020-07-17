import React from 'react';

import { Modal, Carousel, Button } from 'antd';

const ImageView = (props) => {
    const { visible, images, onCancel } = props;

    return (
        <Modal title="查看大图" visible={visible} onCancel={onCancel} destroyOnClose footer={
            [
                <Button onClick={onCancel} key="close">关 闭</Button>
            ]
        }>
            <Carousel>
                {images.map((image, index) => (
                    <img src={image} key={index} alt="" />
                ))}
            </Carousel>
        </Modal>
    )
}

export default ImageView;