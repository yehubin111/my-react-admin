import { combineReducers } from 'redux';
import * as base from './base';
import * as user from './user';
import * as operation from './operation';
import * as common from './common';
import * as product from './product';

export const persistReducers = ["qiniuInfo", "userInfo"];
export default combineReducers({
    ...base,
    ...user,
    ...operation,
    ...common,
    ...product
});