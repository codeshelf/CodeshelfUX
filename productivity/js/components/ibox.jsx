/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");

var IBoxData = RClass(function() {
		return (<span>
				  <span className="m-xs" style={{fontSize: 49}}>{this.props.dataValue}</span>
				  <span style={{fontSize: 35}}>{this.props.dataLabel}</span>
				</span>);
	});

var IBoxTitleText = RClass(function() {
		return (<h5>{this.props.children}</h5>);
	});

var IBoxTitleTools = RClass(function() {
	return (
		<div className="ibox-tools dropdown">
			<a onclick="{showhide();}"> <i className="fa fa-chevron-up"></i></a>
			<a className="dropdown-toggle" href>
			<i className="fa fa-wrench"></i>
			</a>
			<a onclick="closebox()"><i className="fa fa-times"></i></a>
		</div>);
	});

var IBoxTitleBar = RClass(function() {
		return (<div className="ibox-title">
				{this.props.children}
				</div>);
	});

var IBoxSection = RClass(function() {
    return (<div className="ibox-content">
				{this.props.children}
            </div>);
	});

var IBox = RClass(function() {
	return (<div className="ibox float-e-margins">
				{this.props.children}
			</div>);
});

module.exports = {
	IBox: IBox,
	IBoxData: IBoxData,
	IBoxTitleBar: IBoxTitleBar,
	IBoxTitleText: IBoxTitleText,
	IBoxTitleTools: IBoxTitleTools,
	IBoxSection: IBoxSection
};
