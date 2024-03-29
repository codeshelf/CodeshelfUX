import {Component} from "react";
import moment from "moment";
import d3 from "d3";
import ReactFauxDOM from 'react-faux-dom';
import {connect} from 'react-redux';
import {getSelectedFacility} from '../../Facility/get';

require('./histogramChart.styl');

function printChart(node, expanded, limit, interval, utcOffset, data, style) {
  const duration = interval.asMilliseconds();
  const bins = (data.endTime - data.startTime) / duration;
  // Larger barSize if we show also day names, which is needed when
  // interval size is more than hour
  const barSize = interval.asMinutes() >= 60 ? 85: 60;
  const {height, margins} = style;
  const binCount = expanded ? bins: Math.min(bins, style.width/barSize);
  const barWidth = expanded ? style.barWidth :
                   (style.width - margins.left - margins.right)/bins;
  const width = expanded ? Math.max(style.width, bins * barWidth): style.width;

  /* Define ranges */
  let max = 0;
  const xRange = d3.scale.linear()
      .domain([0, bins])
      .range([margins.left, width - margins.right]);
  const yRange = d3.scale.linear()
                         .range([height - (margins.top + margins.bottom), 20])
                         .domain([0, d3.max(data.bins, (d) => {
                            max = Math.max(d.value === 0 ? d.value + 1 : d.value, max);
                            return d.value === 0 ? d.value + 1 : d.value;
                          })])

  let yGridValues = [0, max];
  if (max %2 == 0) {
    yGridValues = [0, max/2, max];
  } else {
    yGridValues = [0, Math.floor(max/2) +1, max];
  }
  /* Define axis */
  const xAxis = d3.svg.axis()
    .scale(xRange)
    .ticks(binCount)
    .tickSize(10)
    .tickPadding(5)
    .tickFormat((x) => {
      const time = moment.utc(data.startTime)
           .add((x)*(interval.asMinutes()) , "m")
           .add(utcOffset, "m")
      return interval.asMinutes() >= 60
      ?  time.format('dd HH:mm')
      :  time.format('HH:mm')
    });

  const yAxis = d3.svg.axis()
    .scale(yRange)
    .tickValues(yGridValues)
    .orient("left")
    .tickSubdivide(false)
    .tickFormat((d) => d);

  /* Create basic svg with specific dimensions */
  const svg = d3.select(node)
    .attr("width", width)
    .attr("height", height);

  /* Show horizontal grid */
  svg.selectAll("line.horizontalGrid")
     .data(yGridValues)
     .enter()
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
      .attr('transform', 'translate(0,' +
           (height - (margins.bottom + margins.top)) + ')')
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
      .attr("transform", (d) => "translate(" +
                                xRange((d.start - data.startTime)/duration) +
                                "," + yRange(d.value) + ")")

  bar.append("rect")
        .attr("width", barWidth)
        .attr("height", (d) => ((height - (margins.bottom + margins.top)) - yRange(d.value)))
        .attr('fill', 'steelblue');

  /* Add text over each bar with its value (except 0) */
  if (barWidth > 25) {
    bar.append("text")
              .attr("dy", ".75em")
              .attr("y", -15)
              .attr("x", barWidth/2)
              .attr("text-anchor", "middle")
              .text((d) => d.value !== 0 ? d.value : null);
  }

  return node;
}

class HistogramChartDummy extends Component {
  render() {
   const {chartStyle, pickRates, interval, utcOffset, expanded, limit} = this.props;
   const svg = printChart(ReactFauxDOM.createElement('svg'),
                          expanded, limit, interval, utcOffset,
                          pickRates, chartStyle);
   return (
      <div
        className={expanded ? "histogram": null}>
        {svg.toReact()}
      </div>
    );
  }
};

export const HistogramChart = connect(getSelectedFacility)(HistogramChartDummy);
