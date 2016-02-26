import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../../DateDisplay.react.js";
import {TabWithOneItem} from "../../TabWithOneItem.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
  updated: datetimeToSecondsFormater,
  lastLogin: datetimeToSecondsFormater,
  lastLogout: datetimeToSecondsFormater
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
