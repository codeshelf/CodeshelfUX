import React from "react";
import ListView from "components/common/list/ListView";
import DateDisplay from "components/common/DateDisplay";
import DurationDisplay from "components/common/DurationDisplay";
import Immutable from "immutable";
import ListManagement from "components/common/list/ListManagement";

export default class ImportList extends React.Component {

  constructor( props ) {
    super(props);
    this.columnMetadata = ListView.toColumnMetadata([
      {
        columnName: "received",
        displayName: "Received",
        customComponent: DateDisplay
      },
      {
        columnName: "filename",
        displayName: "File Name"
      },
      {
        columnName: "started",
        displayName: "Started",
        customComponent: DateDisplay
      },
      {
        columnName: "processingTime", //based on completed - started
        displayName: "Processing Time",
        customComponent: DurationDisplay
      },
      {
        columnName: "ordersProcessed",
        displayName: "Orders Processed"
      },
      {
        columnName: "linesProcessed",
        displayName: "Lines Processed"
      },
      {
        columnName: "linesFailed",
        displayName: "Lines Failed"
      },
      {
        columnName: "status",
        displayName: "Status"
      },
      {
        columnName: "username",
        displayName: "Username"
      }
    ]);

    let {state} = props;
  }

  render() {
    let {receipts} = this.props;
    let enhanced = Immutable.fromJS(receipts).map((receipt) => {
      if ( receipt.get("completed") ) {
        return receipt.set("processingTime", receipt.get("completed") - receipt.get("started"));
      } else {
        return receipt;
      }
    });
    return (
      <ListManagement results={enhanced}
                keyColumn="persistentId"
                storeName="import"
                columnMetadata={this.columnMetadata}
                />
    );
  }
}
;
