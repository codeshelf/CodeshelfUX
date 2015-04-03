/** @jsx React.DOM */

var React = require("react");
var _ = require('lodash');
var RClass = require("../helpers/react-helper");


var Breadcrumb = RClass(function() {
    var crumbs = this.props.breadcrumbs;

    var renderedChildren = [];
    var lastCrumb = _.last(crumbs);
    var lastLabel = lastCrumb["label"];
    return (
            <div className="row wrapper border-bottom white-bg page-heading">
            <div className="col-lg-9">
            <div id="pageBreadcrumb">
            <h2>{lastLabel}</h2>
            <ol className="breadcrumb">
                {
                   _.dropRight(crumbs, 1).map(function(crumb) {
                       return (<li key={crumb.label}>
                                  <a href={crumb.href}>{crumb.label}</a>
                               </li>);
                   })
                }
                <li className="active" key={lastCrumb.label}>
                   <strong>{lastCrumb.label}</strong>
                </li>
            </ol>
            </div>
            </div>
            </div>);
});

module.exports = Breadcrumb;
