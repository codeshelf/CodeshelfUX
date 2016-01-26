import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail, TitleComponent, TitleCol} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSetFilter, acSearch} from './store';
import {getOrderDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {Items} from "./Items/Items.react.js";
import {Picks} from "./Picks/Picks.react.js";
import {Imports} from "./Imports/Imports.react.js";
import _ from "lodash";

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

export const convertTab = {
  fromURL: {
    order: TAB_DETAIL,
    lines: TAB_ITEMS,
    history: TAB_PICKS,
    imports: TAB_IMPORTS,
  },
  toURL: {
    [TAB_DETAIL]: "order",
    [TAB_ITEMS]: "lines",
    [TAB_PICKS]: "history",
    [TAB_IMPORTS]: "imports",
  },
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props, itemId) {
  let [leftValue, rightValue] = [itemId, null];
  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {orderId, status} = props[TAB_DETAIL].data;
    leftValue = orderId;
    rightValue = status;
  }
  return (<TitleComponent className="detail-title">
              <TitleCol property={fieldToDescription.orderId} value={leftValue} />
              <TitleCol property={fieldToDescription.status} value={rightValue} />
          </TitleComponent>);
}

export class OrderDetail extends Component {
  render() {
    const transitionTo = 'mobile-order-datail';
    return (
      <Detail {...this.props} {...{
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        getTitleComponent,
        convertTab,
        transitionTo,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
      acSettingOpen, acSettingClose, acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getOrderDetailMutable, mapDispatch)(OrderDetail));
