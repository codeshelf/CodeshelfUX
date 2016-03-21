import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {Link} from '../../../links';

import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithItemList, MoreDisplay} from "../../TabWithItemList.react.js";

import {TopChart} from '../../../Mobile/WorkerPickCharts/TopChart.react.js';
import {SettingsRow} from "../../common/SettingsRow.react.js";
import {Settings} from '../../common/Settings.react.js';
import {renderField, deviceFormatter, orderLinkFormatter, workerIdFormatter, workerNameFormatter} from "../../common/FieldRenderer.react.js";
import {acGetPurposes} from "../../../Mobile/WorkerPickCharts/store";

import {fieldToDescription} from "../../../Mobile/common/historyItemIntl";
import moment from "moment";
import Icon from 'react-fa';

const fieldFormater = {
  createdAt: datetimeToSecondsFormater,
  resolvedAt: datetimeToSecondsFormater,
  orderId: orderLinkFormatter,
  workerId: workerIdFormatter,
  "workerId+workerName" : workerNameFormatter,
  "deviceName+deviceGuid": deviceFormatter
};


function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No history for this cart";

export class ProductivityDump extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  render() {
    //consume acReloadTab so that the list does not show Refresh button
    const {data: {events, histogram}, workerPickChart, additionalDataLoading,
           filter, acReloadTab, ...other} = this.props;

    if (filter === null) return null;
    const {next} = events;
    return (
      <div>
        <TopChart {...this.props}
          data={histogram}
          purposes={workerPickChart.purposes}
        />
        <TabWithItemList data={events.results} {...{getIdFromItem, fieldToDescription, fieldFormater}} {...other}>
          {noEntriesText}
        </TabWithItemList>
        <Row>
          <Col>
            <MoreDisplay {...this.props} data={events}/>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {workerPickChart: state.workerPickChart};
}

function mapDispatch(dispatch) {
  return bindActionCreators({acGetPurposes}, dispatch);
}

export const History = connect(mapStateToProps, mapDispatch)(ProductivityDump);
