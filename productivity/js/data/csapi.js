var $ = require('jquery');
var _ = require('lodash');

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

function getSummarySnapshot(endpoint, facilityId, viewSpec) {
    var filterName =  viewSpec["filterName"];
    var aggregate = viewSpec["aggregate"];
    var orderstatussummary = "/api/facilities/" + facilityId + "/statussummary/" + aggregate;
    return $.ajax(endpoint + orderstatussummary, {
        data: {
            filterName: filterName
        }
    });
}

function getFacilityContext(endpoint, facility) {
    var facilityId = facility["persistentId"];
    return {
        getProductivity : _.partial(getProductivity, endpoint, facilityId),
        getCheRuns: _.partial(getCheRuns, endpoint, facilityId),
        getSummarySnapshot: _.partial(getSummarySnapshot, endpoint, facilityId),
        getFilters: function() {
            var filtersUrl = "/api/facilities/" + facilityId + "/filters";
            return $.ajax(endpoint + filtersUrl, {});
        }
};

}

module.exports = {
	getFacilities: getFacilities,
    getFacilityContext: getFacilityContext,
    //deprecated below
	getProductivity: getProductivity,
	getCheRuns: getCheRuns
};
