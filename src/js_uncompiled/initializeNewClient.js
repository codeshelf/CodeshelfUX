/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: initializeNewClient.js,v 1.21 2012/11/19 10:47:24 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.initializenewclient');
goog.require('codeshelf.sessionGlobals');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');

codeshelf.initializenewclient = function() {

	var websession_;
	var organization_;
	var facilityWindowLoader_;
	var thisInitializeNewClient_;

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(type,command) {
				if (type == kWebSessionCommandType.OBJECT_METHOD_RESP) {
					var facility = command['results'];
					codeshelf.sessionGlobals.setFacility(facility);
					facilityWindowLoader_();
				} else if (type == kWebSessionCommandType.OBJECT_GETTER_RESP) {
				}
			}
		};

		return callback;
	}

	function posSucceed(position) {
		createFacility(position.coords.longitude, position.coords.latitude);
	}

	function posFail(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				// At least on MacOS, if user denied Codeshelf permission to use the location, let's not refuse to start. Go with Codeshelf Headquarters location.
				createFacility(-122.2741133, 37.8004643);
				break;
			case error.POSITION_UNAVAILABLE:
				break;
			case error.TIMEOUT:
				break;
			case error.UNKNOWN_ERROR:
				break;
		}
		// Since we don't know the user's location let's default to the Safeway DC Tracy, CA
		//createFacility(-121.517029, 37.717198);
	}

	function createFacility(longitude, latitude) {
		var methodArgs = [
		  				{'name': 'domainId', 'value': 'F1', 'classType': 'java.lang.String'},
						{'name': 'description', 'value': 'First Facility', 'classType': 'java.lang.String'},
						{'name': 'x', 'value': longitude, 'classType': 'java.lang.Double'},
						{'name': 'y', 'value': latitude, 'classType': 'java.lang.Double'}
					];
		var newFacilityCmd = websession_.createObjectMethodRequest(domainobjects['Organization']['className'],organization_['persistentId'],'createFacilityUi',methodArgs);
		websession_.sendCommand(newFacilityCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_METHOD_RESP), false);
	}

	thisInitializeNewClient_ = {
		start: function(websession, organization, facilityWindowLoader) {
			websession_ = websession;
			organization_ = organization;
			// frame_ = parentFrame;
			facilityWindowLoader_ = facilityWindowLoader;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(posSucceed, posFail);
			} else {
				posFail();
			}
		}
	};

	return thisInitializeNewClient_;
};
