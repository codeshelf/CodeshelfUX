import React, {Component} from 'react';
import {dateFormater} from "../../DateDisplay.react.js";
import {TabWithOneItem} from "../../Detail/TabWithOneItem.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
  updated: dateFormater,
};

function getIdFromItem(data) {
  return data.persistentId;
}

export class Header extends Component {
  render() {
    return (
      <TabWithOneItem {...this.props} {...{fieldToDescription, getIdFromItem, fieldFormater}} />
    );
  }
}
