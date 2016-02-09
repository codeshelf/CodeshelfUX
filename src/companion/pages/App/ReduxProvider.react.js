import React, {Component} from 'react';
// redux imports
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createLogger from "redux-logger";

import {facilityReducer} from '../Mobile/Facility/store';
import {sidebarReducer} from '../Mobile/Sidebar/store';


import {Iterable} from 'immutable';

Iterable.prototype[Symbol.for('get')] = function(value) {return this.get(value) };

const rootReducer = combineReducers({
  facility: facilityReducer,
  sidebar: sidebarReducer,
});


const loggerMiddleware = createLogger();

// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunk,
    loggerMiddleware
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);


let store = createStoreWithMiddleware(rootReducer);

class ReduxProvider extends Component {
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

export default ReduxProvider;
