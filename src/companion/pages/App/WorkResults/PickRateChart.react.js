var React = require("react");
var moment = require("moment");
var d3 = require("d3");
require("nvd3/build/nv.d3.min.css");
var nv = require("exports?nv!nvd3/build/nv.d3.min.js");

import {getFacilityContext} from 'data/csapi';

function updateChart(el, chart, data) {
    d3.select(el).select("svg")
        .datum(data)
//        .transition().duration(500)
        .call(chart);

    //nv.utils.windowResize(chart.update);

    return chart;
}


function chartSpec() {
            var chart = nv.models.multiBarChart()
                    .duration(50)
                    //.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
            ;


/*
            chart.xAxis.tickFormat(function(d) {
                return d3.time.format("%-I:%M%p")(moment.unix(d).toDate());
            });
*/                //.xScale(d3.time.scale()); // use a time scale instead of plain numbers in order to get nice round default values in the axi

            chart.xAxis.tickFormat((x) => x+":00");

            chart.yAxis
                .tickFormat(d3.format('d'));

/*
            //Axis settings
            var tickMultiFormat = d3.time.format.multi([
                ["%-I:%M%:%S%p", function(d) { return d.getSeconds(); }], // not the beginning of the hour
                ["%-I:%M%p", function(d) { return d.getMinutes(); }], // not the beginning of the hour
                ["%-I%p", function(d) { return d.getHours(); }], // not midnight
                ["%b %-d", function(d) { return d.getDate() != 1; }], // not the first of the month
                ["%b %-d", function(d) { return d.getMonth(); }], // not Jan 1st
                ["%Y", function() { return true; }]
            ]);
*/
/*
            chart.xAxis
            //    .showMaxMin(false)
            //.rotateLabels(-25) // Want longer labels? Try rotating them to fit easier.
                .tickPadding(10)
                .tickFormat(function (d) {
                    return tickMultiFormat(new Date(d));
                })
;

*/
       return chart;
}

function toD3Data(startTimestamp, endTimestamp, apiData) {
    var hoursOfOperation = _.range(
        moment(startTimestamp).hour(),
        moment(endTimestamp).hour()+1);

    var yProperty = "picks"; //or "quantity";
    return _.chain(apiData)
        .groupBy("workerId")
        .transform((result, workerHourlyRates, key) => {
            let transformed =  _.map(workerHourlyRates, (v) => {
                let utcHour = v.hour;
                let localHour = moment(startTimestamp).utc().hour(utcHour).local().hour();

                return {
                    key: v.workerId,
                    x: localHour,
                    y: v[yProperty],
                    quantity: v.quantity,
                    picks: v.picks
                };
            });

            let missingValues = _.chain(hoursOfOperation)
                .difference(_.pluck(transformed, "x"))
                .map((v) => {
                    return {
                        key: key,
                        x: v,
                        y: 0,
                        quantity: 0,
                        picks: 0
                    };
                }).value();

            let all = _.chain(transformed).concat(missingValues).sortBy("x").value();
            result[key] = {
                key: key,
                values: all
            };
        })
        .values()
        .value();
}

var PickRateChart = React.createClass({
    render: function() {
        return (<div className="nvd3"><svg style={this.props.style}></svg></div>);
    },
    componentDidMount: function() {
        this.updateViews(this.props, this.getDOMNode());
    },
    componentWillUnmount: function() {

    },
    componentWillUpdate: function(nextProps, nextState) {
        this.updateViews(nextProps, this.getDOMNode());
    },

    getPickRates: (startTimestamp, endTimestamp) => {
        return getFacilityContext().getPickRates(startTimestamp, endTimestamp);
    },

    updateViews: function(props, el) {
        var {startTimestamp, endTimestamp} = props;
        var chart = chartSpec();
        this.getPickRates(startTimestamp, endTimestamp).then((data) => {
            let d3Data = toD3Data(startTimestamp, endTimestamp, data);
            updateChart(el, chart, d3Data);
        });
    }
});
module.exports = PickRateChart;
