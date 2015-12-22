import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem, Badge} from 'react-bootstrap';
import Icon from 'react-fa';
import PickRateChart from '../../App/WorkResults/PickRateChart.react.js';
import moment from 'moment';
import { Sparklines, SparklinesBars} from 'react-sparklines';

export class WorkerPickCharts extends Component {
  render() {
    let interval = {
      start: 10, //moment().startOf('day'),
      end: 13//moment().endOf('day')
    };

    let data = [{
      key: 'facility',
      values: [

        {key: 'facility', x: 1, y: 47},
        {key: 'facility', x: 2, y: 53},
        {key: 'facility', x: 3, y: 38},
        {key: 'facility', x: 4, y: 41},
        {key: 'facility', x: 5, y: 104},
        {key: 'facility', x: 6, y: 50},
        {key: 'facility', x: 7, y: 41},
        {key: 'facility', x: 8, y: 27},
        {key: 'facility', x: 9, y: 29},
        {key: 'facility', x: 10, y: 55},
        {key: 'facility', x: 11, y: 34},
        {key: 'facility', x: 12, y: 10},
        {key: 'facility', x: 13, y: 12},
        {key: 'facility', x: 14, y: 21},
        {key: 'facility', x: 15, y: 24},
        {key: 'facility', x: 16, y: 9},
        {key: 'facility', x: 17, y: 21},
        {key: 'facility', x: 18, y: 13},
        {key: 'facility', x: 19, y: 17},
        {key: 'facility', x: 20, y: 12},
        {key: 'facility', x: 21, y: 8},
        {key: 'facility', x: 22, y: 7},
        {key: 'facility', x: 23, y: 10},
        {key: 'facility', x: 24, y: 7}]
    }];

    let workerData =[
      [7, 8, 23, 0, 24, 0, 0, 2, 3, 3, 2, 3, 5, 2, 1, 0, 0, 0, 0, 0, 1, 7, 7, 2], //016
      [0, 0, 0, 0, 0, 6, 1, 11, 4, 5, 0, 0, 4, 10, 5, 6, 13, 9, 13, 6, 3, 0, 0, 0], //023
      [8, 14, 6, 11, 19, 4, 11, 0, 3, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //218
      [16, 14, 0, 3, 17, 12, 11, 0, 0, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //231
      [0, 0, 8, 5, 10, 0, 3, 7, 5, 1, 6, 2, 3, 7, 17, 3, 5, 1, 0, 0, 0, 0, 3, 5], //030
      [0, 0, 0, 1, 23, 19, 8, 0, 7, 17, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //242
      [0, 3, 1, 5, 2, 2, 0, 7, 7, 3, 6, 5, 0, 0, 0, 0, 0, 2, 4, 6, 4, 0, 0, 0], //331//
      [0, 0, 0, 6, 2, 7, 7, 0, 0, 0, 0, 0, 0, 2, 1, 0, 3, 1, 0, 0, 0, 0, 0, 0], //315//
      [0, 0, 0, 10, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //243//
      [2, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //020
      [14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //128


    ];

    return (
      <div>
        <div>Interval: 5m, Last: 2h,  Ending: Now <Icon name="refresh" className="pull-right"/></div>
        <Panel header="Facility Picks">
        <PickRateChart style={{width: '100%', height: '150px'}}
         startTimestamp={interval.start}
         endTimestamp={interval.end}
         pickRates={data}
         showControls={false}
         showLegend={false}
         showXAxis={true}
         showYAxis={true}/>
        </Panel>
        <Panel header="Worker Breakdown">
        <ListGroup>
          {
            workerData.map((d) => {
                let sum = d.reduce((s, v) => s+v, 0);
                return (
                  <ListGroupItemLink to="mobile-worker-datail" params={{id: "a"}}>
                    <span style={{marginRight: "0.5em"}}>{sum}</span>
                    <Sparklines data={d} limit={24} min={0} width={350} height={20} margin={0} >
                      <SparklinesBars />
                    </Sparklines>
                    <Icon name="chevron-right" className="pull-right" style={{marginTop: "0.5em"}}/>
                  </ListGroupItemLink>);
            })
          }
        </ListGroup>

      </Panel>
      </div>
    );
  }
}


export default WorkerPickCharts;
