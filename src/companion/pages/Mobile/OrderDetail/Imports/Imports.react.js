import React, {Component} from 'react';
import {dateFormater} from "../../DateDisplay.react.js";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
    received: dateFormater,
    completed: dateFormater,
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