/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: initializeNewClient.js,v 1.16 2012/10/16 06:23:22 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.initializenewclient');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

codeshelf.initializenewclient = function() {

	var websession_;
	var frame_;
	var organization_;
	var facilityPersistentId_;
	var thisInitializeNewClient_;

	thisInitializeNewClient_ = {
		start: function(websession, organization, parentFrame) {
			websession_ = websession;
			organization_ = organization;
			frame_ = parentFrame;
			var position = {};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(thisInitializeNewClient_.posSucceed, thisInitializeNewClient_.posFail);
			} else {
				thisInitializeNewClient_.posFail();
			}
		},

		posSucceed: function(position) {
			thisInitializeNewClient_.createFacility(position.coords.longitude, position.coords.latitude);
		},

		posFail: function(error) {
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
			thisInitializeNewClient_.createFacility(-121.517029, 37.717198);

		},

		createFacility: function(longitude, latitude) {
			var data = {
				'className':    domainobjects.Organization.className,
				'persistentId': organization_.persistentId,
				'methodName':   'createFacility',
				'methodArgs':         [
					{'name': 'shortDomainId', 'value': 'F1', 'classType' : 'java.lang.String'},
					{'name': 'description', 'value': 'First Facility', 'classType' : 'java.lang.String'},
					{'name': 'posTypeByStr', 'value': 'GPS', 'classType' : 'java.lang.String'},
					{'name': 'posX', 'value': longitude, 'classType' : 'java.lang.Double'},
					{'name': 'posY', 'value': latitude, 'classType' : 'java.lang.Double'}
				]
			}

			var newFacilityCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
			websession_.sendCommand(newFacilityCmd, thisInitializeNewClient_.websocketCmdCallback(kWebSessionCommandType.OBJECT_METHOD_RESP), false);
		},

		websocketCmdCallback: function(expectedResponseType) {
			var callback = {
				exec:                    function(command) {
					if (!command['data'].hasOwnProperty('results')) {
						alert('response has no result');
					} else if (command['type'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
						var facility = command['data']['results'];
						var facilityEditor = codeshelf.facilityeditorview();
						facilityEditor.start(websession_, organization_, frame_, facility);
					}
				}
			}

			return callback;
		}

	}

	return thisInitializeNewClient_;
}
