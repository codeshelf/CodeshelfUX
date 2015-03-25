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

            chart
                .xScale(d3.time.scale()); // use a time scale instead of plain numbers in order to get nice round default values in the axis

            //Axis settings
            var tickMultiFormat = d3.time.format.multi([
                ["%-I:%M%:%S%p", function(d) { return d.getSeconds(); }], // not the beginning of the hour
                ["%-I:%M%p", function(d) { return d.getMinutes(); }], // not the beginning of the hour
                ["%-I%p", function(d) { return d.getHours(); }], // not midnight
                ["%b %-d", function(d) { return d.getDate() != 1; }], // not the first of the month
                ["%b %-d", function(d) { return d.getMonth(); }], // not Jan 1st
                ["%Y", function() { return true; }]
            ]);
            chart.xAxis
            //    .showMaxMin(false)
             //.rotateLabels(-25) // Want longer labels? Try rotating them to fit easier.
                .tickPadding(10)
                .tickFormat(function (d) {
                    return tickMultiFormat(new Date(d));
                })
            ;


  //          chart.xAxis
    //            .tickFormat(function(d) { return d3.time.format('%H:%M')(new Date(d));});
                //.axisLabel("Wed 11 Mar 2015"); //fixes misalignment of timescale with line graph
            chart.yAxis
                .tickFormat(function(d){
                    if (d == 0) return "";
                    if (d == groups.length + 1) return "";
                    return groups[d-1];
                });
            chart.forceY([0,groups.length+1]);
            chart.tooltipContent(function (key, x, y, e, data) {
                return _.template("<h3>${key}</h3>"
                                  +"<p>${x}</p>"
                                  + "<p>${status}</p>")(
                    {key: key,
                     x: d3.time.format("%x %-I:%M:%S%p")( new Date(data.point.x)),
                     status: data.point.status}
                );
            });
/*
            var tsFormat = d3.time.format('%b %-d, %Y %I:%M%p');
            var contentGenerator = chart.interactiveLayer.tooltip.contentGenerator();

            var tooltip = chart.interactiveLayer.tooltip;
            tooltip.contentGenerator(function (d) { d.value = d.series[0].data.x; return contentGenerator(d); });
            tooltip.headerFormatter(function (d) { return tsFormat(new Date(d)); });
*/
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
