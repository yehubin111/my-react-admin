import React from "react"

import areaRegion from 'assets/js/regionV4';

import { Cascader } from "antd";

const Category = ({ value = [], onChange, changeOnSelect = false, level = 2 }) => {
    const handleChange = (e) => {
        onChange(e);
    }

    return <Cascader
        placeholder="请选择省市区"
        changeOnSelect={changeOnSelect}
        fieldNames={{value: "label"}}
        value={value}
        options={areaRegion}
        onChange={(e) => {
            handleChange(e);
        }} />
}

export default Category;