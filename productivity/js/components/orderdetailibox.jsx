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
        render: function() {
                var groupName    = this.props.groupName;
                var orderDetailSummaryData  = this.props.orderDetailSummaryData;
                var shorts       = orderDetailSummaryData["short"];
                var remaining       = orderDetailSummaryData["released"];
                var total = orderDetailSummaryData["released"] + orderDetailSummaryData["inprogress"] + orderDetailSummaryData["complete"] + orderDetailSummaryData["short"];
                var pickRate     = (this.props.pickRate ? this.props.pickRate : 0);
                var chartData = toChartData(segmentTemplates, orderDetailSummaryData);
                var activeRuns = this.props.activeRuns;

                return (<IBox>
                      <IBoxTitleBar>
                    <IBoxTitleText>Order Group {groupName} Burn Down</IBoxTitleText>
                  </IBoxTitleBar>
                                  <IBoxSection>
                                          <div style={{position: "relative", width: "100%", height: 270}}>
                                                  <div style={{position:"absolute", zIndex:1, left: 0, right:0, top: 0, bottom: 0, width: "100%", height: "100%"}}>
                                                          <div style={{position:"absolute", left: 0, right:0, top: 0, bottom: 0, margin: "auto", height: 240}}>
                                                                  <DoughnutChart chartData={chartData} />
                                                          </div>
                                                  </div>
                                                  <div style={{position:"absolute", zIndex:3, left: 0, right:0, top: 0, bottom: 0, width: "100%", height: "100%"}}>
                                                          <div style={{position:"absolute", left: 0, right:0, top: 0, bottom: 0, margin: "auto", height: 240, display: "table", width: "100%"}}>
                                                                  <div style={{display: "table-cell", verticalAlign: "middle"}}>
                                                                          <div>
                                                                                  <div style={{fontSize: 85, margin: 0 }}>{remaining}</div>
                                                                                  <div>OF <span style={{fontSize: 23}}>{total}</span> ITEMS</div>
                                                                          </div>
                                                                  </div>
                                                          </div>
                                                  </div>
                                          </div>
                                  </IBoxSection>
                                  <IBoxSection className="shortSummary">
                                          <IBoxData dataValue={shorts} dataLabel="Shorts" />
                                  </IBoxSection>
                  <IBoxSection className="pickRate">
                                          <IBoxData dataValue={pickRate} dataLabel="/ Hour" />
                  </IBoxSection>
                  <IBoxSection>
                    <IBoxTitleText>Active Runs</IBoxTitleText>
                  </IBoxSection>
                                          {
                                           activeRuns.map(function(run) {
                                                   var label = run["id"];
                                                   var runSummary = run["summary"];
                                                   var numCompleted = run["complete"];
                                                   var numShorted = run["short"];
                                                   var numRemaining = run["remaining"];
                                                   var total = numCompleted + numShorted + numRemaining;
                                                   var percentCompleted = (numCompleted/total * 100).toFixed(2);
                                                   var percentShorted = (numShorted/total * 100).toFixed(2);
                                                   return (
                                                           <IBoxSection key={label}>
                                                           <div style={{display: "table", width: "100%"}} >
                                                           <div style={{display: "table-cell", width: 32}}>{label}</div>
                                                             <div className="progress burndown" style={{display: "table-cell"}}>
                                                               <div className="progress-bar progress-bar-completed" role="progressbar" aria-valuenow={numShorted} aria-valuemin="0" aria-valuemax="100" style={{width: percentCompleted+"%"}}>
                                                                 <span className="sr-only">{percentCompleted+"%"} Complete</span>
                                                                   </div>
                                                               <div className="progress-bar progress-bar-shorted" role="progressbar" aria-valuenow={numShorted} aria-valuemin="0" aria-valuemax="100" style={{width: percentShorted+"%"}}>
                                                                 <span className="sr-only">{percentShorted+"%"} Complete</span>
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
                var data  = {value: keyedValues[key]}
                var chartSegment =  _.merge({}, segmentTemplate, data);
                return chartSegment;
        });
        return chartValues;
}

module.exports = OrderDetailIBox; //Exports the class
