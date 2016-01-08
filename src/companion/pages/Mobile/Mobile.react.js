import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

// redux imports
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import * as storage from 'redux-storage'
import createEngine from 'redux-storage/engines/localStorage';
import * as storageConfig from './storage';

// reducer imports
import {facilityReducer} from './Facility/store';
import {orderSearchReducer} from './OrderSearch/store';
import {orderDetailReducer} from './OrderDetail/store';
import {workerSearchReducer} from './WorkerSearch/store';
import {workerDetailReducer} from './WorkerDetail/store';
import {workerPickChartReducer} from './WorkerPickCharts/store';

import {Iterable} from 'immutable';
Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value) }

const rootReducer = combineReducers({
//  user: userReducer,
//  navigation: navigationReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
  workerSearch: workerSearchReducer,
  workerDetail: workerDetailReducer,
  workerPickChart: workerPickChartReducer,
});

const storageEngine = storage.decorators.filter(
  createEngine(storageConfig.STORAGE_KEY),
  storageConfig.PERSIST_STATE_PART);

const storageMiddleware = storage.createMiddleware(
  storageEngine,
  []/* black list action */,
  storageConfig.ACTIONS /* white list action */);

const loggerMiddleware = createLogger();

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunk,
    storageMiddleware,
    loggerMiddleware
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);


let store = createStoreWithMiddleware(rootReducer)

// load data from local storage but only if version is greater than actual version
const versionInStorage = localStorage.getItem(storageConfig.STORAGE_KEY_VERSION);
if (versionInStorage >= storageConfig.VERSION) {
  storage.createLoader(storageEngine)(store);
} else {
  localStorage.removeItem(storageConfig.STORAGE_KEY);
  localStorage.setItem(storageConfig.STORAGE_KEY_VERSION, storageConfig.VERSION);
}



class Mobile extends Component {
  render() {
    return (
      <Provider store={store}>{ () =>
        <RouteHandler />
      }</Provider>
    );
  }
}

export default Mobile;