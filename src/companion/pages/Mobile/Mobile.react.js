import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

// redux imports
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";


// reducer imports
import {facilityReducer} from './Facility/store';
import {orderSearchReducer} from './OrderSearch/store';
import {orderDetailReducer} from './OrderDetail/store';

const rootReducer = combineReducers({
//  user: userReducer,
//  navigation: navigationReducer,
  facility: facilityReducer,
  orderSearch: orderSearchReducer,
  orderDetail: orderDetailReducer,
});


const logger = createLogger();

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunk,
    logger
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);


let store = createStoreWithMiddleware(rootReducer)



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