import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getOrderDetail} from './store';
import {acSearch} from './store';

function mapDispatch(dispatch) {
  return bindActionCreators({acSearch}, dispatch);
}

@connect(getOrderDetail, mapDispatch)
class OrderDetail extends Component {


  componentWillMount() {
    const {id: orderId} = this.props.router.getCurrentParams();
    this.props.acSearch(orderId);
  }

  render() {
    const {id: orderId} = this.props.router.getCurrentParams();
    const { whatIsLoading, error, order} = this.props;
    if (whatIsLoading !== null || order === null) {
      return <div> Loading ... </div>
    }
    return (
      <div>
        <h1>{order[0].orderId}</h1>
        Order detail - {JSON.stringify(order)}
      </div>
    );
  }
}

export default exposeRouter(OrderDetail);