/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ *  $Id: application.js,v 1.24 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.application');
goog.require('codeshelf.login');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.websession');
goog.require('domainobjects');
goog.require('goog.dom');
goog.require('goog.net.WebSocket');

'use strict';

var codeshelf = codeshelf || {}; // Identifies this file as the codeshelf base.

codeshelf.application = function() {

	var webSession_;
	var loginWindow_;
	var organization_;
	var self;

	function initApplication() {
		gWindowList = [];
		gXPosOffset = 0;
		gYPosOffset = 0;
		gFocusedWindow = 0;

		// Remove all markup from the URL - we'll build it from the app itself.
		goog.dom.removeChildren(goog.dom.getDocument()['body']);
		loginWindow_ = codeshelf.loginWindow();
		loginWindow_.enter(self, webSession_);

		// Cause automatic login to save on test time.
		setTimeout(function() {
//			loginWindow_.launchCodeCheck();
		}, 1250);
	}

	/**
     * @type {goog.net.WebSocket}
     */
	function createWebSocket() {
		var connectAttempts = 0;

		function linearBackOff() {
				if (connectAttempts < 10) {
					connectAttempts++;
				}
				return (connectAttempts * 1000);
			}

		return new goog.net.WebSocket(true, linearBackOff);
	}

	self = {

		getWebsession: function() {
			return webSession_;
		},

		setWebsession: function(webSession) {
			webSession_ = webSession;
		},

		getOrganization: function() {
			return organization_;
		},

		setOrganization: function(organization) {
			organization_ = organization;
		},

		startApplication: function() {
			webSession_ = codeshelf.websession();
			webSession_.initWebSocket(self, createWebSocket());
			initApplication();
		},

		restartApplication: function(reason) {
			if (reason != null) {
				alert('Application restarted: ' + reason + '.');
			}
			initApplication();
		}
	};

	return self;
};

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function launchDebugWindow() {
	var debugWindow = new goog.debug.FancyWindow('main');
	debugWindow.setEnabled(true);
	debugWindow.init();
}
goog.exportSymbol('launchDebugWindow', launchDebugWindow);

var gWindowList = [];
var gXPosOffset = 0;
var gYPosOffset = 0;
var gFocusedWindow = 0;

// Launch the application.
var application = codeshelf.application();
application.startApplication();

angular.module("codeshelfApp").factory('websession', function () {
		return application.getWebsession();
	});
