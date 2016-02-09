import Promise from "bluebird";
import request from "superagent-bluebird-promise";
import _ from 'lodash';
import {Map} from 'immutable';
var {state} = require('data/state.js');
import {loggedout} from "data/auth/actions";
import moment from "moment";


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

    if (options.accept) {
        reqWithMethod = reqWithMethod.accept(options.accept);
    } else {
        reqWithMethod = reqWithMethod.accept('application/json');
    }

    if (options.contentType) {
        reqWithMethod = reqWithMethod.type(options.contentType);
    }

    return reqWithMethod
        .withCredentials()
        .then((response) => {
            if (response.body) {
                return response.body;
            } else {
                return response.text;
            }
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

function addResource(path, params) {
    return ajax(path, {
        method: "POST",
        data: params,
        contentType: "form"
    });
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

export function getFacilityCustomers(domainId) {
    return ajax("/api/facilities/" + domainId + "");
};

// facilityId can be injected(for mobile web) or will be taken from facility cursor if not provided(desktop web)
export function getFacilityContext({selectedFacility, selectedCustomer}) {
    var endpoint = state.cursor(["endpoint"])();
    var facility = state.cursor(["selectedFacility"])();
    var facilityId = (selectedFacility && selectedFacility.persistentId) || facility.get("persistentId");
    // not sure if paths will be this way in the future
    let basePath = "/api/facilities/" + facilityId;
    basePath = selectedCustomer !== 'ALL' && selectedCustomer ? basePath + "/" + selectedCustomer.domainId: basePath;
    let ordersPath = basePath + "/orders";
    let workInstructionsPath = basePath + "/work/instructions";
    let domainId = facility && facility.domainId;
    return {
        domainId: domainId,
        facilityId: facilityId,
        endpoint: endpoint,
        facility: facility,
        utcOffset: (selectedFacility && selectedFacility.utcOffset) || facility.get("utcOffset"),

        recreateFacility() {
            return ajax("/api/facilities/recreate/" + facility.domainId, {
                method: "POST"
            });
        },

        getOrder(properties, orderId) {
            let orderPath = basePath + "/orders/" + orderId;
            return ajax(orderPath, {data: {"properties" : properties}});
        },


        getOrderDetails(orderId) {
            let orderDetailsPath = basePath + "/orders/" + orderId + "/details";
            return ajax(orderDetailsPath, {});
        },

        getOrderEvents(orderId) {
            let orderDetailsPath = basePath + "/orders/" + orderId + "/events";
            return ajax(orderDetailsPath, {});
        },

        getExtensionPoints: function() {
            let extensionPointsPath = basePath + "/extensionpoints";
            return ajax(extensionPointsPath);
        },

        addExtensionPoint: function(params) {
            let extensionPointsPath = basePath + "/extensionpoints";
            return addResource(extensionPointsPath, params);
        },

        deleteExtensionPoint: function(extensionPoint) {
            let extensionPointsPath = basePath + "/extensionpoints/" + extensionPoint.persistentId;
            return ajax(extensionPointsPath, {
                method: "DELETE"
            });
        },

        updateExtensionPoint: function(extensionPoint) {
            let extensionPointsPath = basePath + "/extensionpoints/" + extensionPoint.persistentId;
            return ajax(extensionPointsPath, {
                method: "PUT",
                contentType: "form", //superagent forum url encoded
                data: extensionPoint
            });
        },

        getHealthCheckConfiguration: function(type) {
            let path = basePath + `/healthchecks/${type}/configuration`;
            return ajax(path);
        },

        getEdiGateways: function() {
            let edipath = basePath + "/edigateways";
            return ajax(edipath);

        },
        updateEdiGateway: function(config) {
            let edipath = basePath + "/edigateways/" + config.domainId;
            return ajax(edipath, {
                method: "POST",
                data: config,
                contentType: "form"
            });
        },

        startDropboxLink: function() {
            let edipath = basePath + "/edigateways/DROPBOX/link";
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
            let dataSummary = basePath + "/data/summary";
            return ajax(dataSummary);
        },

        deleteOrders: () => {
            return ajax(ordersPath, {method: "DELETE"});
        },

        getChe: (domainId) => {
          var chesPath = basePath + "/ches/" + encodeURIComponent(domainId);
          return ajax(chesPath, {});
        },

        findChes: function(filter) {
            var chesPath = basePath + "/ches";
            return ajax(chesPath, {
                data: filter
            });
        },

        getCheEvents: function(domainId) {
          var chesPath = basePath + "/ches/" + encodeURIComponent(domainId) + "/events";
          return ajax(chesPath, {});
        },

        getCheEventHistogram({id, startAt, endAt, interval}) {
          var workerPath = basePath + "/ches/" + id + "/events/histogram";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          const createdBin = interval.toISOString();
          return ajax(workerPath, {
            data: {created, createdBin}
          });
        },

        getCheEventsNext: function({id, next}) {
          var chePath = basePath + "/ches/" + encodeURIComponent(id) + "/events";
          return ajax(chePath, {
            data: {next}
          });
        },

        getCheEventsWithTime: function({id, startAt, endAt}) {
          var chePath = basePath + "/ches/" + encodeURIComponent(id) + "/events";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          return ajax(chePath, {
            data: {created}
          });
        },



        findWorkers: function(filter) {
          var workersPath = basePath + "/workers";
          return ajax(workersPath, {
              data: filter
          });
        },

        getWorker: function(domainId) {
          var workerPath = basePath + "/workers/" + encodeURIComponent(domainId);
          return ajax(workerPath, {});
        },

        getWorkerEvents: function(domainId) {
          var workerPath = basePath + "/workers/" + encodeURIComponent(domainId) + "/events";
          return ajax(workerPath, {});
        },

        getWorkerEventsNext: function({id, next}) {
          var workerPath = basePath + "/workers/" + encodeURIComponent(id) + "/events";
          return ajax(workerPath, {
            data: {next}
          });
        },

        getWorkerEventsWithTime: function({id, startAt, endAt, purposes}) {
          var workerPath = facilityPath + "/workers/" + encodeURIComponent(id) + "/events";
          var workerPath = basePath + "/workers/" + encodeURIComponent(id) + "/events";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          return ajax(workerPath, {
            data: {created, purpose: purposes}
          });
        },

        getWorkerPicksWithnWindow: function({startAt, endAt, interval, purposes}) {
          const path = basePath + "/picks/histogram";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          const createdBin = interval.toISOString();
          return ajax(path, {
            data: {created, createdBin, purpose: purposes}
          });
        },

        getWorkerPicksWithnWindowAllWorkers: function({startAt, endAt, interval, purposes}) {
          const path = basePath + "/picks/workers/histogram";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          const createdBin = interval.toISOString();
          return ajax(path, {
            data: {created, createdBin, purpose: purposes}
          });
        },

        getWorkerEventHistogram({id, startAt, endAt, interval, purposes}) {
          const workerPath = basePath + "/workers/" + id + "/events/histogram";
          startAt = moment(startAt);
          endAt = moment(endAt);
          const created = startAt.toISOString() + "/" + endAt.toISOString();
          const createdBin = interval.toISOString();
          return ajax(workerPath, {
            data: {created, createdBin, purpose: purposes}
          });
        },

        getWorkers: function(params) {
            var workersPath = basePath + "/workers";
            return ajax(workersPath, {
              data: params
            });
        },
        //TODO: this should work like extension point and scheduledjob
        addWorker: function(worker) {
            if (worker.persistentId != null) {
                console.warn("trying to add a worker with persistentId set");
            }
            delete worker.persistentId;  //don't send in JSON so it doesn't try to deserialize with setPersistentId and fail
            var workersPath = basePath + "/workers";
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
            var orderstatussummary = basePath + "/statussummary/" + aggregate;
            return ajax(orderstatussummary, {
                data: {
                    filterName: filterName
                }
            });
        },

        replenishItem: (issue) => {
          let persistentId = issue.get("persistentId");
          let resolvePath = `/api/events/${persistentId}/replenish`;
          return ajax(resolvePath, {
            method: "POST",
            contentType: "form" //superagent forum url encoded
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

        getTopItems: function() {
            var topItems = basePath + "/work/topitems";
            return ajax(topItems);
        },
        getFilters: function() {
            var filtersUrl = basePath + "/filters";
            return ajax(filtersUrl);
        },

        importFile: function(path, formData) {
            let importPath = basePath + "/import/" + path;
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
        findImportReceipts: function(filter) {
            var receiptPath = basePath + "/import";
            return ajax(receiptPath, {
                    data: filter
            });
        },
        getMetrics() {
            var metricUrl = basePath + "/metrics";
            return ajax(metricUrl);
        },

        computeMetrics(date) {
            var metricUrl = basePath + "/metrics";
            return ajax(metricUrl, {
                method: "POST",
                data: {date: date},
                contentType: "form"
            });
        },

        computeWorkInstructions(cheName, containerArray) {
          let wiComputePath = basePath + "/ches/" + cheName + "/workinstructions/compute";
          return ajax(wiComputePath, {
            method: "POST",
            data: {
              containers: containerArray.join(",")
            },
            contentType: "form",
            accept: "application/json"
          });

        },

        createEvent(cheName, workerId, type, createTime) {
          let eventPath = basePath + "/ches/" + cheName + "/events";
          return ajax(eventPath, {
            method: "POST",
            data: {
              workerId: workerId,
              type: type,
              created: createTime
            },
            contentType: "form",
            accept: "text/plain"
          });
        },

        getEventPurposes() {
          var pickRatePurposesUrl = basePath + "/pickrate/search";
          return ajax(pickRatePurposesUrl, {
          });
        },

        getPickRates: (filter) => {
            var pickRateUrl = basePath + "/pickrate";
            return ajax(pickRateUrl, {
                data: filter
            });
        },

        executeTestFunction(functionName, parameters) {
            let testFunction = basePath + "/test/" + functionName;
            return ajax(testFunction, {
                method: "POST",
                data: parameters,
                contentType: "form",
                accept: "text/plain"
            });
        },

        processPickScript: function(formData) {
            var runpickscript = basePath + "/process_script";
            return ajax(runpickscript, {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false
            });
        },
        runScriptStep: function(formData, stepId, timeout) {
            //jquery ajax allows data to be one object (which we are using for formdata)
            var runpickscript = basePath + "/run_script";
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
        },
        addScheduledJob(params) {
            return addResource(basePath + "/scheduledjobs", params);
        },
        getScheduledJobs() {
            return ajax(basePath + "/scheduledjobs");
        },
        findSchedule(type) {
            return ajax(basePath + "/scheduledjobs/" + type + "/schedule");
        },

        triggerSchedule(type) {
            return ajax(basePath + "/scheduledjobs/" + type + "/trigger", {
                method: "POST",
                contentType: "form"
            });
        },

        cancelJob(type) {
            return ajax(basePath + "/scheduledjobs/" + type + "/cancel", {
                method: "POST",
                contentType: "form"
            });
        },

        deleteJob(type) {
            return ajax(basePath + "/scheduledjobs/" + type, {
                method: "DELETE"
            });
        },

        updateSchedule(type, schedule) {
            return ajax(basePath + "/scheduledjobs/" + type + "/schedule", {
                method: "POST",
                data: schedule,
                contentType: "form"
            });

        }

    };
};
