import React, { useEffect, useState } from 'react';

import TableFilter from "../TableFilter";
import TableHeader from "../TableHeader";
import EditTable from "../EditTable";

const MainTable = props => {
    const { filterRender, headerRender, tableRender } = props;
    // const [tableRenderConfig, changeTableRender] = useState(tableRender);

    // useEffect(() => {
    //     if (tableRenderConfig) {
    //         tableRenderConfig.pagination.showTotal = total => `共 ${total} 条`;
    //         changeTableRender(tableRenderConfig);
    //     }
    // }, [])

    // console.log(tableRender, tableRenderConfig);
    return (
        <>
            {filterRender && <TableFilter {...filterRender} />}
            {headerRender && <TableHeader {...headerRender} />}
            {tableRender && <EditTable
                {...tableRender}
            />}
        </>
    )
}

export default MainTable;