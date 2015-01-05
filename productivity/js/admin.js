var React = require('react');
var $ = require('jquery');
var Rx = require('rx');

var ServerHealthCheck = require('components/serverhealthcheck');
var Breadcrumbs = require('components/breadcrumb');

var Navbar = require('components/nav').Navbar;
var el = React.createElement;

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
var servers = config["hosts"];

var  navMenus =  [
	{"key": "hosts",
	"label": "Hosts",
	"icon": "fa-laptop"}
];
React.render(el(Navbar, {navMenus:navMenus}), $("#nav-container").get(0));

var breadcrumbs = [
	{"label": "Home", "href":"#"	},
	{"label": "Hosts", "href": "#"}
];
React.render(el(Breadcrumbs, {breadcrumbs: breadcrumbs}), $("#pageBreadcrumb").get(0));


var statusStream = Rx.Observable.timer(0, 10000 /*ms*/).flatMapLatest(function() {
	return Rx.Observable.just(toStatuses(servers));
});

var subscription = statusStream.subscribe(function(statuses) {
	var healthcheckComponents = toHealthCheckComponents(statuses);
	var div = React.createElement("div", {className: "row orderdetails"}, healthcheckComponents);
	React.render(div, $('.wrapper-content').get(0));
});









function toStatuses(servers) {
	var statuses = [];
	for (var i = 0; i < servers.length; ++i) {
		var server = servers[i];
		// fetch health check status from app servers
		var statusPromise = null;
		if (server.roles.indexOf('appserver')>=0 || server.roles.indexOf('sitecontroller')>=0) {
			statusPromise = csServerStatus(server);
		}
		// fetch status from elasticsearch
		if (server.roles.indexOf('elasticsearch')>=0) {
			statusPromise = elasticSearchStatus(server);
		}
		statusPromise.then(function(healthchecks) {
			statuses.push(
				{server: server,
   				 healthchecks: healthchecks
				});
		}).fail(function(data, status, headers, config) {
			if (status != 500) {
				statuses.push({
					server: server,
					healthchecks: [],
					error: "Failed to connect to server to run health checks"
				});
			}
		});

	}
	return statuses;
}


function toHealthCheckComponents(statuses) {
	var	statusComponents = [];
	for(var i = 0; i < statuses.length; i++) {
		var status = statuses[i];
		var statusIBox = React.createElement(ServerHealthCheck, status);
		var colDiv = React.createElement("div", {className: "col-lg-3"}, statusIBox);

		statusComponents.push(colDiv);
	}
	return statusComponents;
}

function csServerStatus(server) {
    var hostName = server.host;
	var endpoint = 'https://admin.codeshelf.com/'+hostName;
	return $.ajax({
			url: endpoint +'/healthchecks',
			async: false  //TEMP
		}).then(function(data) {
			var healthchecks = [];
			for (var hcName in data)  {
        		var status = 'n/a';
        		if (data[hcName].healthy==true) {
        			status = "ok";
        		}
    			else {
        			status = "error";
    			}
				healthchecks.push(createHealthCheck(prettyString(hcName), status, data[hcName].message));
			}
			return healthchecks;
		});
}


function elasticSearchStatus(server) {
    var hostName = server.host;
	return $.ajax({
			url: 'https://admin.codeshelf.com/'+hostName+'/_cluster/health',
			async: false //TEMP
		}).then(function(data) {
			var healthchecks = [];
			if (data.status=='green') {
        		healthchecks.push(createHealthCheck("Elasticsearch Status", "ok", "Elasticsearch is healthy"));
			}
			else {
        		healthchecks.push(createHealthCheck("Elasticsearch Status", "error", data.status));
			}
			return healthchecks;
		});
}

function prettyString(str) {
	str = str.replace('-', ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function createHealthCheck(name, status, message) {
	var hc = {
		'name' : name,
		'status' : status,
		'message' : message
	};
	return hc;
}
