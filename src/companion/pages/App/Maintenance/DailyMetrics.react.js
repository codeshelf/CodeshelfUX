import  React from "react";
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
import {Form, SubmitButton, Input, getRefInputValue} from "components/common/Form";
import DateDisplay from "components/common/DateDisplay";
import {properties, keyColumn} from "data/types/DailyMetric";
import {fromJS, List} from "immutable";
import {getAPIContext} from "data/csapi";
export default class DailyMetrics extends React.Component{

    constructor(props) {
        super(props);
        let columnMetadata = ListView.toColumnMetadataFromProperties(properties);
      //columnMetadata = ListView.setCustomComponent("date", FacilityDateOnlyDisplay, columnMetadata);
        columnMetadata = ListView.setCustomComponent("dateLocalUI", LocalDateDisplay, columnMetadata);
        this.state = {
            results: List(),
            columnMetadata: columnMetadata
        };
    }

    componentDidMount() {
        getAPIContext().getMetrics().then((metrics) => {
            this.setState({results: metrics});
        });
    }

    handleSubmit() {
        let date =  getRefInputValue(this.refs.date);
        return getAPIContext().computeMetrics(date).then(() => {
            this.componentDidMount();
        });
    }



      render() {
        let timeZoneDisplay = getAPIContext().facility.timeZoneDisplay;

        const {results, columnMetadata} = this.state;
        let columnsCursor  = this.props.appState.cursor(["preferences", "dailymetric", "table", "columns"]);
        let columnSortSpecsCursor = this.props.appState.cursor(["preferences", "dailymetric", "table", "sortSpecs"]);

        return (
            <div>
                <div>Facility TimeZone: {timeZoneDisplay}</div>

                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Input ref="date" name="date" label="Date" />
                    <SubmitButton label="Recompute" />
                </Form>
                <ListManagement

                    allowExport={true}
                    results={results}
                    keyColumn="date"
                    columns={columnsCursor}
                    columnMetadata={columnMetadata}
                    sortSpecs={columnSortSpecsCursor}/>
           </div>
        );
    }
};

class FacilityDateOnlyDisplay extends React.Component {
  render() {
    let utcOffset = getAPIContext().facility.utcOffset;
    let {cellData, rowData} = this.props;

    return (
      <DateDisplay cellData={cellData} utcOffset={utcOffset} granularity="date" />
    );
  }
}

class LocalDateDisplay extends React.Component {
  render() {
    let {cellData, rowData} = this.props;
    let data = (cellData && cellData.length > 0) ? cellData.substring(0,10) : "";
    return (
      <span>{data}</span>
    );
  }
}
