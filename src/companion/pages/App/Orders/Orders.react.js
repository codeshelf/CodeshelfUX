import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from "components/common/IBox";
import PivotIBox from "./PivotIBox";

export default class Orders extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<DocumentTitle title="Orders">
                  <SingleCellLayout>
                      <PivotIBox state={this.props.state} />
                  </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
