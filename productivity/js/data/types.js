var _ = require("lodash");

module.exports = {

    "ProductivitySummary": function (groupName, numComplete, numReleased, numInProgress, numShorts) {
        var groupData = {
            "groups": {}
        };
        groupData["groups"][groupName] = {
            "complete" : numComplete,
            "released" : numReleased,
            "inprogress" : numInProgress,
            "short" : numShorts
        };
        return groupData;
    },
    "RunSummary": function(groupName, assignedTime, numComplete, numNew, numShorts ) {
        var runSummary = {
            runsByGroup: {}
        };

        var runData = {"cheId":"38a87216-73b6-47cb-a126-aa8e434488b3",
                       "cheDomainId":"CHE6",
                       "assignedTime":assignedTime,
                       "formattedAssignedTime":"Jan_06",
                       "shortCount":numShorts,
                       "invalidCount":0,
                       "newCount":numNew,
                       "inprogressCount":0,
                       "completeCount": numComplete,
                       "revertCount":0,
                       "activeCount":0,
                       "active":false};
        runSummary['runsByGroup'][groupName] = [runData];
        return runSummary;
    },
    "StatusSummary" : {
        "StatusEnum": ["released", "inprogress", "complete", "short"],
        "shortCount" : function(statusSummary) {
            return statusSummary["short"];
        },
        "sumByKeys" : function(statusSummary, keys) {
            //todo validate keys with StatusEnum
            return _.reduce(keys, function(sum, key){
                return sum + statusSummary[key];
            }, 0);
        }
    }
};
