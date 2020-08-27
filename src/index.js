import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import Route from './router/';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer, { persistReducers } from './reducers';
import defaultConfig from './defaultConfig';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// import moment from "moment";
// import 'moment/locale/zh-cn';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

const persistConfig = {
  key: defaultConfig.productName,
  storage,
  whitelist: persistReducers
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer
)
const persistor = persistStore(
  store
)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <Component />
        </ConfigProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
}
render(Route);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
