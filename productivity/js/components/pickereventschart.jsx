/** @jsx React.DOM */

var React = require("react");
require("script!bower_components/d3/d3.min.js");
require("style!css!bower_components/nvd3/build/nv.d3.min.css");
require("script!bower_components/nvd3/build/nv.d3.min.js");
//var d3 and nv are now global


var PickerEventsChart = React.createClass({
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
        var {apiContext, startTimestamp, endTimestamp} = props;
        this.pickerData(apiContext, startTimestamp, endTimestamp, function(data) {
            var groups = _.keys(data);
            var values = _.values(data);

            var chart = nv.models.scatterChart()
            //showDist, when true, will display those little distribution lines on the axis.
                    .showDistX(true)
                    .showDistY(true)
                    .color(d3.scale.category10().range());

            //Axis settings
            chart.xAxis
                .tickFormat(function(d) { return d3.time.format('%H:%M')(new Date(d));});
                //.axisLabel("Wed 11 Mar 2015"); //fixes misalignment of timescale with line graph
            chart.yAxis
                .tickFormat(function(d){
                    if (d == 0) return "";
                    if (d == groups.length + 1) return "";
                    return groups[d-1];
                });
            chart.forceY([0,groups.length+1]);
            chart.tooltipContent(function (key, x, y) {

            });

            d3.select(el.childNodes[0])
                .datum(values)
                .call(chart);
        });

    },
    pickerData: function(apiContext, startTimestamp, endTimestamp, callback) { //# groups,# points per group
        apiContext.getWorkResults(startTimestamp, endTimestamp).then(function(workResults){
            var groupedValues = {};
            var segment = 1;
            _.forEach(workResults, function(row){
                var groupName = row["pickerId"] ? row["pickerId"] : "Unknown";
                var groupData = groupedValues[groupName];
                if (groupData == null) {
                    groupData = {
                        key: groupName,
                        values: [],
                        segment: segment++
                    };
                    groupedValues[groupName] = groupData;
                }
                groupData.values.push({
                      x: row["completed"]
                    , y: groupData.segment
                    , size: row["actualQuantity"]
                    , status: row["status"]
                });

            }) ;
            callback(groupedValues);
        });
    }
});
module.exports = PickerEventsChart;
