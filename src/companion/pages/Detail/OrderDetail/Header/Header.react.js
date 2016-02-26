import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithOneItem} from "../../TabWithOneItem.react.js";
import {fieldToDescription} from "./intl";

function completeQuantityFormatter({completeQuantity, totalQuantity}) {
  return (
    <span>{completeQuantity}/{totalQuantity}</span>
  );
}

function completeLinesFormatter({completeLines, totalLines}) {
  return (
      <span>{completeLines}/{totalLines}</span>
  );
}

const fieldFormater = {
  orderDate: datetimeToSecondsFormater,
  dueDate: datetimeToSecondsFormater,
  "completeQuantity+totalQuantity": completeQuantityFormatter,
  "completeLines+totalLines": completeLinesFormatter
};

function getIdFromItem(data) {
  return data.orderId;
}

export class Header extends Component {
  render() {
    return (
      <TabWithOneItem {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}} />
    );
  }
}
