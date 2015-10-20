import  React from "react";
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
import {properties, keyColumn} from "data/types/DailyMetric";
import {fromJS, List} from "immutable";

export default class DailyMetrics extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            results: List(),
            columnMetadata: ListView.toColumnMetadataFromProperties(properties)
        };
    }

    render() {
            const {results, columnMetadata} = this.state;
            let columnsCursor  = this.props.appState.cursor(["preferences", "dailymetric", "table", "columns"]);

        return (
                <ListManagement
                 results={results}
                 keyColumn="date"
                 columns={columnsCursor}
                 columnMetadata={columnMetadata} />
        );
    }
};
