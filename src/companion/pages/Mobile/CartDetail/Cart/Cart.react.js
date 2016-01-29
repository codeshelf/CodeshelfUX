import React, {Component} from 'react';
import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithOneItem} from "../../Detail/TabWithOneItem.react.js";
import {fieldToDescription} from "./intl";

const fieldFormater = {
  updated: datetimeToSecondsFormater,
};

function getIdFromCart(data) {
  return data.persistentId;
}

export class Cart extends Component {
  render() {
    return (
      <TabWithOneItem {...this.props} {...{fieldToDescription, getIdFromCart, fieldFormater}} />
    );
  }
}
