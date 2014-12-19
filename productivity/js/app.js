var React = require('react');
var OrderDetailIBox = require('components/orderdetailibox');
var $ = require('jquery');

var csapi = require('data/csapi');

var endpoint = "https://localhost:8089";

csapi.getFacilities(endpoint)
	.then(function(facilities) {
		var facilityId = facilities[0].persistentId;
		return csapi.getProductivity(endpoint, facilityId);
	})
	.then(function(productivityUpdate) {
		var groups = productivityUpdate["groups"];
		//only the first for now
		var orderDetailComponents = [];
		for(var groupName in groups) {
			var orderDetailSummaryData = groups[groupName];

			//add created to released
			var combined = orderDetailSummaryData["created"] + orderDetailSummaryData["released"];
			orderDetailSummaryData["released"] = combined;
			var props = {
				"groupName": "12/15/2014",
				orderDetailSummaryData: orderDetailSummaryData,
				pickRate: 999
			};
			orderDetailComponents.push(React.createElement(OrderDetailIBox, props));
		}
		var div = React.createElement("div", {}, orderDetailComponents);

		var el = $('.orderdetails').get(0);
		React.render(div, el);

	});




var poll = function() {
	window.setTimeout(poll, 3000);
};
//poll();
