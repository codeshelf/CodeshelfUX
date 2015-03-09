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

function getBlockedWorkNoLocation(endpoint, facilityId) {
	var blockedWorkNoLocationPath = "/api/facilities/" + facilityId + "/blockedwork/nolocation";
	return $.ajax(endpoint + blockedWorkNoLocationPath, {
	});
}

function getBlockedWork(endpoint, facilityId, type) {
    var blockedWorkByType = {
        "NOLOC" : [
                {sku:"KN-PS-6",
                 uom:"CS",
                 description:"Knife 6in.",
                 lines:4,
                 total:18
                },
                {sku:"BO-PA-12-P",
                 uom:"PK",
                 description:"12 OZ PAPER BOWL - 50/pack",
                 lines:1,
                 total:1
                },
                {sku:"BO-PA-16-P",
                 uom:"PK",
                 description:"16 OZ PAPER BOWL - 50/pack",
                 lines:2,
                 total:2
                }
            ]
        ,
        "SHORT" : [
            {sku:"KN-PS-6", uom:"CS", orderId:"2341151234", description:"Knife 6in.", actualQuantity:"0", planQuantity:"1", location:"D-235", lines:"4", total:"18"},
            {sku:"PA-12-P", uom:"PK", orderId:"234115aasdf4", description:"12 OZ PAPER BOWL - 50/pack", actualQuantity:"2", planQuantity:"5", location:"D-343", lines:"1", total:"1"},
            {sku:"PA-16-P", uom:"PK", orderId:"aq321143212", description:"16 OZ PAPER BOWL - 50/pack", actualQuantity:"4", planQuantity:"8", location:"P-123", lines:"2", total:"2"}
        ],
        "SUSPECTORDER" : [],
        "UNSEQUENCED" :[]
    };
    var promise = $.Deferred();
    promise.resolve(blockedWorkByType[type]);
    return promise;
}


function getFacilityContext(endpoint, facility) {
    var facilityId = facility["persistentId"];
    return {
        facilityId: facilityId,
        endpoint: endpoint,
        getProductivity : _.partial(getProductivity, endpoint, facilityId),
        getCheRuns: _.partial(getCheRuns, endpoint, facilityId),
        getSummarySnapshot: _.partial(getSummarySnapshot, endpoint, facilityId),
        getBlockedWorkNoLocation: _.partial(getBlockedWorkNoLocation, endpoint, facilityId),
        getBlockedWork: _.partial(getBlockedWork, endpoint, facilityId),
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
