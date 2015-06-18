import  React from "react";
import {Table} from "components/common/Table";
import moment from "moment";
export default class PickRateTable extends React.Component{

    constructor(props) {
        super(props);
    }

    toTableData(pickRates) {
        return _.chain(pickRates).map((series) =>{
            return _.reduce(series.values, (row, value) => {
                let y = value.y;
                let cellValue = (y > 0) ? y : null;
                row[value.x.toString()] = cellValue;
                row.worker = value.key;
                row.total += y;
                return row;
            }, {total: 0});
        })
        .sortBy("total")
        .reverse()
        .value();

    }

    render() {
        let {pickRates, startTimestamp, endTimestamp} = this.props;
        let tableData = this.toTableData(pickRates);
        let firstHour = moment(startTimestamp).hour();
        let lastHour = moment(endTimestamp).hour();
        let hourColumns = _.range(firstHour, lastHour+1).map((i) => i.toString());
        let columnMetadata = _.map(hourColumns, (key) => {
            return {
                columnName: key,
                displayName: moment().hour(parseInt(key))
                                     .minute(0)
                                     .format("H:mm")
            };
        });
        columnMetadata.unshift({
            columnName: "worker",
            displayName: "Worker"
        });
        columnMetadata.push({
            columnName: "total",
            displayName: "Total"
        });
        return (<div>
                   <Table results={tableData} columnMetadata={columnMetadata} sortedBy="-total" emptyMessage={""} />
                </div>
        );
    }
};
