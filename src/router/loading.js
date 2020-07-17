import Loadable from 'react-loadable';

import PageLoading from "components/PageLoading";

const loadableComponent = (component, render) => {
    const config = {
        loader: component,
        loading: PageLoading,
        delay: 200 // 加载时间超过这个时间的会先loading
    }
    if (render) {
        config.render = render;
    }
    return Loadable(config);
}

export default loadableComponent;

