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
    "RunSummary": function(groupName, runLabel, numComplete, numInProgress, numShorts ) {
        var runSummary = {
            runsByGroup: {}
        };
        runSummary['runsByGroup'][groupName] = [{
            "id": runLabel,
            "complete": numComplete,
            "inprogress": numInProgress,
            "short": numShorts
        }];
        return runSummary;
    }
};
