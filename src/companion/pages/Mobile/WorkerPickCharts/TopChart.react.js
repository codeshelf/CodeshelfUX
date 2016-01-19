import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup,
  ListGroupItem, Badge, DropdownButton, MenuItem} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import {HistogramChart} from './HistogramChart.react.js';

import moment from 'moment';

import * as csapi from 'data/csapi';

import {data} from "./mockGetWorkerPickCharts";

import {DateDisplay} from "../DateDisplay.react.js";

export class DurationPicker extends Component {
  render() {
    const {value, onChange, durations, } = this.props;
    return (
      <DropdownButton bsStyle="default" bsSize="small" title={`events per ${value['interval'].humanize()} ${value['window'].humanize()}`}
        onSelect={(ev, dur) => onChange(dur)}>
        {durations.map((d, index) => (
          <MenuItem key={index} eventKey={d}>{d['interval'].humanize() + " " + d['window'].humanize()}</MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

const DURATIONS = [
  { interval: moment.duration(5, 'minutes'), window: moment.duration(1, 'hours')},
  { interval: moment.duration(15, 'minutes'), window:moment.duration(6, 'hours')},
  { interval: moment.duration(1, 'hours'), window: moment.duration(1, 'days')},
  { interval: moment.duration(6, 'hours'), window: moment.duration(6, 'days')},
];

class ChartNavigation extends Component {
  render() {
    const {filter, acMoveGraphToLeft, acMoveGraphToRight} = this.props;
    const margin = ".5em";
    return (
      <div>
        <div className="pull-left">
          <Button bsStyle="link" className="pull-left" bsSize="md" onClick={acMoveGraphToLeft}>
              <Icon name="step-backward" style={{marginRight: margin}}/>
              <DateDisplay date={moment(filter.endtime).subtract(filter.window)} />
          </Button>
        </div>
        <div className="pull-right">
          <Button bsStyle="link" bsSize="md" onClick={acMoveGraphToRight}>
            <DateDisplay  date={filter.endtime.format()} />
        <Icon name="step-forward" style={{marginLeft: margin}}/>
          </Button>
        </div>
      </div>);
  }
}

export class TopChart extends Component {
  render() {
    const {filter, error, expanded, whatIsLoading, whatIsLoaded, acMoveGraphToLeft,
      acMoveGraphToRight, acSetFilterAndRefresh, acSearch, acToggleExpand} = this.props;

    const showLoading = (whatIsLoading !== null || (whatIsLoaded === null && !error));
    const showError = (whatIsLoading === null && !!error);
    let errorText = "Can't load request";
    if (error && (error instanceof csapi.ConnectionError || error.message)) {
      errorText = error.message;
    }
    return (
      <div>
        <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
          <Col xs={6}>
            <h4 >Facility Picks</h4>
          </Col>
          <Col xs={6} style={{lineHeight: "53px", verticalAlign:"middle", textAlign: "right"}}>
              <Button  bsStyle="primary"  bsSize="xs" onClick={()=> acSearch(true)}>
                <Icon name="refresh" />
              </Button>
        </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center">
            <DurationPicker  value={filter} durations={DURATIONS} onChange={acSetFilterAndRefresh} />
            </div>
          </Col>
        </Row>
        {showLoading &&
          <div style={{minHeight:"200px"}}>
            Loading chart...
          </div>}
        {showError &&
          <Row>
            <Col xs={8}>
              Error: {errorText}
            </Col>
          </Row>
        }
        <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
          <Col>
            <Button bsStyle="link" className="pull-right" bsSize="sm" onClick={acToggleExpand}>
              <Icon name={expanded ? "compress": "expand"} />
            </Button>
          </Col>
        </Row>
        <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
        {!showLoading && !showError &&
          <WidthWrapper>{(width) =>
            <HistogramChart
              expanded={expanded}
              limit={12}
              interval={filter.interval}
              pickRates={this.props.data[0]}
              chartStyle={{
                height: width/2.5,
                width: width,
                barWidth: 60,
                margins: {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 50,
                },
              }} />
          }</WidthWrapper>}
          </Row>
          <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
            <Col>
              <ChartNavigation {...{filter, acMoveGraphToLeft, acMoveGraphToRight}} />
            </Col>
          </Row>
      </div>
    );
  }
}
