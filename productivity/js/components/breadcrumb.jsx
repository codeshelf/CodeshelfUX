/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");

var Breadcrumb = RClass(function() {
	var crumbs = this.props.crumbs;

	var renderedChildren = [];
	var lastLabel = "";
	for(var i=0; i < crumbs.length; i++) {
		var crumb = crumbs[i];
		var node = null;

		if (i == crumbs.length-1) {
			node = (<li className="active">
                       <strong>{crumb.label}</strong>
                    </li>);
		}
		else {
			node = (<li>
                       <a href={crumb.href}>{crumb.label}</a>
                    </li>);
		}
		lastLabel = crumb.label;
     	renderedChildren.push(node);
	}
    return (
		<div>
			<h2>{lastLabel}</h2>
			<ol className="breadcrumb">{ renderedChildren }</ol>
		</div>
	);
});

module.exports = Breadcrumb;
