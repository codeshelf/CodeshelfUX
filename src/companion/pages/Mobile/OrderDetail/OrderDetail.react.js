import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSetFilter, acSearch} from './store';
import {getOrderDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {Items} from "./Items/Items.react.js";
import {Picks} from "./Picks/Picks.react.js";
import {Imports} from "./Imports/Imports.react.js";

const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_ITEMS]: Items,
  [TAB_PICKS]: Picks,
  [TAB_IMPORTS]: Imports,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Order",
  [TAB_ITEMS]: "Lines",
  [TAB_PICKS]: "History",
  [TAB_IMPORTS]: "Imports",
}

const tabToDescriptionText = {
  [TAB_DETAIL]: "Order Header",
  [TAB_ITEMS]: "Line Items",
  [TAB_PICKS]: "Pick History",
  [TAB_IMPORTS]: "Files",
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props, itemId) {
  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {orderId, status} = props[TAB_DETAIL].data;
    return (
      <div>
        <h3>{fieldToDescription.orderId}: {orderId}</h3>
        <h4>{fieldToDescription.status}: {status}</h4>
      </div>
    );
  }
  // we don'y have data yet
  return (
    <div>
      <h3>{fieldToDescription.orderId}: {itemId}</h3>
      <h4>{fieldToDescription.status}: </h4>
    </div>
  );
}

export class OrderDetail extends Component {
  render() {
    return (
      <Detail {...this.props} {...{
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        tabToDescriptionText,
        getTitleComponent,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
      acSettingOpen, acSettingClose, acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getOrderDetailMutable, mapDispatch)(OrderDetail));
