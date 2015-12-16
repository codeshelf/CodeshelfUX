import React, {Component} from 'react';
import {dateFormater} from "../../DateDisplay.react.js";
import {TabWithItemPaging} from "../../Detail/TabWithItemPaging.react.js";
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
      <TabWithItemPaging {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}}>
        <div>No history for this worker</div>
      </TabWithItemPaging>
    );
  }
}