import React, {Component} from 'react';
// redux imports
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import * as storage from 'redux-storage';
import createEngine from 'redux-storage/engines/localStorage';
import * as storageConfig from './storage';

// reducer imports
import {facilityReducer} from '../Facility/store';
import {cartSearchReducer} from '../Search/CartSearch/store';
import {cartDetailReducer} from '../Detail/CartDetail/store';
import {orderSearchReducer} from '../Search/OrderSearch/store';
import {orderDetailReducer} from '../Detail/OrderDetail/store';
import {workerSearchReducer} from '../Search/WorkerSearch/store';
import {workerDetailReducer} from '../Detail/WorkerDetail/store';
import {workerPickChartReducer} from './WorkerPickCharts/store';
import {sidebarReducer} from './Sidebar/store';

import {Iterable} from 'immutable';
Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value) }

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
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

window.onerror = (errorMsg, url, lineNumber, columnNumber, error) => {
  if (error instanceof URIError) {
    console.error("Error occured: " + errorMsg, error);//or any message
    window.location = "/"
  }
  return false;
}

export default Mobile;
