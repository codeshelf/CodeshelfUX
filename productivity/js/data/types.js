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
    }


};
