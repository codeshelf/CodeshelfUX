import React from "react";
import { SingleCellLayout } from 'components/common/pagelayout';
import OrdersIBox from "./OrdersIBox";

export default class Orders extends React.Component {

  constructor( props ) {
    super(props);
  }

  render() {
    return (
      <SingleCellLayout title="Orders">
        <OrdersIBox state={this.props.state} />
      </SingleCellLayout>
      );
  }
};
