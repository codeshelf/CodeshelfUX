import React from "react";
import moment from "moment";
import d3 from "d3";
import ReactFauxDOM from 'react-faux-dom';
import {connect} from 'react-redux';
import {getSelectedFacility} from '../Facility/get';

require('./histogramChart.styl');

function printChart(node, interval, utcOffset, data, style) {
  const duration = interval.asMilliseconds();
  const bins = (data.endTime - data.startTime) / duration;

  const {height, width, margins} = style;
  const barWidth = width/bins;

  /* Define ranges */
  let max = 0;
  const xRange = d3.scale.linear()
      .domain([0, bins])
      .range([margins.left, width - margins.right])
  const yRange = d3.scale.linear().range([height - (margins.top + margins.bottom), 20]).domain([ 0,
    d3.max(data.bins, (d) => {
      max = Math.max(d.value === 0 ? d.value + 1 : d.value, max); 
      return d.value === 0 ? d.value + 1 : d.value;
    })
  ])

  /* Define axis */
  const xAxis = d3.svg.axis()
    .scale(xRange)
    .ticks(Math.min(bins, 12))
    .tickSize(10)
    .tickPadding(5)
    .tickFormat((x) => moment.utc(data.startTime).add((x)*(interval.asMinutes()) , "m").format('HH:mm'));

  const yAxis = d3.svg.axis()
    .scale(yRange)
    .ticks(max)
    .orient("left")
    .tickSubdivide(false)
    .tickFormat((d) => d);

  /* Create basic svg with specific dimensions */
  const svg = d3.select(node)
    .attr("width", width)
    .attr("height", height);

  /* Show horizontal grid */
  svg.selectAll("line.horizontalGrid").data(yRange.ticks(max)).enter()
      .append("line")
          .attr(
          {
              "class": "horizontalGrid",
              "x1" : margins.left,
              "x2" : width -  margins.right,
              "y1" : (d) => yRange(d),
              "y2" : (d) => yRange(d),
          });

  /* Create axis */
  svg.append("g")
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - (margins.bottom + margins.top)) + ')')
      .call(xAxis);

  svg.append("g")
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (margins.left) + ', 0)')
      .call(yAxis);

  /* Create bars */
  let bar = svg.selectAll(".bar")
      .data(data.bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", (d) => "translate(" + xRange((d.start - data.startTime)/duration) + "," + yRange(d.value) + ")")
      
  bar.append("rect")
        .attr("width", (width -  margins.right - margins.left)/bins)
        .attr("height", (d) => ((height - (margins.bottom + margins.top)) - yRange(d.value)))
        .attr('fill', 'steelblue');

  /* Add text over each bar with its value (except 0) */
  bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -15)
            .attr("x", barWidth/2)
            .attr("text-anchor", "middle")
            .text((d) => d.value !== 0 ? d.value : null);

  return node;
}

const PickRateChartDummy = React.createClass({
    render: function() {
     const {chartStyle, pickRates, interval, utcOffset} = this.props;
     const svg = printChart(ReactFauxDOM.createElement('svg'), interval, utcOffset, pickRates, chartStyle);
     return (<div className="d3">{svg.toReact()}</div>);
    },
});
export const PickRateChart = connect(getSelectedFacility)(PickRateChartDummy);
