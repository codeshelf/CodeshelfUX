import React, {Component} from 'react';
// redux imports
import {createApplicationStore} from '../../storeFactory.js';
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import * as storageConfig from './storage';

// reducer imports
import {facilityReducer} from './Facility/store';
import {cartSearchReducer} from './CartSearch/store';
import {cartDetailReducer} from './CartDetail/store';
import {orderSearchReducer} from './OrderSearch/store';
import {orderDetailReducer} from './OrderDetail/store';
import {workerSearchReducer} from './WorkerSearch/store';
import {workerDetailReducer} from './WorkerDetail/store';
import {workerPickChartReducer} from './WorkerPickCharts/store';
import {sidebarReducer} from './Sidebar/store';

const rootReducer = combineReducers({
//  user: userReducer,
//  navigation: navigationReducer,
  cartSearch: cartSearchReducer,
  cartDetail: cartDetailReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
  workerSearch: workerSearchReducer,
  workerDetail: workerDetailReducer,
  workerPickChart: workerPickChartReducer,
  sidebar: sidebarReducer,
});

let store = createApplicationStore(rootReducer, {
  key: storageConfig.STORAGE_KEY,
  pathsToSync: storageConfig.PERSIST_STATE_PART,
  actionWhitelist: storageConfig.ACTIONS,
  version: storageConfig.VERSION
});

export default function (props) {
  return (
      <Provider store={store}>
        {props.children}
      </Provider>
  );
}
