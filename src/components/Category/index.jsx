import React, { useState, useEffect } from "react"

import { requestCategoryList } from "service/common";

import { Cascader } from "antd";

const Category = ({ value = [], onChange, data = [], changeOnSelect = false, level = 2 }) => {
    const [cateList, setCateList] = useState([]);
    const [cateValue, setCateValue] = useState([]);
    const [lock, changeLock] = useState(false);
    const getCategoryList = (payload) => {
        return requestCategoryList(payload);
    }
    const toLoadData = options => {
        let targetOption = options[options.length - 1];
        targetOption.loading = true;
        let payload = {
            categoryLevel: targetOption.categoryLevel + 1,
            parentId: targetOption.value
        }
        getCategoryList(payload)
            .then(response => {
                targetOption.loading = false;
                targetOption.children = response.list.map(cate => ({
                    value: cate.id,
                    label: cate.nameZh,
                    categoryLevel: payload.categoryLevel,
                    isLeaf: payload.categoryLevel === level
                }));
                setCateList([...cateList]);
            })
    }
    const handleChange = (e) => {
        onChange(e);
        setCateValue(e)
    }
    useEffect(() => {
        if (data.length > 0) {
            setCateList(data)
            if (value.length > 0 && !lock) {
                changeLock(true);

                let categoryList = data;
                value.forEach((cateId, index) => {
                    if (index < value.length - 1) {
                        let payload = {
                            categoryLevel: index + 2,
                            parentId: cateId
                        }
                        getCategoryList(payload)
                            .then(response => {
                                let category = categoryList.find(cate => cate.value === cateId);
                                categoryList = category.children = response.list.map(cate => ({ value: cate.id, label: cate.nameZh, isLeaf: index === value.length - 2 }));
                                // 最后一次获取数据之后，保存数据
                                if (index === value.length - 2) {
                                    setCateList(data);
                                    setCateValue(value)
                                }
                            })
                    }
                })
            }
        }
    }, [value, data])

    return <Cascader placeholder="类目" changeOnSelect={changeOnSelect} value={cateValue} options={cateList} onChange={(e) => {
        handleChange(e);
    }} loadData={toLoadData} />
}

export default Category;