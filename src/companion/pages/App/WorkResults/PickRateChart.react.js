var React = require("react");
var moment = require("moment");
var d3 = require("d3");
require("nvd3/build/nv.d3.min.css");
var nv = require("exports?nv!nvd3/build/nv.d3");


import {getFacilityContext} from 'data/csapi';

var PickRateChart = React.createClass({
    render: function() {
        return (<div className="nvd3"><svg style={this.props.style}></svg></div>);
    },
    componentDidMount: function() {
        var el = this.getDOMNode();
        this.updateViews(this.props, el);
    },
    componentWillUnmount: function() {

    },
    componentWillUpdate: function(prevProps, prevState) {
        var el = this.getDOMNode();
        this.updateViews(this.props, el);
    },
    updateViews: function(props, el) {
        var {startTimestamp, endTimestamp} = props;
        var apiContext = getFacilityContext();
        this.pickerData(apiContext, startTimestamp, endTimestamp, function(data) {
            var values = _.values(data);

            var chart = nv.models.multiBarChart()
                    //.transitionDuration(350)
                    //.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
            ;



            chart.xAxis.tickFormat(function(d) {
                return d3.time.format("%-I:%M%p")(moment.unix(d).toDate());
            });
                //.xScale(d3.time.scale()); // use a time scale instead of plain numbers in order to get nice round default values in the axi
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
            d3.select(el).select("svg")
                .datum(values)
                .transition().duration(500)
                .call(chart);

            //nv.utils.windowResize(chart.update);

            return chart;
        });

    },
    pickerData: function(apiContext, startTimestamp, endTimestamp, callback) {
        var groupedValues = {};
        var hoursOfOperation = _.range(6, 18);
        var startOfDay = moment("2015-03-11").startOf('day');
//        var atEight = startOfDay.clone().add(8, 'hour');

        d3.csv("/js/data/pickcountsHourOnHour.csv", function(data) {
            _.forEach(data, function(row){
                var groupName = row["pickerId"] != '' ? row["pickerId"] : "Unknown";
                var groupData = groupedValues[groupName];
                if (groupData == null) {
                    groupData = {
                        key: groupName,
                        values: []
                    };
                    groupedValues[groupName] = groupData;
                }

                var x = row["hour"];
                var y = parseInt(row["pickCount"]);
                groupData.values.push({
                      x: x
                    , y: y
                    , size: row["actualQuantity"]
                    , actualQuantity: row["actualQuantity"]
                });
            });

            _.keys(groupedValues).forEach(function(key){
                var values = groupedValues[key].values;
                var hourOfDayXValues = _.chain(values)
                        .pluck('x')
                        .map(function(x){ return moment.unix(x).hour();}).value();
                var missingHours = _.difference(hoursOfOperation, hourOfDayXValues);
                var missingValues  = _.map(missingHours, function(hour) {
                    return {
                        x: startOfDay.clone().add(hour, 'hour').unix(),
                        y: 0,
                        size: 0,
                        actualQuantity: 0

                    };
                });
                values.push.apply(values, missingValues);
                groupedValues[key].values = _.sortByAll(values, ["x"]);
            });


            callback(groupedValues);
        });
    }
/*
        groupedValues = {
            "Bart" : {
                key: "Bart",
                values: [
                    {
                        x: atEight.valueOf(),
                        y: 100,
                        size: 4
                    },
                    {
                        x: atEight.clone().add(2, 'hour').valueOf(),
                        y: 45,
                        size: 2
                    }

                ]
            },
            "Lisa" : {
                key: "Lisa",
                values: [
                    {
                        x: atEight.valueOf(),
                        y: 80,
                        size: 4
                    },
                    {
                        x: atEight.clone().add(3, 'hour').valueOf(),
                        y: 65,
                        size: 2
                    }

                ]

            }
        };*/

});
module.exports = PickRateChart;
