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

export function dateFormater(date) {
  return <DateDisplay date={date} />;
}

export class TimeFromNow extends Component {

  componentDidMount() {
    // refresh every few second
    this.timer = setInterval(() => {
      this.setState({});
    }, 15000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    if (!this.props.time) return null;
    return <span>{this.props.time.fromNow().toString()}</span>
    // for debug purpouse render this
    //return <span>{this.props.time.fromNow().toString()} - {this.props.time.format()}</span>
  }
}

export const DateDisplay = connect(getSelectedFacility)(DateDisplayDumm);