
var $ = require('jquery');

var getFacilities = function(endpoint) {
	var facilitiesPath = "/api/facilities";
	return $.ajax(endpoint + facilitiesPath, {

		}
	);
};

function getProductivity(endpoint , facilityId) {
	var productivityPath = "/api/facilities/" + facilityId + "/productivity";
	return $.ajax(endpoint + productivityPath, {
	});
}

function getCheRuns(endpoint , facilityId) {
	var cheSummaryPath  = "/api/facilities/" + facilityId + "/chesummary";
	return $.ajax(endpoint + cheSummaryPath, {
	});
}


module.exports = {
	getFacilities: getFacilities,
	getProductivity: getProductivity,
	getCheRuns: getCheRuns
};
