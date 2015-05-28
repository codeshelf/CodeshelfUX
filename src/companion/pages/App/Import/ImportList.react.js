import  React from "react";
import {Table} from "components/common/Table";
export default class ImportList extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        let {imports} = this.props;
        return (<Table results={imports}>
                </Table>);
    }
};
