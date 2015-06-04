import  React from "react";
import {Table} from "components/common/Table";
import _ from "lodash";
import DateDisplay from "components/common/DateDisplay";
import DurationDisplay from "components/common/DurationDisplay";
import Immutable from "immutable";

export default class ImportList extends React.Component{

    constructor(props) {
        super(props);
        this.columnMetadata = [
            {columnName: "received",
             displayName: "Received",
             customComponent: DateDisplay },
            {columnName: "filename",
                 displayName: "FILE NAME" },
             
            {columnName: "started",
             displayName: "Started",
             customComponent: DateDisplay },
            {columnName: "processingTime",  //based on completed - started
             displayName: "Processing Time",
             customComponent: DurationDisplay},

            {columnName: "ordersProcessed",
                 displayName: "Orders Processed"},
            {columnName: "linesProcessed",
                 displayName: "Lines Processed" },
            {columnName: "status",
             displayName: "Status" },
            {columnName: "username",
             displayName: "Username" }
        ];

        this.columns = _.map(this.columnMetadata, (c) => c.columnName);

    }

    render() {
        let {receipts} = this.props;
        let sorted = Immutable.fromJS(receipts).map((receipt) => {
            if (receipt.get("completed")) {
                return receipt.set("processingTime", receipt.get("completed") - receipt.get("started"));
            } else {
                return receipt;
            }
        }).sortBy((receipt) => {
            return receipt.get("started");
        }).reverse();
        return (<Table results={sorted}
                 columnMetadata={this.columnMetadata}
                 columns={this.columns}
                 sortedBy={"-started"}>
                </Table>);
    }
};
