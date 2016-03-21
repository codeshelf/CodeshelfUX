import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';

import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithItemList} from "../../TabWithItemList.react.js";

import {renderField, deviceFormatter, orderLinkFormatter, workerIdFormatter, workerNameFormatter} from "../../common/FieldRenderer.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
  created: datetimeToSecondsFormater,
  assigned: datetimeToSecondsFormater,
};


function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No planned work for this worker";

export class LocationDump extends Component {

  render() {
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
  return {workerDetail: state.workerDetail};
}

function mapDispatch(dispatch) {
  return bindActionCreators({}, dispatch);
}

export const Location = connect(mapStateToProps, mapDispatch)(LocationDump);
