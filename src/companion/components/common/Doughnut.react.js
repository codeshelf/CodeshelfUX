import React from "react";
import ReactDOM from 'react-dom';
import Doughnut from "lib/chart/doughnut.js";

var DoughnutChart = React.createClass({
    render: function() {
        return (<canvas />);
    },
    componentDidMount: function() {
        var chartData = this.props.chartData;
        var el = ReactDOM.findDOMNode(this);
        var chart = new Doughnut(el, chartData, {
            percentageInnerCutout: 75,
            animation: false,
            animateRotate : false,
            responsive: true
        });
        chart.render();
        this.setState({chart: chart});
        console.log("doughnut component mounted at", el);
    },
    componentWillUnmount: function() {
        var chart = this.state.chart;
        if (chart) {
            chart.destroy();
        }
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
