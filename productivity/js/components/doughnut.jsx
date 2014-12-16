/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");
var Doughnut = require("./doughnut.js");

var DoughnutChart = RClass(function() {
		return (<canvas style={{'height': 400, 'width': 350}} />);
	},
	{
		componentDidMount: function() {
			var chartData = this.props.chartData;

			var el = this.getDOMNode();
			var chart = new Doughnut(el, chartData, {
							percentageInnerCutout: 80,
							animateRotate : false
						});
			chart.render();
			this.setState({chart: chart});
			console.log("doughnut component mounted at", el);
		},
		componentWillUnmount: function() {
			this.state.chart.destroy();
		},
		componentDidUpdate: function(prevProps, prevState) {
			var chartData = this.props.chartData;

			var chart = this.state.chart;
			chart.updateDataValues(chartData);
			chart.render();
		},
		getSegments: function() {
			return this.state.chart.chart.segments;
		}

	});

module.exports = DoughnutChart;
