import React, {Component, PropTypes} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup,
  ListGroupItem, Badge, DropdownButton, MenuItem} from 'react-bootstrap';
import Multiselect from 'react-bootstrap-multiselect';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import {HistogramChart} from './HistogramChart.react.js';
import {IBox} from '../../IBox.react.js';
import moment from 'moment';
import * as csapi from 'data/csapi';

import {DateDisplay} from "../../DateDisplay.react.js";

import "./TopChart.less";

export class DurationPicker extends Component {

  durations = [
    { interval: moment.duration(5, 'minutes'), window: moment.duration(2, 'hours')},
    { interval: moment.duration(15, 'minutes'), window:moment.duration(6, 'hours')},
    { interval: moment.duration(1, 'hours'), window: moment.duration(1, 'days')},
    { interval: moment.duration(6, 'hours'), window: moment.duration(6, 'days')},
  ];

  render() {
    const {filter, onChange} = this.props;
    return (
      <DropdownButton bsStyle="default" bsSize="small" title={`events per ${filter['interval'].humanize()} / ${filter['window'].humanize()}`}
        onSelect={(ev, dur) => {
          const newFilter = filter.merge(dur);
          onChange(newFilter);
        }}>
        {this.durations.map((d, index) => (
          <MenuItem key={index} eventKey={d}>{d['interval'].humanize() + " / " + d['window'].humanize()}</MenuItem>
        ))}
      </DropdownButton>
    );
  }
}

export class PurposePicker extends Component {

  preprocessData(purposes, selected) {
    return purposes.map((purpose) => { return {value: purpose, selected: selected.indexOf(purpose) !== -1}});
  }

  render()  {
    /* To be deleted */
    const mockedData = ['Purpose 1', 'Purpose 2', 'Purpose 3'];
    const {filter, onSelect, purposes} = this.props;
    const data = purposes.error || purposes.loading ? [] : this.preprocessData(mockedData, filter.purposes);
    return (
      <Multiselect
        multiple
        data={data}
        onChange={(selected, add) => {
          const value = selected[0].value;
          let purposes = this.props.filter.purposes.slice(0);
          if (add && purposes.indexOf(value) === -1) {
            purposes.push(value);
          } else {
            purposes = purposes.filter((element, i) => element !== value);
          }
          const newFilter =  this.props.filter.set('purposes', purposes);
          onSelect(newFilter);
        }} />
    );
  }
}


class ChartNavigation extends Component {

  changeEndTime(filter, momentMethod, e) {
    const {endtime, window} = filter;
    const newEndTime = moment(endtime)[momentMethod](window);
    this.props.onChange(filter.set('endtime', newEndTime));
  }

  render() {
    const {filter} = this.props;
    const margin = ".5em";
    return (
      <div>
        <div className="pull-left">
          <Button bsStyle="link" className="pull-left"  onClick={this.changeEndTime.bind(this, filter, 'subtract')}>
              <Icon name="step-backward" style={{marginRight: margin}}/>
              <DateDisplay date={moment(filter.endtime).subtract(filter.window)} />
          </Button>
        </div>
        <div className="pull-right">
          <Button bsStyle="link" bsSize="md" onClick={this.changeEndTime.bind(this, filter, 'add')}>
            <DateDisplay  date={filter.endtime.format()} />
            <Icon name="step-forward" style={{marginLeft: margin}}/>
          </Button>
        </div>
      </div>);
  }
}
ChartNavigation.propTypes = {
  filter: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export class TopChart extends Component {

  constructor(props) {
    super(props);
    this.state = {expanded: props.expanded};
  }

  componentWillMount() {
    this.props.acGetPurposes();
  }

  render() {
    const {purposes, filter, data, error, whatIsLoading, whatIsLoaded, acSetFilterAndRefresh, acSearch, id, tab} = this.props;
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
        <IBox data={filter} reloadFunction={acSetFilterAndRefresh} loading={showLoading}>
          <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
            <Col xs={6}>
              {title}
            </Col>
          </Row>
          <Row style={{paddingLeft: "1em", paddingRight: "1em"}}>
            <Col xs={10}>
              <div className="text-center">
                <DurationPicker filter={filter} onChange={acSetFilterAndRefresh} />
              </div>
            </Col>
            <Col xs={10}>
              <div className="text-center">
                <PurposePicker purposes={purposes} filter={filter} onSelect={acSetFilterAndRefresh} />
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
               const minHeight = Math.round(width/(1.618*2)); //designer-like
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
                            right: 40,
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
                <ChartNavigation filter={filter} onChange={acSetFilterAndRefresh} />
              </Col>
            </Row>
          </IBox>
      </div>
    );
  }
}
