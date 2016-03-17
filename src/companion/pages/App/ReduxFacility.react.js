import React, {Component} from 'react';
// redux imports
import {createApplicationStore} from '../../storeFactory.js';
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import * as storageConfig from '../Mobile/storage';

import {facilityReducer} from '../Facility/store';
import {workerPickChartReducer} from '../Mobile/WorkerPickCharts/store';
import {cartSearchReducer} from '../Search/CartSearch/store';
import {cartDetailReducer} from '../Detail/CartDetail/store';
import {orderSearchReducer} from '../Search/OrderSearch/store';
import {orderDetailReducer} from '../Detail/OrderDetail/store';
import {workerSearchReducer} from '../Search/WorkerSearch/store';
import {workerDetailReducer} from '../Detail/WorkerDetail/store';
import {workerMgmtReducer} from './WorkerMgmt/store';
import {printingTemplatesReducer} from './PrintingTemplates/store';
import {sidebarReducer} from '../Sidebar/store';
import {listReducer} from '../../components/common/list/store';
import {ediGatewayReducer} from './Import/store';
import {dailyMetricsReducer} from './Maintenance/store';

const rootReducer = combineReducers({
  cartSearch: cartSearchReducer,
  cartDetail: cartDetailReducer,
  dailyMetrics: dailyMetricsReducer,
  ediGateway: ediGatewayReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
  printingTemplates: printingTemplatesReducer,
  workerSearch: workerSearchReducer,
  workerDetail: workerDetailReducer,
  workerPickChart: workerPickChartReducer,
  workerMgmt: workerMgmtReducer,
  sidebar: sidebarReducer,
  list: listReducer,
});

const store = createApplicationStore(rootReducer, {
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
