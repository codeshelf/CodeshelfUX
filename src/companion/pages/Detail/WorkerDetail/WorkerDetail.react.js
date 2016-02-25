import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail, TitleComponent, TitleCol} from "../Detail.react.js";

import {TAB_DETAIL, TAB_PRODUCTIVITY, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSearchAdditional, acSetFilter, acSearch,
    acSetFilterAndRefresh} from './store';
import {getWorkerDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {Productivity} from "./Productivity/Productivity.react.js";
import {IBox} from '../../IBox.react.js';


const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_PRODUCTIVITY]: Productivity,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Worker",
  [TAB_PRODUCTIVITY]: "Productivity",
}

export const convertTab = {
  fromURL: {
    detail: TAB_DETAIL,
    productivity: TAB_PRODUCTIVITY,
  },
  toURL: {
    [TAB_DETAIL]: "./detail",
    [TAB_PRODUCTIVITY]: "./productivity",
  },
}

// is called inide render of Detail component so have access to props
function getTitleComponent(props, itemId) {
  let [leftValue, rightValue] = [null, itemId];

  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {domainId, firstName, middleInitial, lastName} = props[TAB_DETAIL].data;
    leftValue = `${firstName || ''} ${middleInitial || ''} ${lastName}`;
    rightValue = domainId;
  }
  return (<TitleComponent className="detail-title">
            <TitleCol property={fieldToDescription["firstName+middleInitial+lastName"]} value={leftValue} />
            <TitleCol property={fieldToDescription.domainId} value={rightValue} />
          </TitleComponent>);
}

export class WorkerDetail extends Component {
  render() {
    const {tab, acSelectTab, params:{id}} = this.props;
    const {error, whatIsLoading, whatIsLoaded} = this.props[tab];
    const transitionTo = 'mobile-worker-detail';
    return (
        <IBox reloadFunction={() => acSelectTab(tab, id, true)}>
          <Detail {...this.props} {...{
            ALL_TABS,
            tabToComponent,
            tabToHeaderText,
            getTitleComponent,
            convertTab,
            transitionTo,
          }} />
        </IBox>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
   acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
   acSetFilter, acSearch, acSetFilterAndRefresh}, dispatch);
}

export default exposeRouter(connect(getWorkerDetailMutable, mapDispatch)(WorkerDetail));
