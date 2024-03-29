import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithItemList} from "../../TabWithItemList.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
};

function getIdFromItem(data) {
  return data.orderDetailId;
};

export class Items extends Component {

  render() {
    return (
      <TabWithItemList {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}}>
        <div> Not item in this order</div>
      </TabWithItemList>
    );
  }
}