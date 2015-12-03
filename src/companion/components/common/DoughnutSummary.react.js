import React from "react";
import _ from "lodash";
var {StatusSummary} = require("data/types");
import DoughnutChart from "./Doughnut";
import pluralize from "lib/pluralize";

var DoughnutSummary = React.createClass({

    getDefaultProps: function() {
        return {
            "summaryData": {},
            "totalLabel": "",
            "totalLabelSingular": ""
        };
    },

    render: function() {
        var summaryData = this.props.summaryData;
        var totalLabel = pluralize(total, this.props.totalLabelSingular, this.props.totalLabel);
        var total = StatusSummary.sumByKeys(summaryData, ["released", "inprogress", "complete", "short"]);
        if (total > 0) {
           return this.renderSummaryChart(summaryData, total, totalLabel);
        } else {
            return (<h1>{total} {totalLabel}</h1>);

        }
   },

   renderSummaryChart : function(summaryData, total, totalLabel) {
       var chartData = toChartData(StatusSummary.Templates, summaryData);
       var remaining = total - StatusSummary.sumByKeys(summaryData, ["complete", "short"]);
       return (<div>
                    {{/* The first div provides the proper box dimensions for the chart resize calculations */}}
                    <div style={{position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <DoughnutChart chartData={chartData} />
                        <div style={{position: "absolute", top: 0, bottom: 0, left:0, right:0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pointerEvents: "none"}}>
                            <div style={{fontSize: "4vmax"}}>{remaining}</div>
                        </div>
                    </div>
                    <h1>Of {total} {totalLabel}</h1>
                </div>);

   }
});

function toChartData(segmentTemplates, keyedValues) {
        var chartValues = _.map(segmentTemplates, function(segmentTemplate) {
                var key = segmentTemplate.key;
                var data = {value: keyedValues[key]};
                var chartSegment = _.merge({}, segmentTemplate, data);
                return chartSegment;
        });
        return chartValues;
}

module.exports = DoughnutSummary; //Exports the class
