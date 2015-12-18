import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
    received: datetimeToSecondsFormater,
    completed: datetimeToSecondsFormater,
};

function getIdFromItem(data) {
  return data.persistentId;
};

export class Imports extends Component {

  render() {
    return (
      <TabWithItemList {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}}>
        <div>No imports for this order</div>
      </TabWithItemList>
    );
  }
}