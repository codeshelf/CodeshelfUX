import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Mobile/Search/SearchItem.react.js";

export class OrderSearchItem extends Component {

  render() {
    const {orderId, dueDate, status, filterText} = this.props;
    const subtitle = <span>{status} - <DateDisplay date={dueDate} /></span>;
    return (
      <SearchItem to={`orders/${orderId}`}
          title={renderMatch(orderId, filterText)}
          subtitle={subtitle} />
    );
  }
}
