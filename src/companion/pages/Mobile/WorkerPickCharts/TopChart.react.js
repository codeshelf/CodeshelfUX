import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup,
  ListGroupItem, Badge, DropdownButton, MenuItem} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import PickRateChart from '../../App/WorkResults/PickRateChart.react.js';

import moment from 'moment';

import {data} from "./mockGetWorkerPickCharts";

export class DurationPicker extends Component {
  render() {
    const {value, onChange, durations} = this.props;
    return (
      <DropdownButton bsStyle="default" bsSize="small" title={value.humanize()}
        onSelect={(ev, dur) => onChange(dur)}>
        {durations.map((d, index) => (
          <MenuItem key={index} eventKey={d}>{d.humanize()}</MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

const INTERVAL_DURATIONS = [
  moment.duration(5, 'minutes'),
  moment.duration(15, 'minutes'),
  moment.duration(1, 'hours'),
];

const WINDOW_DURATIONS= [
  moment.duration(2, 'hours'),
  moment.duration(4, 'hours'),
  moment.duration(24, 'hours'),
  moment.duration(7, 'days')
]

export class TopChart extends Component {
  render() {
    const {filter, whatIsLoading, whatIsLoaded, acMoveGrahToLeft,
      acMoveGrahToRight, acSetFilterAndRefresh} = this.props;
    const isLoading = (whatIsLoading !== null || whatIsLoaded === null);

    //TODO Andrej remove after proper implementaion of d3 chart
    let interval = {
      start: 10, //moment().startOf('day'),
      end: 13//moment().endOf('day')
    };

    return (
      <div>
        <h4>Facility Picks</h4>
        <Row>
          <Button bsStyle="primary pull-left" bsSize="xs" onClick={acMoveGrahToLeft}>
            <Icon name="step-backward" />
          </Button>

          <DurationPicker bsStyle="pull-left" value={ filter.interval }
            durations={INTERVAL_DURATIONS} onChange={(d) => acSetFilterAndRefresh({interval: d})} />

          <DurationPicker bsStyle="pull-right" value={ filter.window }
            durations={WINDOW_DURATIONS} onChange={(d) => acSetFilterAndRefresh({window: d})} />

          <Button bsStyle="primary pull-right" bsSize="xs" onClick={acMoveGrahToRight}>
            <Icon name="step-forward" />
          </Button>
        </Row>
        <Row>
          <div>{moment(filter.endtime).subtract(filter.window).format()}</div>
          <div>{filter.endtime.format()}</div>
        </Row>
        {isLoading
        ? <div style={{minHeight:"200px"}}>
            Loading chart...
          </div>
        : <WidthWrapper>{(width) =>
            <PickRateChart style={{width: width, height: width/2.5}}
              startTimestamp={interval.start}
              endTimestamp={interval.end}
              pickRates={/*this.props.data[0]*/data}
              showControls={false}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}/>
          }</WidthWrapper>}
      </div>
    );
  }
}