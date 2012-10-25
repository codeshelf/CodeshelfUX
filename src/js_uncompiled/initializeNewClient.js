/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: initializeNewClient.js,v 1.17 2012/10/25 08:32:37 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.initializenewclient');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

codeshelf.initializenewclient = function() {

	var websession_;
	var organization_;
	var frame_;
	var facilityWindowLoader_;
	var thisInitializeNewClient_;

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else if (command['type'] == kWebSessionCommandType.OBJECT_METHOD_RESP) {
//						var facility = command['data']['results'];
//						var facilityEditor = codeshelf.facilityeditorview();
//						facilityEditor.start(websession_, organization_, frame_, facility);
				} else if (command['type'] == kWebSessionCommandType.OBJECT_GETTER_RESP) {
					if (command['data']['results'].length !== 0) {
						for (var i = 0; i < command['data']['results'].length; i++) {
							var facility = command['data']['results'][i];
							facilityWindowLoader_(facility);
						}
					}
				}

			}
		}

		return callback;
	}

	function posSucceed(position) {
		createFacility(position.coords.longitude, position.coords.latitude);
	}

	function posFail(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				break;
			case error.POSITION_UNAVAILABLE:
				break;
			case error.TIMEOUT:
				break;
			case error.UNKNOWN_ERROR:
				break;
		}

		// Since we don't know the user's location let's default to the Safeway DC Tracy, CA
		createFacility(-121.517029, 37.717198);

	}

	function createFacility(longitude, latitude) {
		var data = {
			'className':    domainobjects.Organization.className,
			'persistentId': organization_.persistentId,
			'methodName':   'createFacility',
			'methodArgs':   [
				{'name': 'shortDomainId', 'value': 'F1', 'classType': 'java.lang.String'},
				{'name': 'description', 'value': 'First Facility', 'classType': 'java.lang.String'},
				{'name': 'posTypeByStr', 'value': 'GPS', 'classType': 'java.lang.String'},
				{'name': 'posX', 'value': longitude, 'classType': 'java.lang.Double'},
				{'name': 'posY', 'value': latitude, 'classType': 'java.lang.Double'}
			]
		}

		var newFacilityCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
		websession_.sendCommand(newFacilityCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_METHOD_RESP), false);

		var data = {
			'className':    organization_['className'],
			'persistentId': organization_['persistentId'],
			'getterMethod': 'getFacilities'
		}

		// Attempt to reload this new facility.
		var getFacilitiesCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
		websession_.sendCommand(getFacilitiesCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_GETTER_RESP), false);

	}

	thisInitializeNewClient_ = {
		start: function(websession, organization, parentFrame, facilityWindowLoader) {
			websession_ = websession;
			organization_ = organization;
			frame_ = parentFrame;
			facilityWindowLoader_ = facilityWindowLoader;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(posSucceed, posFail);
			} else {
				posFail();
			}
		}
	}

	return thisInitializeNewClient_;
}
