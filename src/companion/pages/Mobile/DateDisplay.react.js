import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getSelectedFacility} from './Facility/store';

import DateDisplayWithOfset from "components/common/DateDisplay";

@connect(getSelectedFacility)
export class DateDisplay extends Component {
 render() {
   if (!this.props.utcOffset) return null;
   return (
     <DateDisplayWithOfset cellData={this.props.date}
                  utcOffset={this.props.utcOffset} />
   );
 }
}