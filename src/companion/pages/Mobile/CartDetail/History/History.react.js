import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {Link} from '../../links';

import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithItemList, MoreDisplay} from "../../Detail/TabWithItemList.react.js";

import {TopChart} from '../../WorkerPickCharts/TopChart.react.js';
import {SettingsRow} from "../../Detail/common/SettingsRow.react.js";
import {Settings} from '../../Detail/common/Settings.react.js';
import {renderField, deviceFormatter, orderLinkFormatter, workerIdFormatter, workerNameFormatter} from "../../Detail/common/FieldRenderer.react.js";

import {fieldToDescription} from "../../common/historyItemIntl";
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
    const {data: {events, histogram},
           filter, acReloadTab, ...other} = this.props;

    if (filter === null) return null;
    const {next} = events;
    return (
      <div>
        <TopChart {...this.props}
          data={histogram}
        />
        <TabWithItemList data={events.results} {...{getIdFromItem, fieldToDescription, fieldFormater}} {...other}>
          {noEntriesText}
        </TabWithItemList>
        <Row>
          <Col>
            <MoreDisplay {...this.props} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export const History = connect(mapStateToProps, mapDispatch)(ProductivityDump);
