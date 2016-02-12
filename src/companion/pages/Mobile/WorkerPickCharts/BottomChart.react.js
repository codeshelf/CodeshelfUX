import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem, Badge} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import d3 from "d3";
import ReactFauxDOM from 'react-faux-dom';
import {TAB_PRODUCTIVITY} from '../WorkerDetail/store';
import {convertTab} from '../WorkerDetail/WorkerDetail.react.js';
import {Map, Record} from "immutable";
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';

export class BottomChart extends Component {

  printChart(node, bins, style) {
    const showBottomLables = this.props.desktop;
    const rangeTo = showBottomLables ? 10 : 0;
    const {height, width, margin} = style;
    const barWidth = width/bins.length;
    const xRange = d3.scale.linear()
        .domain([0, bins.length])
        .range([margin, width - margin])
    const yRange = d3.scale.linear().range([height - 2 * margin, rangeTo]).domain([ 0,
      d3.max(bins, (d) => d)
    ])
    const svg = d3.select(node)
      .attr("width", width)
      .attr("height", height + 10);

    let bar = svg.selectAll(".bottom-bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bottom-bar")
        .attr("transform", (d, i) => "translate(" + i * barWidth + "," + (yRange(d) + rangeTo) + ")")

    bar.append("rect")
          .attr("width", (width - 2 * margin)/bins.length)
          .attr("height", (d) => ((height -  2 * margin) - yRange(d)))
          .attr("fill", "grey");

    if (showBottomLables) {
      bar.append("text")
            .attr("dy", "0.75em")
            .attr("y", -15)
            .attr("x", barWidth/2)
            .attr("text-anchor", "middle")
            .text((d) => d !== 0 ? d : null);
    }

    return node;
  }


  render() {
    const {whatIsLoading, whatIsLoaded, filter, desktop} = this.props;
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      //return <div>{this.props.data && JSON.stringify(this.props.data[1])}</div>;
      const WorkerHistogramFilter = Record(Map(filter).set("id", null).toJS());
      return (
        <Panel header="Worker Picks">
          <WidthWrapper>{(width) => (
            <ListGroup>
              {
                this.props.data[1].map((oneWorkerData) => {
                  const workerId = oneWorkerData.worker.domainId;
                  const workerName = oneWorkerData.worker.name;
                  const eventBins = oneWorkerData.events.bins.map(({value}) => value);
                  const totalEvents = oneWorkerData.events.total;
                  const style = {
                    width: width-85,
                    height:20,
                    margin:0
                  };
                  const chart = this.printChart(ReactFauxDOM.createElement('svg'), eventBins, style);
                  const filterWithId = WorkerHistogramFilter(filter).set("id", workerId);
                  // temporarly disable links
                  return (
                      <div>
                      { desktop ?
                        <div>
                         <div style={{fontSize: "75%"}}>{workerName}</div>
                         <span style={{width: "4em" ,marginRight: "0.5em"}}>{totalEvents}</span>
                         {chart.toReact()}
                        </div> :
                        <ListGroupItemLink
                            to={`workers/${encodeURIComponent(workerId)}/productivity`}
                            onClick={() => this.props.acSetProductivityFilter(workerId, filterWithId)} >
                          <div style={{fontSize: "75%"}}>{workerName}</div>
                          <span style={{width: "4em" ,marginRight: "0.5em"}}>{totalEvents}</span>
                          {chart.toReact()}
                          <Icon name="chevron-right" className="pull-right" style={{marginTop: "-.25em"}}/>
                        </ListGroupItemLink> }
                      </div>
                  );
                })
              }
            </ListGroup>
          )}</WidthWrapper>
        </Panel>
      );
    }
  }
}
