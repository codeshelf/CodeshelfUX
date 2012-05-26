/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: application.js,v 1.12 2012/05/26 03:48:26 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.application');
goog.require('codeshelf.launch');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.websession');
goog.require('goog.dom');

codeshelf.application = function() {

	var webSession_;
	var launchWindow_;
	var organization_;
	var thisApplication_;

	thisApplication_ = {

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
			webSession_.initWebSocket(thisApplication_);
			thisApplication_.initApplication_();
		},

		restartApplication: function(reason) {
			if (reason !== undefined) {
				alert('Application restarted: ' + reason + '.');
			}
			thisApplication_.initApplication_();
		},

		initApplication_: function() {
			// Remove all markup from the URL - we'll build it from the app itself.
			goog.dom.removeChildren(goog.dom.getDocument().body);
			launchWindow_ = codeshelf.launchWindow();
			launchWindow_.enter(thisApplication_, webSession_);

			// Cause automatic login to save on test time.
			setTimeout(function() {
//				launchWindow_.launchCodeCheck();
			}, 1250);
		}
	};

	return thisApplication_;
};

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

// Launch the application.
var application = codeshelf.application();
application.startApplication();

