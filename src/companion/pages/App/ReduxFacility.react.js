import React, {Component} from 'react';
// redux imports
import {createApplicationStore} from '../../storeFactory.js';
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";

import {facilityReducer} from '../Mobile/Facility/store';
import {sidebarReducer} from '../Mobile/Sidebar/store';
import {workerPickChartReducer} from '../Mobile/WorkerPickCharts/store';
import {cartSearchReducer} from '../Mobile/CartSearch/store';
import {cartDetailReducer} from '../Mobile/CartDetail/store';
import {orderSearchReducer} from '../Mobile/OrderSearch/store';
import {orderDetailReducer} from '../Mobile/OrderDetail/store';
import {workerSearchReducer} from '../Mobile/WorkerSearch/store';
import {workerDetailReducer} from '../Mobile/WorkerDetail/store';

const rootReducer = combineReducers({
  cartSearch: cartSearchReducer,
  cartDetail: cartDetailReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
  sidebar: sidebarReducer,
  workerSearch: workerSearchReducer,
  workerDetail: workerDetailReducer,
  workerPickChart: workerPickChartReducer,
});

const store = createApplicationStore(rootReducer);

export default function (props) {
  return (
      <Provider store={store}>
      {props.children}
    </Provider>
  );
}
