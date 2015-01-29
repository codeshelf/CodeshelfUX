/** @jsx React.DOM */

var React = require("react");
var _ = require("lodash");
var DoughnutChart = require("./doughnut.jsx");
var pluralize = require("../helpers/pluralize");

//Clockwise order
var segmentTemplates = [{key: "released",
                         color: "#CC78DE",
                         label: "Remaining",
                         value: 0},
                        {key: "inprogress",
                         color: "#7B0793",
                         label: "In Progress",
                         value: 0},
                        {key: "short",
                         color: "#D3D3D3",
                         label: "Short",
                         value: 0},
                        {key: "complete",
                         color: "#F1F1F1",
                         label: "Complete",
                         value: 1}]; //to draw something

var DoughnutSummary = React.createClass({

    getDefaultProps: function() {
        return {
            "summaryData": {},
            "totalLabel": "",
            "totalLabelSingular": ""
        };
    },

    render: function() {
        var summaryData  = this.props.summaryData;
        var totalLabel = pluralize(total, this.props.totalLabelSingular, this.props.totalLabel);
        var chartData = toChartData(segmentTemplates, summaryData);
        var total = sumByKeys(summaryData, ["released", "inprogress", "complete", "short"]);
        var remaining = total - sumByKeys(summaryData, ["complete", "short"]);
        return (<div>

                    {{/* The first div provides the proper box dimensions for the chart resize calculations */}}
                    <div style={{position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <DoughnutChart chartData={chartData} />
                        <div style={{position: "absolute", top: 0, bottom: 0, left:0, right:0, display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center", pointerEvents: "none"}}>
                            <div style={{fontSize: "4vmax"}}>{remaining}</div>
                        </div>
                    </div>
                    <h1>Of {total} {totalLabel}</h1>
                </div>);

   }
});

function sumByKeys(summaryData, keys) {
    return _.reduce(keys, function(sum, key){
        return sum + summaryData[key];
    }, 0);
}

function toChartData(segmentTemplates, keyedValues) {
        var chartValues = _.map(segmentTemplates, function(segmentTemplate) {
                var key = segmentTemplate["key"];
                var data  = {value: keyedValues[key]};
                var chartSegment =  _.merge({}, segmentTemplate, data);
                return chartSegment;
        });
        return chartValues;
}

module.exports = DoughnutSummary; //Exports the class
