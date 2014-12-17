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
		var pickRate     = this.props.pickRate;
		var chartData = toChartData(segmentTemplates, orderDetailSummaryData);
		return (<IBox>
	              <IBoxTitleBar>
                    <IBoxTitleText>Order Group {groupName} Burn Down</IBoxTitleText>
                  </IBoxTitleBar>
				  <IBoxSection>
					  <DoughnutChart chartData={chartData}/>
				  </IBoxSection>
				  <IBoxSection className="shortSummary">
					  <IBoxData dataValue={shorts} dataLabel="Shorts" />
				  </IBoxSection>
                  <IBoxSection className="pickRate">
					  <IBoxData dataValue={pickRate} dataLabel="/ hour" />
                  </IBoxSection>
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
