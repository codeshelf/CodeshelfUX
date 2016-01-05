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
import {getWorkerDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {History} from "./History/History.react.js";

const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_HISTORY]: History,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Worker",
  [TAB_HISTORY]: "History",
}

const tabToDescriptionText = {
  [TAB_DETAIL]: "Worker Header",
  [TAB_HISTORY]: "Worker History",
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props, itemId) {
  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {domainId, firstName, middleInitial, lastName} = props[TAB_DETAIL].data;
    return (
      <div>
        <h3>{fieldToDescription["firstName+middleInitial+lastName"]}: {firstName} {middleInitial} {lastName}</h3>
        <h4>{fieldToDescription.domainId}: {domainId}</h4>
      </div>
    );
  }
  // we don'y have data yet
  return (
    <div>
      <h3>{fieldToDescription["firstName+middleInitial+lastName"]}:</h3>
      <h4>{fieldToDescription.domainId}: {itemId}</h4>
    </div>
  );
}

export class WorkerDetail extends Component {
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
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
   acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
   acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getWorkerDetailMutable, mapDispatch)(WorkerDetail));
