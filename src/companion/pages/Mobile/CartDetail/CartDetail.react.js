import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail, TitleComponent, TitleCol} from "../Detail/Detail.react.js";

import {TAB_CART, TAB_HISTORY, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSearchAdditional, acSetFilter, acSearch} from './store';
import {getCartDetailMutable} from "./get";

import {Cart} from "./Cart/Cart.react.js";
import {fieldToDescription} from "./Cart/intl";
import {History} from "./History/History.react.js";

const tabToComponent = {
  [TAB_CART]: Cart,
  [TAB_HISTORY]: History,
}

const tabToHeaderText = {
  [TAB_CART]: "Cart",
  [TAB_HISTORY]: "History",
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props) {
  let [leftValue, rightValue] = [null, null];

  if (props && props[TAB_CART] && props[TAB_CART].data) {
    const {domainId, deviceGuid} = props[TAB_CART].data;
    leftValue = deviceGuid;
    rightValue = domainId;
  }
  return (<TitleComponent className="detail-title">
            <TitleCol property={fieldToDescription["deviceGuid"]} value={leftValue} />
            <TitleCol property={fieldToDescription.domainId} value={rightValue} />
          </TitleComponent>);
}

export class CartDetail extends Component {
  render() {
    return (
      <Detail {...this.props} {...{
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        getTitleComponent,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
   acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
   acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getCartDetailMutable, mapDispatch)(CartDetail));
