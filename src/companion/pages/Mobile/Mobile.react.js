import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

// redux imports
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";
import * as storage from 'redux-storage'
import createEngine from 'redux-storage/engines/localStorage';

// reducer imports
import {facilityReducer} from './Facility/store';
import {orderSearchReducer} from './OrderSearch/store';
import {orderDetailReducer, PERSIST_STATE_PART, SETTING_PROPERTY_VISIBILITY, SETTING_PROPERTY_ORDER} from './OrderDetail/store';

const rootReducer = storage.reducer(combineReducers({
//  user: userReducer,
//  navigation: navigationReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
}));

const storageEngine = storage.decorators.filter(
  createEngine('codeshelfus-mobile-web'),
  [...PERSIST_STATE_PART]);
//const storageEngine = createEngine('codeshelfus-mobile-web');
const storageMiddleware = storage.createMiddleware(
  storageEngine,
  []/* black list action */,
  [SETTING_PROPERTY_VISIBILITY, SETTING_PROPERTY_ORDER] /* white list action */);

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

// load data from local storage
storage.createLoader(storageEngine)(store);



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