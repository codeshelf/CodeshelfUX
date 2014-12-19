
var $ = require('jquery');

var getFacilities = function(endpoint) {
	var facilitiesPath = "/facilities";
	return $.ajax(endpoint + facilitiesPath, {

		}
	);
};

function getProductivity(endpoint , facilityId) {
	//https://localhost:8089/productivity/summary?facilityId=081a2d7a-7e12-4560-8351-dd4d07ccb4de;
	var productivityPath = "/productivity/summary";
	return $.ajax(endpoint + productivityPath, {
		data: {
			"facilityId": facilityId
		}
	});
}

function getCheRuns(endpoint , facilityId) {
	var cheSummaryPath  = "/productivity/chesummary";
	return $.ajax(endpoint + cheSummaryPath, {
		data: {
			"facilityId": facilityId
		}
	});
}


module.exports = {
	getFacilities: getFacilities,
	getProductivity: getProductivity,
	getCheRuns: getCheRuns
};
