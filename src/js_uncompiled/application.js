/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: application.js,v 1.22 2012/11/25 21:18:02 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.application');
goog.require('codeshelf.login');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.websession');
goog.require('domainobjects');
goog.require('goog.dom');

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
		goog.dom.removeChildren(goog.dom.getDocument().body);
		loginWindow_ = codeshelf.loginWindow();
		loginWindow_.enter(self, webSession_);

		// Cause automatic login to save on test time.
		setTimeout(function() {
//			loginWindow_.launchCodeCheck();
		}, 1250);
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
			webSession_.initWebSocket(self);
			initApplication();
		},

		restartApplication: function(reason) {
			if (reason !== undefined) {
				alert('Application restarted: ' + reason + '.');
			}
			self.initApplication_();
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

codeshelf.debug = true;

if (codeshelf.debug) {
	var debugWindow = new goog.debug.FancyWindow('main');
	debugWindow.setEnabled(true);
	debugWindow.init();
//	Set this to TRUE in goog.Disposable:  goog.Disposable.ENABLE_MONITORING = true;
}

var gWindowList = [];
var gXPosOffset = 0;
var gYPosOffset = 0;
var gFocusedWindow = 0;

// Launch the application.
var application = codeshelf.application();
application.startApplication();

