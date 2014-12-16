var React = require('react');
var OrderDetailIBox = require('orderdetailibox');

var el = document.getElementById('orderdetail');

function summaryData(numComplete, numReleased, numInProgress, numShorts) {
	return {
		"complete" : numComplete,
		"released" : numReleased,
		"inprogress" : numInProgress,
		"short" : numShorts
	};
}

var props = {
	"groupName": "12/15/2014",
	orderDetailSummaryData: summaryData(10, 20, 5, 2),
	pickRate: 999
};
React.render(React.createElement(OrderDetailIBox, props), el);
