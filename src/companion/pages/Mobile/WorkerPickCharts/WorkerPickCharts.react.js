import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getWorkerPickChartMutable} from "./get";
import {acSetDefaultFilter, acSetFilter, acSearch, acRefresh,
 acMoveGrahToRight, acMoveGrahToLeft, acSetFilterAndRefresh} from "./store";


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

    return (
      <div>
        <TopChart {...this.props} />
        <BottomChart {...this.props} />
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSetDefaultFilter, acSetFilter, acSearch,
   acRefresh, acMoveGrahToLeft, acMoveGrahToRight, acSetFilterAndRefresh}, dispatch);
}

export default connect(getWorkerPickChartMutable, mapDispatch)(WorkerPickCharts);
