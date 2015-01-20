var v1 = {"runsByGroup":{"undefined":[
{"id":"2015-01-15 00:44:06.740+0000","groupId":"undefined","cheId":"7225dcb1-5953-48c2-b450-7399b0772f25","groupDomainId":"undefined","cheDomainId":"CHE-00000021","invalid":0,"inprogress":0,"complete":8,"revert":0,"new":0,"short":1},
{"id":"2015-01-15 00:38:02.235+0000","groupId":"undefined","cheId":"7225dcb1-5953-48c2-b450-7399b0772f25","groupDomainId":"undefined","cheDomainId":"CHE-00000021","invalid":0,"inprogress":0,"complete":0,"revert":0,"new":0,"short":1},
{"id":"2015-01-15 00:31:29.653+0000","groupId":"undefined","cheId":"7225dcb1-5953-48c2-b450-7399b0772f25","groupDomainId":"undefined","cheDomainId":"CHE-00000021","invalid":0,"inprogress":0,"complete":8,"revert":0,"new":0,"short":1}]}};

var React = require('react');
var timeformat = require("helpers/timeformat");
var _ = require('lodash');

function toProgressBarData(run) {
    if (_.has(run, "id")) { //id was a field in the first version.
    //After V11+ is widely deployed this can be removed;
        return fromV1Summary(run);
    }

    var progressbarData = {};
    var numCompleted, numShorted, numNew;
    var total;
    progressbarData["label"] = timeformat(run["assignedTime"]);
    progressbarData["numCompleted"] = numCompleted = run["completeCount"];
    progressbarData["numShorted"] = numShorted = run["shortCount"];
    progressbarData["numNew"] = numNew = run["newCount"];
    progressbarData["total"] = total = numCompleted + numShorted + numNew;
    progressbarData["percentCompleted"] = (numCompleted/total * 100).toFixed(0);
    progressbarData["percentShorted"] = (numShorted/total * 100).toFixed(0);
    progressbarData["percentNew"] = (numNew/total * 100).toFixed(0);
    progressbarData["completeTitle"] = numCompleted + ' Complete';
    progressbarData["shortTitle"] = numShorted + ' Short';
    progressbarData["remainingTitle"] = numNew + ' Remaining';
    return progressbarData;

}

function fromV1Summary(run) {
    var progressbarData = {};
    var numCompleted, numShorted, numNew;
    var total;
    progressbarData["label"] = timeformat(run["id"]);
    progressbarData["numCompleted"] = numCompleted = run["complete"];
    progressbarData["numShorted"] = numShorted = run["short"];
    progressbarData["numNew"] = numNew = run["new"];
    progressbarData["total"] = total = numCompleted + numShorted + numNew;
    progressbarData["percentCompleted"] = (numCompleted/total * 100).toFixed(0);
    progressbarData["percentShorted"] = (numShorted/total * 100).toFixed(0);
    progressbarData["percentNew"] = (numNew/total * 100).toFixed(0);
    progressbarData["completeTitle"] = numCompleted + ' Complete';
    progressbarData["shortTitle"] = numShorted + ' Short';
    progressbarData["remainingTitle"] = numNew + ' Remaining';
    return progressbarData;

}
var ActiveRun = React.createClass({
    render: function() {
        var run = this.props.run;
        console.log("Rendering run", run);
        var {
            label,
            numCompleted,
            numShorted,
            numNew,
            total,
            percentCompleted,
            percentShorted,
            percentNew,
            completeTitle,
            shortTitle,
            remainingTitle} = toProgressBarData(run);
       if (numNew <= 0) {
           return (<div></div>);
       } else {
	       return (
	                <div style={{display: "table", width: "100%"}} >
	                    <div style={{display: "table-cell", width: 32, padding:10, whiteSpace: "nowrap"}}>{label}</div>
	                    <div className="progress burndown" title={remainingTitle} style={{display: "table-cell"}}>
	                        <div className="progress-bar progress-bar-completed" title={completeTitle} role="progressbar" aria-valuenow={numCompleted} aria-valuemin="0" aria-valuemax="100" style={{width: percentCompleted+"%"}}>
	                            <span className="sr-only">{completeTitle}</span>
	                        </div>
	                        <div className="progress-bar progress-bar-shorted" title={shortTitle} role="progressbar" aria-valuenow={numShorted} aria-valuemin="0" aria-valuemax="100" style={{width: percentShorted+"%"}}>
	                            <span className="sr-only">{shortTitle}</span>
	                        </div>
	                    </div>
	                </div>
	        );

       }

    }

});

ActiveRun.isActive = function(run) {
    var hasNew = run["new"] || run["newCount"];
    return hasNew > 0;
};

ActiveRun.getId = function(run) {
    return  run["id"] //prior to V11 runs had an "id" field
        || (run['assignedTime'] + ":" + run['cheId']);
};

module.exports = ActiveRun;
