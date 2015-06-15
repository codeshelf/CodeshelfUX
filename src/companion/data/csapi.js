import Promise from "bluebird";
import request from "superagent-bluebird-promise";
import _ from 'lodash';
import {Map} from 'immutable';
var {state} = require('data/state.js');
import {loggedout} from "data/auth/actions";
var globalOptions = new Map({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

function ajax(path, options) {
    if (options == null) options = {};
    var ajaxOptions = globalOptions.merge(options).toJS();
    let absolueURL = toAbsoluteURL(path);

    let reqWithMethod = null;
    if (options.method && options.method === "POST") {
        reqWithMethod = request.post(absolueURL)
                            .query(options.query)
                            .send(options.data);
    } else if (options.method && options.method === "PUT") {
        reqWithMethod = request.put(absolueURL)
                            .query(options.query)
                            .send(options.data);
    } else {
        reqWithMethod = request.get(absolueURL)
                            .query(options.data);
    }

    if (options.contentType) {
        reqWithMethod = reqWithMethod.type(options.contentType);
    }
    return reqWithMethod
        .withCredentials()
        .then((response) => {
            return response.body;
        }, (error) => {
            console.log("error occurred", error);
            if (error.status === 401) {
                loggedout();
            }
            throw error;
        });
}

function toAbsoluteURL(path) {
    var endpoint = state.cursor(["endpoint"])();
    return endpoint + path;
}

export function authenticate(username, password) {
    var options = {
        method: 'POST',
        contentType: "form", //superagent forum url encoded
        data: {
            "u": username,
            "p": password
        }
    };
    return ajax("/auth/", options);

};

export function logout() {
    return ajax("/auth/logout");
};

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

        getOrderDetails(orderId) {
            let orderDetailsPath = facilityPath + "/orders/" + orderId + "/details";
            return ajax(orderDetailsPath, {});
        },

        getExtensionPoints: function() {
            let extensionPointsPath = facilityPath + "/extensionpoints";
            return ajax(extensionPointsPath);
        },

        addExtensionPoint: function(params) {
            let extensionPointsPath = facilityPath + "/extensionpoints";
            return ajax(extensionPointsPath, {
                method: "POST",
                data: params,
                contentType: "form"
            });
        },


        updateExtensionPoint: function(extensionPoint) {
            let extensionPointsPath = facilityPath + "/extensionpoints/" + extensionPoint.persistentId;
            return ajax(extensionPointsPath, {
                method: "PUT",
                contentType: "form", //superagent forum url encoded
                data: extensionPoint
            });
        },

        findOrders: function(filter) {
            let ordersPath = facilityPath + "/orders";
            return ajax(ordersPath, {
                data: filter
            });
        },

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
                method: "POST",
                contentType: "form" //superagent forum url encoded
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
        getFilters: function() {
            var filtersUrl = facilityPath + "/filters";
            return ajax(filtersUrl);
        },
        getImportReceipts: function(startTimestamp, endTimestamp) {
            var receiptPath = facilityPath + "/import";
            return ajax(receiptPath, {
                data: {
                    "startTimestamp": startTimestamp,
                    "endTimestamp": endTimestamp
                }
            });
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
        processPickScript: function(formData) {
            var runpickscript = facilityPath + "/process_script";
            return ajax(runpickscript, {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false
            });
        },
        runScriptStep: function(formData, stepId, timeout) {
            //jquery ajax allows data to be one object (which we are using for formdata)
            var runpickscript = facilityPath + "/run_script";
            formData.append("keepFromBeingEmpty", "empty");
            return ajax(runpickscript, {
                method: "POST",
                query: {
                    script_step_id: stepId,
                    timeout_min: timeout
                },
                data: formData,
                processData: false,
                contentType: false
            });
        }



    };
};
