import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Url from "utils/api";
import { requestQiniuToken } from "service/base";
import { saveQiniuInfo } from "actions";

import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ImageUpload = props => {
    const { value, qiniuInfo: { token, deadline, qnUrl }, saveQiniuInfo, multiple, limit = 1, onChange } = props;
    const [fileList, changeFileList] = useState([]);
    const [preview, setPreview] = useState({
        image: "",
        title: ""
    })
    const [previewStatus, changePreview] = useState(false);
    const [uploadStatus, changeUploadStatus] = useState(true);
    const [uploadLock, changeUploadLock] = useState(false);
    const data = {
        token
    }
    // 如果token过期，则重新获取token和计算到期时间
    if (Date.now() > deadline) {
        requestQiniuToken()
            .then(responese => {
                saveQiniuInfo(responese);
            });
    }

    const handlePreview = (file) => {
        if (!file.url) file.url = file.thumbUrl;
        setPreview({
            image: file.url,
            title: file.name
        })
        changePreview(true);
    }
    const handleChange = (files) => {
        // 防止value的改变引起编辑逻辑
        changeUploadLock(true);
        setTimeout(() => {
            changeUploadLock(false);
        }, 300)

        changeFileList(files.fileList);
        // 格式化返回数据
        let data = files.fileList.map(file => {
            if (file.response && file.response.key) return `${qnUrl}${file.response.key}`
            else if (file.url) return file.url
        })
        onChange(data.join(','));
    }
    const handlePreviewCancel = () => {
        changePreview(false);
    }
    const handleCheck = (file, checkFileList) => {
        if (!limit) return Promise.resolve();
        else if (checkFileList.length > limit - fileList.length) {
            message.warning("超过图片上传最大数量");
            return Promise.reject("");
        } else if (checkFileList.length === limit - fileList.length) {
            setTimeout(() => {
                changeUploadStatus(false)
            }, 400)
        }
    }
    // 已上传数量大于或者等于限制数量，隐藏上传按钮
    useEffect(() => {
        if (limit && fileList.length < limit)
            changeUploadStatus(true)
    }, [fileList])
    // 编辑的时候数据初始化
    useEffect(() => {
        if (value && !uploadLock) {
            let files = value.split(",").map((image, index) => (
                {
                    url: image,
                    uid: index,
                    status: 'done',
                    name: "图片"
                }
            ))
            changeFileList(files);
            if (limit && files.length >= limit)
                changeUploadStatus(false);
        }
    }, [value])

    return (
        <>
            <Upload
                action={Url.upload}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={handleCheck}
                data={data}
                multiple={multiple}
            >
                {
                    uploadStatus && (
                        <>
                            <PlusOutlined />
                            <div className="ant-upload-text">Upload</div>
                        </>
                    )
                }
            </Upload>
            <Modal
                visible={previewStatus}
                title={preview.title}
                footer={null}
                onCancel={handlePreviewCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={preview.image} />
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        qiniuInfo: state.qiniuInfo
    }
}

export default connect(mapStateToProps, { saveQiniuInfo })(ImageUpload);