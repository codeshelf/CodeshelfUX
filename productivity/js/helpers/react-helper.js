
var React = require("react");
var $ = require('jquery');

function RClass(renderFunction, otherMethods) {
	if (otherMethods == null) {
		otherMethods = {};
	}
	var objTemplate = $.extend({}, otherMethods, {
		render: renderFunction
	});
	console.log(objTemplate);
	return React.createClass(objTemplate);
}

module.exports = RClass;
