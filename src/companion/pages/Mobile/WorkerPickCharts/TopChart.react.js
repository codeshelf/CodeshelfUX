import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup,
  ListGroupItem, Badge, DropdownButton, MenuItem} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import {HistogramChart} from './HistogramChart.react.js';
import moment from 'moment';

import * as csapi from 'data/csapi';

import {DateDisplay} from "../DateDisplay.react.js";

export class DurationPicker extends Component {

  render() {
    const {value, onChange, durations} = this.props;
    return (
      <DropdownButton bsStyle="default" bsSize="small" title={`events per ${value['interval'].humanize()} / ${value['window'].humanize()}`}
        onSelect={(ev, dur) => onChange(dur)}>
        {durations.map((d, index) => (
          <MenuItem key={index} eventKey={d}>{d['interval'].humanize() + " / " + d['window'].humanize()}</MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

const DURATIONS = [
  { interval: moment.duration(5, 'minutes'), window: moment.duration(2, 'hours')},
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

  constructor(props) {
    super(props);
    this.state = {expanded: false};
  }

  render() {
    const {filter, data, error, whatIsLoading, whatIsLoaded, acMoveGraphToLeft,
      acMoveGraphToRight, acSetFilterAndRefresh, acSearch, id, tab} = this.props;
    const durationPickerHandler = (dur) => {
      dur.id= id;
      acSetFilterAndRefresh(dur, id, tab);
    };

    const showLoading = (whatIsLoading !== null || (whatIsLoaded === null && !error));
    const showError = (whatIsLoading === null && !!error);
    let errorText = "Can't load request";
    if (error && (error instanceof csapi.ConnectionError || error.message)) {
      errorText = error.message;
    }
    const title = this.props.title && <h4>{this.props.title}</h4>;
    const lineHeight = (title) ? "53px" : null;
    return (
      <div>
        <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
          <Col xs={6}>
            {title}
          </Col>
          <Col xs={6} style={{lineHeight: lineHeight, verticalAlign:"middle", textAlign: "right"}}>
              <Button  bsStyle="primary"  bsSize="xs" onClick={()=> acSearch(tab, true)}>
                <Icon name="refresh" />
              </Button>
        </Col>
        </Row>
        <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
          <Col xs={10}>
            <div className="text-center">
            <DurationPicker value={filter} durations={DURATIONS} onChange={durationPickerHandler} />
            </div>
          </Col>
          <Col xs={2}>
            <Button bsStyle="link" className="pull-right" bsSize="sm" onClick={() => this.setState({expanded: !this.state.expanded})}>
              <Icon name={this.state.expanded ? "compress": "expand"} />
            </Button>
          </Col>
        </Row>
        <Row style={{paddingLeft: "1em", paddingRight: "1em" }}>
          <Col>
           <WidthWrapper>{(width) => {
             const minHeight = Math.round(width/2.5);
             if (showLoading || showError) {
               return (<div style={{minHeight: minHeight + 6}}>
                         {showLoading && <span><Icon name="spinner" spin/> Loading chart...</span>}
                         {showError && <span>Error: {errorText}</span>}
                       </div>);
             }
             else {
               return (
                   <HistogramChart
                      expanded={this.state.expanded}
                      limit={12}
                      interval={filter.interval}
                      pickRates={data}
                      chartStyle={{
                        height: minHeight,
                        width: width,
                        barWidth: 60,
                        margins: {
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 50,
                        },
                      }} />
                   );
             }
             }}</WidthWrapper>
            </Col>
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
