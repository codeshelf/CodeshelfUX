import React, {Component} from 'react';
// redux imports
import {createApplicationStore} from '../../storeFactory.js';
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";

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

const rootReducer = combineReducers({
  cartSearch: cartSearchReducer,
  cartDetail: cartDetailReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
  printingTemplates: printingTemplatesReducer,
  workerSearch: workerSearchReducer,
  workerDetail: workerDetailReducer,
  workerPickChart: workerPickChartReducer,
  workerMgmt: workerMgmtReducer,
  sidebar: sidebarReducer,
});

const store = createApplicationStore(rootReducer);

export default function (props) {
  return (
      <Provider store={store}>
      {props.children}
    </Provider>
  );
}
