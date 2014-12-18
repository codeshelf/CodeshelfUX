var React = require('react');
var OrderDetailIBox = require('orderdetailibox');
var $ = require('jquery');




function productivity() {
	//https://localhost:8089/productivity/summary?facilityId=081a2d7a-7e12-4560-8351-dd4d07ccb4de;
	var el = $('.orderdetails').get(0);
	var serverEntryPoint = "https://localhost:8089";
	var productivityPath = "/productivity/summary";
	var facilityId = "081a2d7a-7e12-4560-8351-dd4d07ccb4de";
	$.ajax(serverEntryPoint + productivityPath, {
		data: {
			"facilityId": facilityId
		}
	}).done(function(data) {
		console.log("received productivity data", data);
		var groups = data["groups"];
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
		React.render(div, el);
	});

}

var poll = function() {
	productivity();
	window.setTimeout(poll, 3000);
};
poll();
