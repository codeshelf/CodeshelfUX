import $ from 'jquery';
import _ from 'lodash';
import {Map} from 'immutable';
var {state} = require('data/state.js');

var globalOptions = new Map({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});





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

function ajax(path, options) {
    if (options == null) options = {};
    var ajaxOptions = globalOptions.merge(options).toJS();
    return $.ajax(toAbsoluteURL(path), ajaxOptions);

}

function toAbsoluteURL(path) {
    var endpoint = state.cursor(["endpoint"])();
    return endpoint + path;
}

export function authenticate(username, password) {
    var options = {
        method: 'POST',
        data: {
            "u": username,
            "p": password
        }
    };
    return ajax("/auth/", options);
};

export function getUser() {
    return ajax("/mgr/security");
};

export function getFacilities() {
    return ajax("/api/facilities");
};

export function getFacilityContext() {
    var endpoint = state.cursor(["endpoint"])();
    var facility = state.cursor(["selectedFacility"])();
    var facilityId = facility.get("persistentId");
    return {
        facilityId: facilityId,
        endpoint: endpoint,
        getProductivity : function() {
	        var productivityPath = "/api/facilities/" + facilityId + "/productivity";
	        return ajax(productivityPath);
        },
        getCheRuns: function() {
            var cheSummaryPath  = "/api/facilities/" + facilityId + "/chesummary";
	        return ajax(cheSummaryPath);
        },
        getBlockedWork: _.partial(getBlockedWork, endpoint, facilityId),
        getSummarySnapshot: function(viewSpec) {
            var filterName =  viewSpec["filterName"];
            var aggregate = viewSpec["aggregate"];
            var orderstatussummary = "/api/facilities/" + facilityId + "/statussummary/" + aggregate;
            return ajax(orderstatussummary, {
                data: {
                    filterName: filterName
                }
            });
        },

        getWorkResults: function(startTimestamp, endTimestamp) {
	        var workResults = "/api/facilities/" + facilityId + "/work/results";
	        return ajax(workResults, {
                data: {
                    "startTimestamp": startTimestamp,
                    "endTimestamp": endTimestamp
                }
            });

        },
        getTopItems: function() {
	        var topItems = "/api/facilities/" + facilityId + "/work/topitems";
	        return ajax(topItems);
        },
        getBlockedWorkNoLocation: function () {
	        var blockedWorkNoLocationPath = "/api/facilities/" + facilityId + "/blockedwork/nolocation";
	        return ajax(blockedWorkNoLocationPath);
        },
        getBlockedWorkShorts: function () {
	        var blockedWorkNoLocationPath = "/api/facilities/" + facilityId + "/blockedwork/shorts";
	        return ajax(blockedWorkNoLocationPath);
        },
        getFilters: function() {
            var filtersUrl = "/api/facilities/" + facilityId + "/filters";
            return ajax(filtersUrl);
        }
    };
};
