import React, {Component} from 'react';
import {dateFormater} from "../../DateDisplay.react.js";
import {TabWithItemPaging} from "../../Detail/TabWithItemPaging.react.js";
import {Link} from '../../links';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';

import {fieldToDescription} from "./intl";

function orderIdComponent(orderId) {
  if (!orderId) return orderId;
  return (
    <Link to="mobile-order-datail" params={{id: orderId}}>
      {orderId}
      <Button bsStyle="link"><Icon name="chevron-right"/></Button>
    </Link>
  );
}

const fieldFormater = {
    createdAt: dateFormater,
    orderId: orderIdComponent,
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