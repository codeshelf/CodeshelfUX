import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_HISTORY, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSearchAdditional, acSetFilter, acSearch} from './store';
import {getWorkerDetail} from "./get";

import {Header} from "./Header/Header.react.js";
import {History} from "./History/History.react.js";

const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_HISTORY]: History,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "HDR",
  [TAB_HISTORY]: "History",
}

const tabToDescriptionText = {
  [TAB_DETAIL]: "Worker Header",
  [TAB_HISTORY]: "Worker History",
}

const headerText = "Badge id";
const defaultSelectTab = TAB_HISTORY;

export class WorkerDetail extends Component {
  render() {
    return (
      <Detail {...this.props} {...{
        defaultSelectTab,
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        tabToDescriptionText,
        headerText,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
   acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
   acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getWorkerDetail, mapDispatch)(WorkerDetail));
