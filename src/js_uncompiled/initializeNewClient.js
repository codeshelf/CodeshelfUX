/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: initializeNewClient.js,v 1.1 2012/04/10 08:01:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.initializenewclient');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

codeshelf.initializenewclient = function () {

	var websession_;
	var organization_;
	var facilityPersistentId_;
	var thisInitializeNewClient_;

	thisInitializeNewClient_ = {
		start:function (websession, organization, parentFrame) {
			websession_ = websession;
			organization_ = organization;
			var position = {};
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(thisInitializeNewClient_.posSucceed, thisInitializeNewClient_.posFail);
			} else {
				thisInitializeNewClient_.posFail();
			}
		},

		posSucceed:function (position) {
			var data = {
				parentClassName:   codeshelf.domainobjects.organization.classname,
				parentPersistentId:organization.persistentId,
				className:         codeshelf.domainobjects.facility.classname,
				propertyNames:     [
					{DomainId:'F1'},
					{Description:'First Facility'},
					{PosType:'GPS'},
					{PosX:position.coords.latitude},
					{PosY:position.coords.longitude}
				]
			}

			var newFacilityCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_CREATE_REQ, data);
			websession_.sendCommand(newFacilityCmd, thisInitializeNewClient_.websocketCmdCallback(kWebSessionCommandType.OBJECT_CREATE_RESP), false);
		},

		posFail:function (error) {
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

			var data = {
				parentClassName:   codeshelf.domainobjects.organization.classname,
				parentPersistentId:organization_.persistentId,
				className:         codeshelf.domainobjects.facility.classname,
				properties:        [
					{name:'DomainId', value:'F1'},
					{name:'Description', value:'First Facility'},
					{name:'PosTypeByStr', value:'GPS'},
					{name:'PosX', value:37.717198},
					{name:'PosY', value:-121.517029},
				]
			}

			var newFacilityCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_CREATE_REQ, data);
			websession_.sendCommand(newFacilityCmd, thisInitializeNewClient_.websocketCmdCallback(kWebSessionCommandType.OBJECT_CREATE_RESP), false);
		},

		websocketCmdCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else if (command.type == kWebSessionCommandType.OBJECT_CREATE_RESP) {

					}
				},
				getExpectedResponseType:function () {
					return expectedResponseType_;
				}
			}

			return callback;
		}

	}

	return thisInitializeNewClient_;
}