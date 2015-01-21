/** @jsx React.DOM */

var React = require("react");
var _ = require("lodash");
var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var DoughnutChart = require("./doughnut.jsx");
var ActiveRun = require("./activerun.jsx");

var segmentTemplates = [{key: "released",
                         color: "#CC78DE",
                         label: "Remaining",
                         value: 0},
                        {key: "short",
                         color: "#D3D3D3",
                         label: "Shorts",
                         value: 0},
                        {key: "inprogress",
                         color: "#7B0793",
                         label: "In Progress",
                         value: 0},
                        {key: "complete",
                         color: "#F1F1F1",
                         label: "Complete",
                         value: 0}];

var OrderDetailIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "pickRate": 0,
            "activeRuns": []
        };
    },
    render: function() {
        var groupName    = this.props.groupName;
        var orderDetailSummaryData  = this.props.orderDetailSummaryData;
        var shorts       = orderDetailSummaryData["short"];
        var total = orderDetailSummaryData["released"] + orderDetailSummaryData["inprogress"] + orderDetailSummaryData["complete"] + orderDetailSummaryData["short"];
        var remaining = total - (orderDetailSummaryData["complete"] + orderDetailSummaryData["short"]);
        var pickRate     = this.props.pickRate;
        var chartData = toChartData(segmentTemplates, orderDetailSummaryData);
        var activeRuns = this.props.activeRuns;
        var remainingDisplay = remaining + "/" + total;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        Order Group {groupName} Burn Down
                    </IBoxTitleText>
                  </IBoxTitleBar>
                <IBoxSection>

                    {{/* The first div provides the proper box dimensions for the chart resize calculations */}}
                    <div style={{position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <DoughnutChart chartData={chartData} />
                        <div style={{position: "absolute", top: 0, bottom: 0, left:0, right:0, display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center", pointerEvents: "none"}}>
                            <div style={{fontSize: "4vmax"}}>{remaining}</div>
                        </div>
                    </div>
                    <h1>Of {total} Items</h1>
                </IBoxSection>

                <IBoxSection className="shortSummary">
                    <IBoxData dataValue={shorts} dataLabelSingular="Short" dataLabel="Shorts" />
                </IBoxSection>
                <IBoxSection className="pickRate">
                    <IBoxData dataValue={Math.round(pickRate)} dataLabel="/ Hour" />
                </IBoxSection>
                <IBoxSection>
                    <IBoxTitleText>Active Runs</IBoxTitleText>
                </IBoxSection>
                    {
                        _.map(activeRuns, function(run) {
                            if (ActiveRun.isActive(run)) {
                                var id = ActiveRun.getId(run);
                                return (
                                        <IBoxSection key={id}>
                                            <ActiveRun key={id} run={run} />
                                        </IBoxSection>);
                            }
                            else {
                                return null;
                            }
                        })
                    }
               </IBox>);

        }
});

function toChartData(segmentTemplates, keyedValues) {
        var chartValues = _.map(segmentTemplates, function(segmentTemplate) {
                var key = segmentTemplate["key"];
                var data  = {value: keyedValues[key]};
                var chartSegment =  _.merge({}, segmentTemplate, data);
                return chartSegment;
        });
        return chartValues;
}

module.exports = OrderDetailIBox; //Exports the class
