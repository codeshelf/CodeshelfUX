import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getSelectedFacility} from './Facility/get';

import DateDisplayWithOfset from "components/common/DateDisplay";

class DateDisplayDumm extends Component {
 render() {
   if (!this.props.utcOffset) return null;
   return (
     <DateDisplayWithOfset cellData={this.props.date}
                  utcOffset={this.props.utcOffset} />
   );
 }
}

function dateFormater(date) {
  return <DateDisplay date={date} />;
}

export const DateDisplay = connect(getSelectedFacility)(DateDisplayDumm);