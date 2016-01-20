import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {deviceFormatter} from "../../Detail/common/FieldRenderer";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";
import {Link} from '../../links';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';

import {fieldToDescription} from "../../common/historyItemIntl";

function workerComponent(workerId) {
  if (!workerId) return workerId;
  return (
    <Link to="mobile-worker-detail-default" params={{id: encodeURIComponent(workerId)}}>
      {workerId}
      <Button bsStyle="link"><Icon name="chevron-right"/></Button>
    </Link>
  );
}

function workerNameComponent({workerId, workerName}) {
  if (!workerId) return <span>{workerName}</span>;
  return (
    <Link to="mobile-worker-detail-default" params={{id: encodeURIComponent(workerId)}} onClick={(e) => e.stopPropagation()}>
      Worker: {workerName}
      <Button bsStyle="link"><Icon name="chevron-right"/></Button>
    </Link>
  );
}

const fieldFormater = {
  createdAt: datetimeToSecondsFormater,
  resolvedAt: datetimeToSecondsFormater,
  workerId: workerComponent,
  "workerId+workerName" : workerNameComponent,
  "deviceName+deviceGuid": deviceFormatter
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
