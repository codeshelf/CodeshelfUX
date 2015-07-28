import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from "components/common/IBox";
import OrdersIBox from "./OrdersIBox";

export default class Orders extends React.Component{

    constructor(props) {
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
