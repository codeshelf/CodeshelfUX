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
var timeformat = require("helpers/timeformat");

var segmentTemplates = [{key: "released",
                         color: "#CC78DE",
                         label: "Remaining",
                         value: 0},
                        {key: "short",
                         color: "#7B0793",
                         label: "Shorts",
                         value: 0},
                        {key: "inprogress",
                         color: "#D3D3D3",
                         label: "In Progress",
                         value: 0},
                        {key: "complete",
                         color: "#F1F1F1",
                         label: "In Progress",
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
                    <IBoxTitleText>Order Group {groupName} Burn Down</IBoxTitleText>
                  </IBoxTitleBar>
                <IBoxSection>

                    {{/* The first div provides the proper box dimensions for the chart resize calculations */}}
                    <div style={{position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <DoughnutChart chartData={chartData} />
                        <div style={{position: "absolute", top: 0, bottom: 0, left:0, right:0, display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center"}}>
                            <div style={{fontSize: "6vmax"}}>{{remaining}}</div>
                        </div>
                    </div>
                    <div style={{marginTop: "2vmax", fontSize: "2vmax"}}>Of {{total}} Items</div>
                </IBoxSection>

                <IBoxSection className="shortSummary">
                    <IBoxData dataValue={shorts} dataLabel="Shorts" />
                </IBoxSection>
                <IBoxSection className="pickRate">
                    <IBoxData dataValue={Math.round(pickRate)} dataLabel="/ Hour" />
                </IBoxSection>
                <IBoxSection>
                    <IBoxTitleText>Active Runs</IBoxTitleText>
                </IBoxSection>
                    {
                        _.map(activeRuns, function(run) {
                            console.log("Rendering run", run);
                            var id = run['assignedTime'] + ":" + run['cheId'];;
                            var label = timeformat(run["assignedTime"]);
                            var numCompleted = run["completeCount"];
                            var numShorted = run["shortCount"];
                            var numNew = run["newCount"];
                            var total = numCompleted + numShorted + numNew;
                            var percentCompleted = (numCompleted/total * 100).toFixed(0);
                            var percentShorted = (numShorted/total * 100).toFixed(0);
                            var percentNew = (numNew/total * 100).toFixed(0);
                            return (
                                    <IBoxSection key={id}>
                                      <div style={{display: "table", width: "100%"}} >
                                         <div style={{display: "table-cell", width: 32, padding:10, whiteSpace: "nowrap"}}>{label}</div>
                                          <div className="progress burndown" style={{display: "table-cell"}}>
                                         <div className="progress-bar progress-bar-completed" role="progressbar" aria-valuenow={numCompleted} aria-valuemin="0" aria-valuemax="100" style={{width: percentCompleted+"%"}}>                                   <span className="sr-only">{percentCompleted+"%"} Complete</span>
                                         </div>
                                         <div className="progress-bar progress-bar-shorted" role="progressbar" aria-valuenow={numShorted} aria-valuemin="0" aria-valuemax="100" style={{width: percentShorted+"%"}}>                                         <span className="sr-only">{percentShorted+"%"} Complete</span>
                                         </div>
                                                             </div>
                                                           </div>
                                                           </IBoxSection>
                                                   );
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
