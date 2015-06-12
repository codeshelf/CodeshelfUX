import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from 'components/common/pagelayout';
import {SingleCellIBox} from "components/common/IBox";
import ExtensionPoints from "./ExtensionPoints";

export default class ExtensionPointsPage extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        return (<DocumentTitle title="Extension Points">
                   <SingleCellLayout>
                      <SingleCellIBox title="Extension Points">
                          <ExtensionPoints />
                      </SingleCellIBox>
                   </SingleCellLayout>
                </DocumentTitle>
               );
    }
};
