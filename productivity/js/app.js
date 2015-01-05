/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');
var Rx = require('rx');

var csapi = require('data/csapi');
var ActivityPage = require('pages/activity');

//synchronous call to get hosts.json
var config = (function(){
    var config = {};
    $.ajax({
        url: "/config/hosts.json",
        success: function(data) {
            config = data;
        },
        async:false
    });
    return config;})();


var endpoint = config["endpoint"];
var el = React.createElement;

csapi.getFacilities(endpoint).then(function(facilities) {
    //Hack to select first found facility
    selectedFaclity(endpoint, facilities[0]);
});



function selectedFaclity(endpoint, facility) {
    var endpointParser = document.createElement('a');
    endpointParser.href = endpoint;


    //Render Che Runs
    var facilityId = facility['persistentId'];
    var organization = {"domainId": endpointParser.hostname};
    var pollerStream = Rx.Observable.timer(0, 5000 /*ms*/);
    //Create stream of productivity updates for the facility
    var productivityStream = pollerStream.flatMapLatest(function() {
        return Rx.Observable.fromPromise(csapi.getProductivity (endpoint, facilityId)).catch(Rx.Observable.empty());
    });

    //Create stream of productivity updates for the facility
    var activeRunsStream = pollerStream.flatMapLatest(function() {
        return Rx.Observable.fromPromise(csapi.getCheRuns(endpoint, facilityId)).catch(Rx.Observable.empty());
    });


    React.render(React.createElement(ActivityPage, {
        organization: organization,
        facility: facility,
        productivityStream: productivityStream,
        activeRunsStream: activeRunsStream
    }),
                 $('#page').get(0));
}
