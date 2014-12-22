/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');

var OrderDetailIBox = require('components/orderdetailibox');
var NavHeader = require('components/nav').NavHeader;

var csapi = require('data/csapi');

var endpoint = "http://localhost:8088";
csapi.getFacilities(endpoint).then(function(facilities) {
	//Hack to select first found facility
	selectedFaclity(endpoint, facilities[0]);
});

function selectedFaclity(endpoint, facility) {
	//Render Navigation
	React.render(React.createElement(NavHeader, {facility: facility }), $("li.nav-header").get(0));

	var facilityId = facility.persistentId;

	//Render Che Runs
	csapi.getCheRuns(endpoint, facilityId).then(function(runs) {
		console.log("The che runs", runs);
	});

	//Render Productivity for facility
	csapi.getProductivity(endpoint, facilityId)
		.then(function(productivityUpdate) {

			var orderDetailComponents = toOrderDetailComponents(productivityUpdate);


			var div = React.createElement("div", {className: "row orderdetails"}, orderDetailComponents);
			React.render(div, $('.wrapper-content').get(0));

		});
}

function toOrderDetailComponents(productivityUpdate) {
	var groups = productivityUpdate["groups"];
	//Render an order detail component fro each group
	var orderDetailComponents = [];
	for(var groupName in groups) {
		var orderDetailSummaryData = groups[groupName];

		//add created to released
		var combined = orderDetailSummaryData["created"] + orderDetailSummaryData["released"];
		orderDetailSummaryData["released"] = combined;


		//Render Order Detail for order group
		var props = {
			"groupName": groupName,
			orderDetailSummaryData: orderDetailSummaryData,
			pickRate: orderDetailSummaryData["picksPerHour"]
		};

		var orderDetailIBox = React.createElement(OrderDetailIBox, props);
		var div = React.createElement("div", {className: "col-lg-3"}, orderDetailIBox);

		orderDetailComponents.push(div);
	}
	return orderDetailComponents;
}
