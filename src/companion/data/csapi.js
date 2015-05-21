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

export function logout() {
    return ajax("/auth/logout");
}

export function getUser() {
    return ajax("/auth/");
};

export function getFacilities() {
    return ajax("/api/facilities");
};


export function getFacilityContext() {
    var endpoint = state.cursor(["endpoint"])();
    var facility = state.cursor(["selectedFacility"])();
    var facilityId = facility.get("persistentId");
    var facilityPath = "/api/facilities/" + facilityId;
    return {
        facilityId: facilityId,
        endpoint: endpoint,

        getWorkers: function() {
            var workersPath = facilityPath + "/workers";
            return ajax(workersPath);
        },
        addWorker: function(worker) {
            if (worker.persistentId != null) {
                console.warn("trying to add a worker with persistentId set");
            }
            delete worker.persistentId;  //don't send in JSON so it doesn't try to deserialize with setPersistentId and fail
            var workersPath = facilityPath + "/workers";
            return ajax(workersPath, {
                method: "POST",
                data: JSON.stringify(worker),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        },
        updateWorker: function(worker) {
            var workersPath = "/api/workers/" + worker.persistentId;
            return ajax(workersPath, {
                method: "PUT",
                data: JSON.stringify(worker),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        },

        getProductivity : function() {
            var productivityPath = facilityPath + "/productivity";
            return ajax(productivityPath);
        },
        getCheRuns: function() {
            var cheSummaryPath = facilityPath + "/chesummary";
            return ajax(cheSummaryPath);
        },
        getBlockedWork: _.partial(getBlockedWork, endpoint, facilityId),
        getSummarySnapshot: function(viewSpec) {
            var {filterName, aggregate} = viewSpec;
            var orderstatussummary = facilityPath + "/statussummary/" + aggregate;
            return ajax(orderstatussummary, {
                data: {
                    filterName: filterName
                }
            });
        },

        resolveIssue: (issue) => {
            let persistentId = issue.get("persistentId");
            let resolvePath = `/api/events/${persistentId}/resolve`;
            return ajax(resolvePath, {
                method: "POST"
            });
        },
        getIssues: (criteria) => {
            //http://localhost:8181/api/facilities/af44f88e-9569-48a3-b4db-d3b6e3c4689d/events?type=SKIP_ITEM_SCAN
            let data = {
                groupBy: criteria.groupBy
            };
            _.merge(data, criteria.filterBy);
            return ajax(facilityPath + "/events", {
                data: data
            });
        },
        getWorkResults: function(startTimestamp, endTimestamp) {
            var workResults = facilityPath + "/work/results";
            return ajax(workResults, {
                data: {
                   "startTimestamp": startTimestamp,
                    "endTimestamp": endTimestamp
                }
            });

        },
        getTopItems: function() {
            var topItems = facilityPath + "/work/topitems";
            return ajax(topItems);
        },
        getBlockedWorkNoLocation: function () {
            var blockedWorkNoLocationPath = facilityPath + "/blockedwork/nolocation";
            return ajax(blockedWorkNoLocationPath);
        },
        getBlockedWorkShorts: function () {
            var blockedWorkNoLocationPath = facilityPath + "/blockedwork/shorts";
            return ajax(blockedWorkNoLocationPath);
        },
        getFilters: function() {
            var filtersUrl = facilityPath + "/filters";
            return ajax(filtersUrl);
        },
        getPickRates: (startTimestamp, endTimestamp) => {
            var pickRateUrl = facilityPath + "/pickrate";
            return ajax(pickRateUrl, {
                data: {
                    startTimestamp: startTimestamp,
                    endTimestamp: endTimestamp
                }
            });
        },
        runPickScript: function(formData, timeout) {
            var runpickscript = facilityPath + "/runscript?timeout_min=" + timeout; //jquery ajax allows data to be one object (which we are using for formdata)
            return ajax(runpickscript, {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false
            });
        }


    };
};
