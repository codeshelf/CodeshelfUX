import React, {Component} from 'react';
import {datetimeFormatter} from "../../DateDisplay.react.js";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";

import {fieldToDescription} from "./intl";

const secondsFormatter = datetimeFormatter.bind(null, 'second');

const fieldFormater = {
  createdAt: secondsFormatter,
  resolvedAt: secondsFormatter,
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
