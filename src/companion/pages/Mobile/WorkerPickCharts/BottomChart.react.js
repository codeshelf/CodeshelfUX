import React, {Component} from 'react';
import {Panel, Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem, Badge} from 'react-bootstrap';
import Icon from 'react-fa';
import {WidthWrapper} from "./WidthWrapper.react.js";
import d3 from "d3";
import ReactFauxDOM from 'react-faux-dom';

import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';

export class BottomChart extends Component {

  printChart(node, bins, style) {
    const {height, width, margin} = style;
    const barWidth = width/bins.length;
    const xRange = d3.scale.linear()
        .domain([0, bins.length])
        .range([margin, width - margin])
    const yRange = d3.scale.linear().range([height - 2 * margin, 0]).domain([ 0,
      d3.max(bins, (d) => d)
    ])

    const svg = d3.select(node)
      .attr("width", width)
      .attr("height", height);

    let bar = svg.selectAll(".bottom-bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bottom-bar")
        .attr("transform", (d, i) => "translate(" + i * barWidth + "," + yRange(d) + ")")

    bar.append("rect")
          .attr("width", (width - 2 * margin)/bins.length)
          .attr("height", (d) => ((height -  2 * margin) - yRange(d)))
          .attr("fill", "grey");

    return node;
  }


  render() {
    const {whatIsLoading, whatIsLoaded} = this.props;
    if (whatIsLoading !== null || whatIsLoaded === null) {
      return null;
    } else {
      //return <div>{this.props.data && JSON.stringify(this.props.data[1])}</div>;
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
                  return (
                    <ListGroupItemLink to="mobile-worker-datail" params={{id: encodeURIComponent(workerId)}}>
                      <div style={{fontSize: "75%"}}>{workerName}</div>
                      <span style={{width: "4em" ,marginRight: "0.5em"}}>{totalEvents}</span>
                      {chart.toReact()}
                      <Icon name="chevron-right" className="pull-right" style={{marginTop: "-.25em"}}/>
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
}
