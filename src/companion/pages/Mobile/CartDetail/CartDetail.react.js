import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail, TitleComponent, TitleCol} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_PRODUCTIVITY, TAB_ACTIONS, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
        acSettingOpen, acSettingClose, acSearchAdditional, acSetFilter, acSearch,
        acSetFilterAndRefresh, acCartAction} from './store';
import {getCartDetailMutable} from "./get";

import {Cart} from "./Cart/Cart.react.js";
import {fieldToDescription} from "./Cart/intl";
import {History} from "./History/History.react.js";
import {Actions} from "./Actions/Actions.react.js";

const tabToComponent = {
  [TAB_DETAIL]: Cart,
  [TAB_PRODUCTIVITY]: History,
  [TAB_ACTIONS]: Actions
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Detail",
  [TAB_PRODUCTIVITY]: "Productivity",
  [TAB_ACTIONS]: "Actions",
}

export const convertTab = {
  fromURL: {
    detail: TAB_DETAIL,
    productivity: TAB_PRODUCTIVITY,
    actions: TAB_ACTIONS,
  },
  toURL: {
    [TAB_DETAIL]: "detail",
    [TAB_PRODUCTIVITY]: "productivity",
    [TAB_ACTIONS] : "actions"
  },
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props) {
  let [leftValue, rightValue] = [null, null];

  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {domainId, deviceGuid} = props[TAB_DETAIL].data;
    leftValue = domainId;
    rightValue = deviceGuid;
  }
  return (<TitleComponent className="detail-title">
            <TitleCol property={fieldToDescription.domainId} value={leftValue} />
            <TitleCol property={fieldToDescription["deviceGuid"]} value={rightValue} />
          </TitleComponent>);
}

export class CartDetail extends Component {
  render() {
    const {tab} = this.props;
    const {error, whatIsLoading, whatIsLoaded} = this.props[tab];
    const transitionTo = 'mobile-cart-detail';
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
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
                             acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
                             acSetFilter, acSearch, acSetFilterAndRefresh, acCartAction}, dispatch);
}

export default exposeRouter(connect(getCartDetailMutable, mapDispatch)(CartDetail));
