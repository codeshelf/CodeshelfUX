import  React from "react";
import ListManagement from "components/common/list/ListManagement";
import ListView from "components/common/list/ListView";
import {Form, SubmitButton, Input, getRefInputValue} from "components/common/Form";
import DateDisplay from "components/common/DateDisplay";
import {getAPIContext} from "data/csapi";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getDailyMetricsMutable} from './get';
import {acLoadMetrics} from './store';

class DailyMetrics extends React.Component{

    constructor(props) {
        super(props);
        this.columnMetadata = ListView.toColumnMetadata([
          {'columnName': 'dateLocalUI', displayName: 'Date'},
          {'columnName': 'ordersPicked', 'displayName': 'Orders Picked'},
          {'columnName': 'linesPicked', 'displayName': 'Lines Picked'},
          {'columnName': 'linesPickedEach', 'displayName': 'Lines Picked Each'},
          {'columnName': 'linesPickedCase', 'displayName': 'Lines Picked Case'},
          {'columnName': 'linesPickedOther', 'displayName': 'Lines Picked Other'},
          {'columnName': 'countPicked', 'displayName': 'Count Picked'},
          {'columnName': 'countPickedEach', 'displayName': 'Count Picked Each'},
          {'columnName': 'countPickedCase', 'displayName': 'Count Picked Case'},
          {'columnName': 'countPickedOther', 'displayName': 'Count Picked Other'},
          {'columnName': 'houseKeeping', 'displayName': 'Housekeeping'},
          {'columnName': 'putWallPuts', 'displayName': 'Putwall Puts'},
          {'columnName': 'skuWallPuts', 'displayName': 'Skuwall Puts'},
          {'columnName': 'palletizerPuts', 'displayName': 'Palletizer Puts'},
          {'columnName': 'replenishPuts', 'displayName': 'Replenish Puts'},
          {'columnName': 'skipScanEvents', 'displayName': 'Skipscan Event'},
          {'columnName': 'shortEvents', 'displayName': 'Short Event'},
        ])
    }

    componentWillMount() {
        this.props.acLoadMetrics();
    }

    handleSubmit() {
        const date =  getRefInputValue(this.refs.date);
        return getAPIContext().computeMetrics(date).then(() => {
            this.componentWillMount();
        });
    }

      render() {
        const timeZoneDisplay = this.props.facility.selected.selectedFacility.timeZoneDisplay;
        return (
            <div>
                <div>Facility TimeZone: {timeZoneDisplay}</div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Input ref="date" name="date" label="Date" />
                    <SubmitButton label="Recompute" />
                </Form>
                <ListManagement
                    allowExport={true}
                    results={this.props.dailyMetrics.items.get('data')}
                    keyColumn="date"
                    storeName={"dailymetric"}
                    columnMetadata={this.columnMetadata}/>
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

function mapDispatch(dispatch) {
  return bindActionCreators({acLoadMetrics}, dispatch);
}

function mapStateToProps(state){
    return {
        dailyMetrics: state.dailyMetrics,
        facility: state.facility,
    }
}

export default connect(mapStateToProps, mapDispatch)(DailyMetrics);
