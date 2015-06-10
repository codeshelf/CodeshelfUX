import  React from "react";
import DocumentTitle from "react-document-title";
import {Table} from "components/common/Table";

export default class OrderDetailList extends React.Component{

    constructor(props) {
        super(props);
        this.columnMetadata = [
            {
                columnName: "itemId",
                displayName: "Item"
            },
            {
                columnName: "uom",
                displayName: "UOM"
            },
            {
                columnName: "description",
                displayName: "Description"
            },
            {
                columnName: "planQuantity",
                displayName: "Plan Qty."
            },
            {
                columnName: "status",
                displayName: "Status"
            }
        ];
        this.columns = this.columnMetadata.map((column) => column.columnName);
    }

    render() {
        let {orderDetails} = this.props;
        return (<Table results={orderDetails} columnMetadata={this.columnMetadata} columns={this.columns} />);
    }
};
