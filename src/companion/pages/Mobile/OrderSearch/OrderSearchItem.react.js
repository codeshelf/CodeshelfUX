import {Component} from 'react';
import {DateDisplay} from "../../DateDisplay.react.js";
import {SearchItem, renderMatch} from "../../Search/SearchItem.react.js";

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
