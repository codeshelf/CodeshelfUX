import React, {Component} from 'react';
import {dateFormater} from "../../DateDisplay.react.js";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
    createdAt: dateFormater,
};

function getIdFromItem(data) {
  return data.persistentId;
};

export class History extends Component {

  render() {
    return (
      <TabWithItemList {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}}>
        <div>No history for this worker</div>
      </TabWithItemList>
    );
  }
}