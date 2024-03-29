import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {deviceLinkFormatter, workerIdFormatter, workerNameFormatter} from "../../common/FieldRenderer";
import {TabWithItemList} from "../../TabWithItemList.react.js";

import {fieldToDescription} from "../../../Mobile/common/historyItemIntl";

const fieldFormater = {
  createdAt: datetimeToSecondsFormater,
  resolvedAt: datetimeToSecondsFormater,
  workerId: workerIdFormatter,
  "workerId+workerName" : workerNameFormatter,
  "deviceName+deviceGuid": deviceLinkFormatter
};

function getIdFromItem(data) {
  return data.persistentId;
};


export class Picks extends Component {

  render() {
    return (
      <TabWithItemList {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}}>
        <div>No history for this order</div>
      </TabWithItemList>
    );
  }
}
