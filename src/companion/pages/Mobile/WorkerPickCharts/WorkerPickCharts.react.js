import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IBox} from '../../IBox.react.js';
import {getWorkerPickChartMutable} from "./get";
import {acSetDefaultFilter, acSetFilter, acSearch, acRefresh, acGetPurposes, acSetFilterAndRefresh, acToggleView} from "./store";
import {acSetProductivityFilter} from "../../Detail/WorkerDetail/store";

import {TopChart} from "./TopChart";
import {BottomChart} from "./BottomChart";

class WorkerPickCharts extends Component {

  componentWillMount() {
    const {filter} = this.props;
    if (filter === null) {
      this.props.acSetDefaultFilter();
    }
  }

  render() {
    // no filter means we are redering first time and dispached action
    // to set default filter so no render
    if (this.props.filter === null) return null;
    const {filter, acSetFilterAndRefresh, whatIsLoaded, whatIsLoading, error} = this.props;
    const showLoading = (whatIsLoading !== null || (whatIsLoaded === null && !error));
    return (
        <IBox data={filter}
              reloadFunction={acSetFilterAndRefresh}
              loading={showLoading} >
          <TopChart {...this.props} data={this.props.data && this.props.data[0]}
                                    title={"Facility Picks"}
                                    expanded={this.props.expand}/>
        <BottomChart {...this.props} />
      </IBox>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSetDefaultFilter, acSetFilter, acSearch, acRefresh,
                             acSetProductivityFilter, acGetPurposes, acSetFilterAndRefresh, acToggleView}, dispatch);
}

export default connect(getWorkerPickChartMutable, mapDispatch)(WorkerPickCharts);
