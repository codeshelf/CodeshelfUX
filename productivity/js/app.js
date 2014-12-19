/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');

var OrderDetailIBox = require('components/orderdetailibox');
var NavHeader = require('components/nav').NavHeader;

var csapi = require('data/csapi');




var endpoint = "https://localhost:8089";
csapi.getFacilities(endpoint).then(function(facilities) {
			selectedFaclity(endpoint, facilities[0]);
});


function selectedFaclity(endpoint, facility) {
	var props = {facility: facility
				 };
	React.render(React.createElement(NavHeader, props), $("li.nav-header").get(0));

	var facilityId = facility.persistentId;
	csapi.getProductivity(endpoint, facilityId)
		.then(function(productivityUpdate) {
			var orderDetailComponents = toOrderDetailComponents(productivityUpdate);
			var div = React.createElement("div", {className: "col-lg-3"}, orderDetailComponents);
			var el = $('.orderdetails').get(0);
			React.render(div, el);

		});

}

function updateNavigationContext(facility) {

}

function toOrderDetailComponents(productivityUpdate) {
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
	return orderDetailComponents;
}

var poll = function() {
	window.setTimeout(poll, 3000);
};
//poll();
