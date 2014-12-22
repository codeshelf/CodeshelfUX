
var $ = require('jquery');

$.get('/resources/hosts.json').then(function(servers) {
	// extract server hosts
    for (var i = 0; i < servers.length; ++i) {
    	var server = scope.servers[i];
    	// fetch health check status from app servers
    	if (server.roles.indexOf('appserver')>=0 || server.roles.indexOf('sitecontroller')>=0) {
			return csServerStatus(server);
    	}
    	// fetch status from elasticsearch
    	if (server.roles.indexOf('elasticsearch')>=0) {
			return elasticSearchStatus(server);
		}
	}
});

function csServerStatus(server) {
    var hostName = server.host;
	var endpoint = 'https://admin.codeshelf.com/'+hostName;
	$.ajax(endpoint +'/healthchecks').then(function(data) {
		server.healthchecks = [];
		if (Array.isArray(data)) {
			// not implemented yet
			/*
    		 for (i = 0; i < data.length; ++i) {
    		 server.healthchecks.push(data);
    		 }
    		 */
		}
		else {
			for (var hcName in data)  {
        		var status = 'n/a';
        		if (data[hcName].healthy==true) {
        			status = "ok";
        		}
    			else {
        			status = "error";
    			}
				server.healthchecks.push(createHealthCheck(prettyString(hcName), status, data[hcName].message));
			}
		};
		return server;
	}).fail(function(data, status, headers, config) {
    	if (status==500) {
            server.healthchecks = [];
            if (Array.isArray(data)) {
            	// not implemented yet
            	/*
        	     for (i = 0; i < data.length; ++i) {
        	     server.healthchecks.push(data);
        	     }
        	     */
        	}
            else {
            	for (var hcName in data)  {
            		var healthStatus = 'n/a';
            		if (data[hcName].healthy==true) {
            			healthStatus = "ok";
            		}
        			else {
            			healthStatus = "fail";
        			}
                	server.healthchecks.push(createHealthCheck(prettyString(hcName), healthStatus, data[hcName].message));
            	}
            };
        }
    	else {
    		debugger;
	    	server.error = "Failed to connect to server to run health checks.";
    	}
		return server;
    });
}


function elasticSearchStatus(server) {
    var hostName = server.host;
	return $.ajax('https://admin.codeshelf.com/'+hostName+'/_cluster/health').then(function(data) {
        server.healthchecks = [];
        if (data.status=='green') {
        	server.healthchecks.push(createHealthCheck("Elasticsearch Status", "ok", "Elasticsearch is healthy"));
        }
        else {
        	server.healthchecks.push(createHealthCheck("Elasticsearch Status", "error", data.status));
        }
		return server;
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
	}
	return hc;
}
