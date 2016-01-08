import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup,
  ListGroupItem, Badge, DropdownButton, MenuItem} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import {PickRateChart} from './tmpPickRateChart.react.js';

import moment from 'moment';

import * as csapi from 'data/csapi';

import {data} from "./mockGetWorkerPickCharts";

import {DateDisplay} from "../DateDisplay.react.js";

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
    const {filter, error, whatIsLoading, whatIsLoaded, acMoveGrahToLeft,
      acMoveGrahToRight, acSetFilterAndRefresh, acSearch} = this.props;

    const showLoading = (whatIsLoading !== null || (whatIsLoaded === null && !error));
    const showError = (whatIsLoading === null && !!error);
    let errorText = "Can't load request";
    if (error && (error instanceof csapi.ConnectionError || error.message)) {
      errorText = error.message;
    }
    //console.log(`!!!!!!!!!!!!!!!!!!!! ${showLoading} ${showError}`)
    //console.log(`!!!!!!!!!!!!!!!!!!!! ${whatIsLoading !== null} ${showError}`)
    //TODO Andrej remove after proper implementaion of d3 chart
    let interval = {
      start: 10, //moment().startOf('day'),
      end: 13//moment().endOf('day')
    };

    //TODO delete after we have better component for showing data
    function formatData(data) {
      let res = [{
        key: 'facility',
        values: data.bins.map((el, index) => ({
          key: "facility",
          x: index,
          y: el.value,
        }))
      }];
      console.log("new Data !!!!!!!!!!!!!!!", res);
      return res;
    }

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
        <Row style={{"padding-left": "10px"}}>
          <div><DateDisplay date={moment(filter.endtime).subtract(filter.window)} /></div>
          <div><DateDisplay date={filter.endtime.format()} /></div>
        </Row>
        {showLoading &&
          <div style={{minHeight:"200px"}}>
            Loading chart...
          </div>}
        {showError &&
          <Row>
            <Col xs={8}>
              Error: {text}
            </Col>
            <Col xs={4}>
              <Button bsStyle="primary" bsSize="xs" onClick={()=> acSearch(true)}><Icon name="refresh" /></Button>
            </Col>
          </Row>
        }
        {!showLoading && !showError &&
          <WidthWrapper>{(width) =>
            <PickRateChart style={{width: width, height: width/2.5}}
              startTime={this.props.data[0].startTime}
              interval={filter.interval}
              startTimestamp={interval.start}
              endTimestamp={interval.end}
              pickRates={/*this.props.data[0]  data*/formatData(this.props.data[0])}
              showControls={false}
              showLegend={false}
              showXAxis={true}
              showYAxis={true} />
          }</WidthWrapper>}
      </div>
    );
  }
}