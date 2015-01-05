/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");

var Breadcrumb = RClass(function() {
    var crumbs = this.props.breadcrumbs;

    var renderedChildren = [];
    var lastLabel = "";
    for(var i=0; i < crumbs.length; i++) {
	var crumb = crumbs[i];
	var node = null;

	if (i == crumbs.length-1) {
	    node = (<li className="active" key={crumb.label}>
                      <strong>{crumb.label}</strong>
                    </li>);
	}
	else {
	    node = (<li key={crumb.label}>
                      <a href={crumb.href}>{crumb.label}</a>
                    </li>);
	}
	lastLabel = crumb.label;
     	renderedChildren.push(node);
    }
    return (
            <div className="row wrapper border-bottom white-bg page-heading">
            <div className="col-lg-9">
            <div id="pageBreadcrumb">
            <h2>{lastLabel}</h2>
            <ol className="breadcrumb">{ renderedChildren }</ol>
            </div>
            </div>
            </div>);
});

module.exports = Breadcrumb;
