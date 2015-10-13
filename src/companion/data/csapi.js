import Promise from "bluebird";
import request from "superagent-bluebird-promise";
import _ from 'lodash';
import {Map} from 'immutable';
var {state} = require('data/state.js');
import {loggedout} from "data/auth/actions";

export class ConnectionError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}


var globalOptions = new Map({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});


function ajax(path, options) {
    if (options == null) options = {};
    var ajaxOptions = globalOptions.merge(options).toJS();

    let absoluteURL = toAbsoluteURL(path);

    let reqWithMethod = null;
    if (options.method && options.method === "POST") {
        reqWithMethod = request.post(absoluteURL)
                            .query(options.query)
                            .send(options.data);
    } else if (options.method && options.method === "PUT") {
        reqWithMethod = request.put(absoluteURL)
                            .query(options.query)
                            .send(options.data);
    } else if (options.method && options.method === "DELETE") {
        reqWithMethod = request.del(absoluteURL)
            .query(options.query)
            .send(options.data);
    } else { //GET
        reqWithMethod = request.get(absoluteURL);
            for (var key in options.data) {
                let value = options.data[key];
                if (_.isArray(value)) { //arrays should set a query pair for each value
                    for(var i = 0; i < value.length; i++) {
                        let queryVal = {};
                        queryVal[key] = value[i];
                        reqWithMethod = reqWithMethod.query(queryVal);
                    }
                }
                else {
                    let queryVal = {};
                    queryVal[key] = value;

                    reqWithMethod = reqWithMethod.query(queryVal);
                }
        }
    }

    if (options.contentType) {
        reqWithMethod = reqWithMethod.type(options.contentType);
    }
    return reqWithMethod
        .withCredentials()
        .accept('application/json')
        .then((response) => {
            return response.body;
        }, (error) => {
            console.log("error occurred", error);
            if (error.status == null) {
                throw new ConnectionError("Server is not available");
            } else if (error.status === 401) {
                loggedout();
            }
            throw error;
        });
}

function toAbsoluteURL(path) {
    var endpoint = state.cursor(["endpoint"])();
    return endpoint + path;
}

export function recoverPassword(email) {
    let queryData = {u: email};
    var options = {
        method: 'POST',
        contentType: "form", //superagent forum url encoded
        data: queryData
    };
    return ajax("/auth/recovery/start", options);

};


export function setupPassword(newPassword, queryData) {
    queryData.new = newPassword;
    var options = {
        method: 'POST',
        contentType: "form", //superagent forum url encoded
        data: queryData
    };
    return ajax("/auth/pw", options);

};


export function changePassword(oldPassword, newPassword) {
    var options = {
        method: 'POST',
        contentType: "form", //superagent forum url encoded
        data: {
            "old": oldPassword,
            "new": newPassword
        }
    };
    return ajax("/auth/pw", options);

};

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

export function getUsers() {
    return ajax("/api/users");
};

export function createUser(data) {
        return ajax("/api/users", {method: 'POST',
                                   contentType: "form", //superagent forum url encoded
                                   data: data});
}

export function updateUser(id, data) {
    return ajax("/api/users/"+id, {method: 'POST',
                               contentType: "form", //superagent forum url encoded
                               data: data});
}


export function  resendNewUserEmail(userId) {
    return ajax("/api/users/"+userId +"/resend", {method: 'POST'});
    }

export function getAvailableSecurityQuestions(data) {
    return ajax("/auth/questions", {data: data});
}


export function getFacilities() {
    return ajax("/api/facilities");
};

export function getFacilityContext() {
    var endpoint = state.cursor(["endpoint"])();
    var facility = state.cursor(["selectedFacility"])();
    var facilityId = facility.get("persistentId");
    var facilityPath = "/api/facilities/" + facilityId;
    let ordersPath = facilityPath + "/orders";
    let workInstructionsPath = facilityPath + "/work/instructions";
    let domainId = facility.domainId;
    return {
        domainId: domainId,
        facilityId: facilityId,
        endpoint: endpoint,

        recreateFacility() {
            return ajax("/api/facilities/recreate/" + facility.domainId, {
                method: "POST"
            });
        },

        getOrder(properties, orderId) {
            let orderPath = facilityPath + "/orders/" + orderId;
            return ajax(orderPath, {data: {"properties" : properties}});
        },


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

        getHealthCheckConfiguration: function(type) {
            let path = facilityPath + `/healthchecks/${type}/configuration`;
            return ajax(path);
        },

        getEdiGateways: function() {
            let edipath = facilityPath + "/edigateways";
            return ajax(edipath);

        },
        updateEdiGateway: function(config) {
            let edipath = facilityPath + "/edigateways/" + config.domainId;
            return ajax(edipath, {
                method: "POST",
                data: config,
                contentType: "form"
            });
        },

        startDropboxLink: function() {
            let edipath = facilityPath + "/edigateways/DROPBOX/link";
            return ajax(edipath);
        },

        findWorkInstructionReferences: function(filter) {
            var workInstructionsReferencesPath = workInstructionsPath + "/references";
            return ajax(workInstructionsReferencesPath, {
                data: filter
            });
        },

        getWorkInstruction: function(properties, persistentId) {
            return ajax(workInstructionsPath + "/" + persistentId, {
                data: {properties: properties}
            });
        },

        findOrders: function(filter) {
            return ajax(ordersPath, {
                data: filter
            });
        },

        findOrderReferences: function(filter) {
            return ajax(ordersPath + "/references", {
                data: filter
            });
        },


        getDataSummary: function() {
            let dataSummary = facilityPath + "/data/summary";
            return ajax(dataSummary);
        },

        triggerDataPurge: function() {
            let dataSummary = facilityPath + "/data/purge";
            return ajax(dataSummary, {
                method: "DELETE"
            });
        },

        deleteOrders: () => {
            return ajax(ordersPath, {method: "DELETE"});
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

        importWorkers: function(formData) {
            return this.importFile("workers", formData);
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

        importFile: function(path, formData) {
            let importPath = facilityPath + "/import/" + path;
            return ajax(importPath, {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false
            });
        },
        importOrderFile: function(formData) {
            return this.importFile("orders", formData);
        },
        importLocationFile: function(formData) {
            return this.importFile("locations", formData);
        },
        importAislesFile: function(formData) {
            return this.importFile("site", formData);
        },
        importInventoryFile: function(formData) {
            return this.importFile("inventory", formData);
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

        executeTestFunction(functionName, parameters) {
            let testFunction = facilityPath + "/test/" + functionName;
            return ajax(testFunction, {
                method: "POST",
                query: parameters,
                contentType: "form"
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
