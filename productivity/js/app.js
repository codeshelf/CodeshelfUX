/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');
var Rx = require('rx');

var OrderDetailIBox = require('components/orderdetailibox');
var Nav = require('components/nav');
var Breadcrumbs = require('components/breadcrumb');
var csapi = require('data/csapi');

//synchronous call to get hosts.json
var config = (function(){
	var config = {};
	$.ajax({
		url: "/config/hosts.json",
		success: function(data) {
			config = data;
		},
		async:false
	});
	return config;})();


var primaryHost = config['primaryHost'];
var endpoint = config["endpoint"].replace(/%host%/, primaryHost);
var el = React.createElement;

csapi.getFacilities(endpoint).then(function(facilities) {
	//Hack to select first found facility
	selectedFaclity(endpoint, facilities[0]);
});



function selectedFaclity(endpoint, facility) {
	//Render Navigation
	var props = {facility: facility,
				 navMenus: [
					 {"key": "activity",
					 "label": "Activity",
					 "icon": "fa-bar-chart-o",
					 "menuItems": [
						 {"href": "javascript:contactWasSelected()", key: "all", "label": "All" },
						 {"href": "javascript:launchDebugWindow()", key: "chill", "label": "Chill" },
						 {"href": "javascript:launchTestRunner()", key: "dry", "label": "Dry" },
						 {"href": "javascript:launchTestRunner()", key: "produce", "label": "Produce" }
						 ]
					 }]
				 };
	React.render(el(Nav, props), $("#nav-container").get(0));

	var breadcrumbs = [
		{"label": facility['domainId'], "href": "#"	},
		{"label": "Activity", "href": "#"},
		{"label": "Chill", "href": "#"}

	];
	React.render(el(Breadcrumbs, {crumbs: breadcrumbs}), $("#pageBreadcrumb").get(0));

	//Render Che Runs
	var facilityId = facility['persistentId'];
	csapi.getCheRuns(endpoint, facilityId).then(function(runs) {
		console.log("The che runs", runs);
	});



	//Create strean of productivity updates for the facility
	var productivityStream = Rx.Observable.interval(5000 /*ms*/).flatMapLatest(function() {
		return Rx.Observable.fromPromise(csapi.getProductivity (endpoint, facilityId)).catch(Rx.Observable.empty());
	});

	//Render updates of productivity
	var subscription = productivityStream.subscribe(function(productivityUpdate) {
			console.log("received productivityupdate", productivityUpdate);
			var orderDetailComponents = toOrderDetailComponents(productivityUpdate);
			var div = React.createElement("div", {className: "row orderdetails"}, orderDetailComponents);
			React.render(div, $('.wrapper-content').get(0));
	});

	//TODO hook subscription disposal
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
