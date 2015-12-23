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

import {getWorkerPickChartMutable} from "./get";
import {acSetDefaultFilter, acSetFilter, acSearch} from "./store";


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
    console.log("!!!! onResize", this.el.getDOMNode().offsetWidth);
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

  getTopChart() {
    if (this.props.whatIsLoading !== null) {
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

  getBotomChart() {
    if (this.props.whatIsLoading !== null) {
      return null;
    } else {
      return (
        <Panel header="Worker Breakdown">
          <WidthWrapper>{(width) =>
          <ListGroup>
            {
              this.props.data[1].map((d) => {
                  let sum = d.reduce((s, v) => s+v, 0);
                  return (
                    <ListGroupItemLink to="mobile-worker-datail" params={{id: "a"}}>
                      <span style={{marginRight: "0.5em"}}>{sum}</span>
                      <Sparklines data={d} limit={24} min={0} width={width-80} height={20} margin={0} >
                        <SparklinesBars />
                        <SparklinesReferenceLine type="custom" value={6.6}/>
                      </Sparklines>
                      <Icon name="chevron-right" className="pull-right" style={{marginTop: "0.5em"}}/>
                    </ListGroupItemLink>);
              })
            }
          </ListGroup>
          }</WidthWrapper>
        </Panel>
      );
    }
  }

  render() {
    // no filter means we are redering first time and dispached action so no render
    if (this.props.filter === null) return null;

    //Count/5m,  2 hrs to &lt;1m ago, Ref: 80/hr
    return (
      <div>
        <div><Icon name="caret-right" style={{marginRight: "0.5em"}}/><span>Count/5m,  2 hrs to &lt;1m ago, Ref: 80/hr</span><Icon name="refresh" className="pull-right"/></div>
        {/*<div>
        <div>Count per:
          <div className="radio radio-primary">
            {renderRadio("countper", "1m")}
            {renderLabel("1m")}
            {renderRadio("countper", "5m", "5m")}
            {renderLabel("5m")}
            {renderRadio("countper", "15m")}
            {renderLabel("15m")}
            {renderRadio("countper", "1h")}
            {renderLabel("1h")}
          </div>
        </div>
        <div>Time Span:
        <div className="radio radio-primary">
          {renderRadio("window", "1h")}
          {renderLabel("1h")}
          {renderRadio("window", "2h", "2h")}
          {renderLabel("2h")}
          {renderRadio("window", "4h")}
          {renderLabel("4h")}
          {renderRadio("window", "8h")}
          {renderLabel("8h")}
      </div>
        </div>
        <div> Ending: <input type="datetime" value="2015-12-03 07:00"/><a>Now</a></div>
        <div>Reference: <input type="number" defaultValue={80} style={{width: "2.5em"}}/> /hr</div>
        </div>
        */}
        {this.getTopChart()}
        {this.getBotomChart()}
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSetDefaultFilter, acSetFilter, acSearch}, dispatch);
}

export default connect(getWorkerPickChartMutable, mapDispatch)(WorkerPickCharts);
