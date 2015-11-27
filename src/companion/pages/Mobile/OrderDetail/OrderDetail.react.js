import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';

class OrderDetail extends Component {
  render() {
    const {id: orderId} = this.props.router.getCurrentParams();

    return (
      <div>
        Order detail - {orderId}
      </div>
    );
  }
}

export default exposeRouter(OrderDetail);