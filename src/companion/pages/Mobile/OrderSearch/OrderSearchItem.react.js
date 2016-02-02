import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../DateDisplay.react.js";
import {SearchItem, renderMatch} from "../Search/SearchItem.react.js";

export class OrderSearchItem extends Component {

  render() {
    const {orderId, dueDate, status, filterText} = this.props;
    const subtitle = <span>{status} - <DateDisplay date={dueDate} /></span>;
    return (
      <SearchItem to="mobile-order-datail-default" params={{id: orderId}}
          title={renderMatch(orderId, filterText)}
          subtitle={subtitle} />
    );
  }
}
