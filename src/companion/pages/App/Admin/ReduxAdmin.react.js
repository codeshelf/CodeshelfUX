import React, {Component} from 'react';
// redux imports
import {createApplicationStore} from '../../../storeFactory.js';
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
//import {sidebarReducer} from '../../Mobile/Sidebar/store';

import {usersReducer} from '../../Users/store.js';

const rootReducer = combineReducers({
  users: usersReducer
});

const store = createApplicationStore(rootReducer);

export default function (props) {
  return (
    <Provider store={store}>
      {props.children && React.cloneElement(props.children, props)}
    </Provider>
  );
}
