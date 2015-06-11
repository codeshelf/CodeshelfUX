import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from "components/common/IBox";
import OrderReview from "./OrderReview";

export default class Orders extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        return (<DocumentTitle title="Orders">
                  <SingleCellLayout>
                      <SingleCellIBox title="Order List">
                          <OrderReview />
                      </SingleCellIBox>
                  </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
