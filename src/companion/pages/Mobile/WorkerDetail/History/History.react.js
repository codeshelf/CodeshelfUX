import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {deviceFormatter} from "../../Detail/common/FieldRenderer";
import {TabWithItemPaging} from "../../Detail/TabWithItemPaging.react.js";
import {Link} from '../../links';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';

import {fieldToDescription} from "../../common/historyItemIntl";

function orderIdComponent(orderId) {
  if (!orderId) return <span>{orderId}</span>;
  return (
      <Link to="mobile-order-datail" params={{id: encodeURIComponent(orderId)}} onClick={(e) => e.stopPropagation()}>
        {orderId}
      </Link>
  );
}

function deviceComponent({deviceName, deviceGuid}) {
  const shortGuid = deviceGuid && parseInt(deviceGuid, 16).toString(16).toUpperCase();
  return (<span>{`${deviceName}/0x${shortGuid}`}</span>);
}

const fieldFormater = {
    createdAt: datetimeToSecondsFormater,
    orderId: orderIdComponent,
    "deviceName+deviceGuid": deviceFormatter
};

function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No history for this worker";

export class History extends Component {

  render() {
    return (
      <TabWithItemPaging {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater, noEntriesText}}>
        <div></div>
      </TabWithItemPaging>
    );
  }
}
