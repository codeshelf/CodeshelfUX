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
{/*
                  <IBoxSection>
					  Active Runs
                  </IBoxSection>
                  <IBoxSection>
					  # [ | ]
                  </IBoxSection>
                  <IBoxSection>
					  # [ | ]
                  </IBoxSection>
                  <IBoxSection>
					  Show all complete runs &gt;
                  </IBoxSection>
*/}
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
