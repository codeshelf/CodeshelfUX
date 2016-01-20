import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail, TitleComponent, TitleCol} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_HISTORY, TAB_PRODUCTIVITY, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSearchAdditional, acSetFilter, acSearch,
    acSetFilterAndRefresh, acMoveGraphToLeft, acMoveGraphToRight} from './store';
import {getWorkerDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {History} from "./History/History.react.js";
import {Productivity} from "./Productivity/Productivity.react.js";


const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_HISTORY]: History,
  [TAB_PRODUCTIVITY]: Productivity,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Worker",
  [TAB_HISTORY]: "History",
  [TAB_PRODUCTIVITY]: "Productivity",
}

const tabToConstant = {
  "detail": TAB_DETAIL,
  "history": TAB_HISTORY,
  "productivity": TAB_PRODUCTIVITY,
}

const constantToTab = {
  "worker tab detail": "detail",
  "worker tab history": "history",
  "worker tab productivity": "productivity",
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
    const {tab} = this.props;
    const {error, whatIsLoading, whatIsLoaded} = this.props[tab];
    const tabSpecific = {
      [TAB_PRODUCTIVITY] : {
        error,
        whatIsLoading,
        whatIsLoaded,
      }
    };
    const defaultSelectTab = TAB_PRODUCTIVITY;
    return (
      <Detail {...this.props} {...{
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        getTitleComponent,
        tabSpecific,
        defaultSelectTab,
        tabToConstant,
        constantToTab,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility,
   acSetFieldOrder, acSearchAdditional, acSettingOpen, acSettingClose,
   acSetFilter, acSearch, acSetFilterAndRefresh, acMoveGraphToLeft, acMoveGraphToRight}, dispatch);
}

export default exposeRouter(connect(getWorkerDetailMutable, mapDispatch)(WorkerDetail));
