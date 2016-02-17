import React, {Component, PropTypes} from 'react';
import {DateDisplay} from "../../Mobile/DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Mobile/Search/SearchItem.react.js";
import {Link} from '../../Mobile/links';
import Icon from 'react-fa';

export class OrderSearchItem extends Component {

  render() {
    const {orderId, dueDate, status, filterText} = this.props;
    const subtitle = <span>{status} - <DateDisplay date={dueDate} /></span>;
    return (
      <Link to={`orders/${orderId}`}>
        <tr>
            <td>{renderMatch(orderId, filterText)}</td>
            <td>{subtitle}</td>
            <td><Icon name="chevron-right"/></td>
        </tr>
      </Link>
    )
  }
}
