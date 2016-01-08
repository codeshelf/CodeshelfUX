import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem, Badge} from 'react-bootstrap';
import Icon from 'react-fa';
import PickRateChart from '../../App/WorkResults/PickRateChart.react.js';
import moment from 'moment';

import { Sparklines, SparklinesBars, SparklinesReferenceLine} from 'react-sparklines';

import {TimeFromNow} from "../DateDisplay.react.js";

import {getWorkerPickChartMutable} from "./get";
import {acSetDefaultFilter, acSetFilter, acSearch, acOpenFilter,
 acCloseFilter, acRefresh, acSetFilterCloseAndRefresh,
 acMoveGrahToRight, acMoveGrahToLeft} from "./store";


import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom'

class WidthWrapper extends Component {
  constructor() {
    super();
    this.state = {
      width: null,
    }
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    //TODO react 0.14+ remove getDOMNode() from chain ref will contain DOM element
    this.setState({width: this.el.getDOMNode().offsetWidth});
  }

  render() {
    if (this.state.width === null) {
      return (
        <div ref={(el) => this.el = el}>
          <div style={{width: "1px", height: "1px"}} />
        </div>
      );
    } else {
      return (
        <div ref={(el) => this.el = el}>
          {this.props.children(this.state.width)}
        </div>
      );
    }
  }
}



function renderRadio(name, v, value) {
  return <input type="radio" value={v} name={name} id={v} defaultChecked={v === value}/>
}
function renderLabel(v) {
  return    <label for={v}>{v}</label>
}

class WorkerPickCharts extends Component {

  componentWillMount() {
    const {filter} = this.props;
    if (filter === null) {
      this.props.acSetDefaultFilter();
    }
  }

  renderTopChart({whatIsLoading, whatIsLoaded, acMoveGrahToLeft, acMoveGrahToRight}) {
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return (
        <div>
          Loading charts...
        </div>
      );
    } else {
      let interval = {
        start: 10, //moment().startOf('day'),
        end: 13//moment().endOf('day')
      };
      return (
        <div>
          <h4>Facility Picks</h4>
          <Row>
            <Button bsStyle="primary pull-left" bsSize="xs" onClick={acMoveGrahToLeft}>
              Previous
            </Button>
            <Button bsStyle="primary  pull-right" bsSize="xs" onClick={acMoveGrahToRight}>
              Next
            </Button>
          </Row>
          <WidthWrapper>{(width) =>
            <PickRateChart style={{width: width, height: width/2.5}}
              startTimestamp={interval.start}
              endTimestamp={interval.end}
              pickRates={this.props.data[0]}
              showControls={false}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}/>
          }</WidthWrapper>
        </div>
      );
    }
  }

  renderBottomChart({whatIsLoading, whatIsLoaded}) {
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      return (
        <Panel header="Worker Picks">
          <span className="h6">Totals - Reference Line: 80/hr</span>
          <WidthWrapper>{(width) => (
            <ListGroup>
              {
                this.props.data[1].map((oneWorkerData) => {
                  const workerId = oneWorkerData.worker.domainId;
                  const eventBins = oneWorkerData.events.bins.map(({value}) => value);
                  const totalEvents = oneWorkerData.events.total;
                  return (
                    <ListGroupItemLink to="mobile-worker-datail" params={{id: workerId}}>
                      <span style={{marginRight: "0.5em"}}>{totalEvents}</span>
                      <Sparklines data={eventBins} limit={24} min={0} width={width-80} height={20} margin={0} >
                        <SparklinesBars />
                        <SparklinesReferenceLine type="custom" value={6.6}/>
                      </Sparklines>
                      <Icon name="chevron-right" className="pull-right" style={{marginTop: "0.5em"}}/>
                    </ListGroupItemLink>
                  );
                })
              }
            </ListGroup>
          )}</WidthWrapper>
        </Panel>
      );
    }
  }

  renderSettings({filterOpen, filter, loadedTime, acOpenFilter, acCloseFilter,
      acSearch, acRefresh, acSetFilter, acSetFilterCloseAndRefresh}) {
    return (
      <Row>
        <Col xs={2}>
          <div className="thumbnail-wrapper d32 circular bg-primary text-white inline" onClick={filterOpen? acCloseFilter: acOpenFilter}>
              <Icon name={filterOpen? "chevron-up" : "chevron-down"}/>
          </div>
        </Col>
        <Col xs={8}>
          {(!filterOpen)
            ?<span>
              Count/{filter.interval.asMinutes()}m,  {filter.window.asHours()} hrs
               to <TimeFromNow time={filter.endtime}/>
            , Ref: 80/hr</span>
            :null
          }
          {filterOpen
          ? <div>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(5, 'minutes'),
                window: moment.duration(2, 'hours'),
              })}>5 minutes - 2 hours</Button>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(15, 'minutes'),
                window: moment.duration(4, 'hours'),
              })}>15 minutes - 4 hours</Button>
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFilterCloseAndRefresh({
                interval: moment.duration(1, 'hours'),
                window: moment.duration(24, 'hours'),
              })}>1 hour - 24 hours</Button>
            </div>
          : null
          }
        </Col>
        <Col xs={2}>
          <Button bsStyle="primary" bsSize="xs" onClick={acRefresh}>Now</Button>
          {" "}
          <Button bsStyle="primary" bsSize="xs" onClick={() => acSearch(true)}><Icon name="refresh" /></Button>
        </Col>
      </Row>
    );
  }

  render() {
    // no filter means we are redering first time and dispached action so no render
    if (this.props.filter === null) return null;

    return (
      <div>
        {this.renderSettings(this.props)}
        {this.renderTopChart(this.props)}
        {this.renderBottomChart(this.props)}
        {/*this.props.data && JSON.stringify(this.props.data[1])*/}
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSetDefaultFilter, acSetFilter, acSearch,
   acOpenFilter, acCloseFilter, acRefresh, acSetFilterCloseAndRefresh,
   acMoveGrahToLeft, acMoveGrahToRight}, dispatch);
}

export default connect(getWorkerPickChartMutable, mapDispatch)(WorkerPickCharts);
