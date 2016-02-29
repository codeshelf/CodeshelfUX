import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {Link} from '../../../links';

import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithItemList} from "../../TabWithItemList.react.js";

import {TopChart} from '../../../Mobile/WorkerPickCharts/TopChart.react.js';
import {SettingsRow} from "../../common/SettingsRow.react.js";
import {Settings} from '../../common/Settings.react.js';
import {renderField, deviceFormatter, orderLinkFormatter, workerIdFormatter, workerNameFormatter} from "../../common/FieldRenderer.react.js";
import {acGetPurposes} from "../../../Mobile/WorkerPickCharts/store";

import {fieldToDescription} from "./intl";
import moment from "moment";
import Icon from 'react-fa';

const fieldFormater = {
  created: datetimeToSecondsFormater,
  assigned: datetimeToSecondsFormater,
};


function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No planned work for this cart";

export class PlannedDump extends Component {

  render() {
    console.info('@@@@', this.props);
    //consume acReloadTab so that the list does not show Refresh button
    const {data: {results}, filter, id, ...other} = this.props;
    return (
      <div>
        <TabWithItemList data={results} {...{getIdFromItem, fieldToDescription, fieldFormater}} {...other}>
          {noEntriesText}
        </TabWithItemList>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {cartDetail: state.cartDetail};
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export const Planned = connect(mapStateToProps, mapDispatch)(PlannedDump);
