import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithOneItem} from "../../Detail/TabWithOneItem.react.js";
import {getWorkerDetailMutable} from '../get.js';

import {HistogramChart} from '../../WorkerPickCharts/HistogramChart.react.js';
import {TopChart} from '../../WorkerPickCharts/TopChart.react.js';
import {DurationPicker} from '../../WorkerPickCharts/TopChart.react.js';

import {acMoveGraphToLeft, acMoveGraphToRight} from '../store';
import moment from "moment";

export class ProductivityDump extends Component {
  render() {
    if (this.props.filter === null) return null;
    return (
      <TopChart {...this.props}
        data={this.props.data}
        title={"Worker Picks"}
      />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatch(dispatch) {
  return bindActionCreators({acMoveGraphToLeft, acMoveGraphToRight}, dispatch);
}

export const Productivity = connect(mapStateToProps, mapDispatch)(ProductivityDump);
