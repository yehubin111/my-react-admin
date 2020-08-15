import React from "react";

import { requestCategoryList } from "service/product";

import MainTable from "components/MainTable";
import CateTable from "./components/CateTable";

const ProductCategory = props => {
    const getListData = (payload) => {
        payload.parentId = 0;
        return requestCategoryList(payload);
    }
    return (
        <>
            <MainTable
                onRequest={payload => getListData(payload)}
                tableRender={CateTable}
            />
        </>
    )
}

export default ProductCategory;