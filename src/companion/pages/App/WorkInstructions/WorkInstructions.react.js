import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from "components/common/IBox";
import WorkInstructionIBox from "./WorkInstructionIBox";
export default class WorkInstructions extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<DocumentTitle title="Work Instructions">
                  <SingleCellLayout>
                      <WorkInstructionIBox state={this.props.state} />
                  </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
