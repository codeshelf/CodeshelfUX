/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: login.js,v 1.2 2013/03/15 23:54:29 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.login');
goog.require('codeshelf.mainpage');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.style');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.window');

codeshelf.loginWindow = function() {

	var logger_ = goog.debug.Logger.getLogger('codeshelf.loginWindow');

	var websession_;
	var application_;

	function loginCheck() {
		var loginCommand = {
				'LoginRequest' : {
					'organizationId' : goog.dom.getElement('organizationIdInput').value,
					'userId': goog.dom.getElement('userIdInput').value,
					'password': goog.dom.getElement('passwordInput').value
				}
			};
		websession_.sendCommand(loginCommand, websocketCmdCallback(kWebSessionCommandType.LOGIN_RESP), false);
	}

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(type,command) {
				if (command.status == 'Success') {
					websession_.setState(kWebsessionState.VALIDATED);
					application_.setOrganization(command['organization']);
					var user = command['user'];
					var email = user['email'];
					var authz = new codeshelf.Authz();
					if (email.indexOf('configure') == 0) {
						authz.setPermissions(["*"]);
					} else if (email.indexOf('view') == 0
							   || email == 'a@example.com') {
						authz.setPermissions(["*:view"]);
					} else if (email.indexOf('simulate') == 0) {
						authz.setPermissions(["*"]);
					} else if (email.indexOf('che') == 0) {
						authz.setPermissions(["*:view", "che:simulate"]);
					} else if (email.indexOf('work') == 0) {
						authz.setPermissions(["*:view", "item:edit"]);
					} else {
						authz.setPermissions([]); // no permissions by default
					}
					authz = Object.freeze(authz); //ECMAScript 5 prevent changes from this point
					websession_.setAuthz(authz);
					self.exit();
					var mainpage = codeshelf.mainpage();

					mainpage.enter(application_, websession_, authz);
				}
			}
		};

		return callback;
	}

	var self = {

		enter: function(application, websession) {

			application_ = application;
			websession_ = websession;

			websession_.setCurrentPage(self);

			goog.dom.appendChild(goog.dom.getDocument()['body'], soy.renderAsElement(codeshelf.templates.loginDialog));
			var organizationIdInput = goog.dom.getElement('organizationIdInput');
			var userIdInput = goog.dom.getElement('userIdInput');
			var passwordInput = goog.dom.getElement('passwordInput');

			// Set the dimensions of the panel and decorate roundedPanel.
			var radius = 25;
			var borderWidth = 5;
			var borderColor = '#a0a0a0'; //userIdInput.borderColor;
			var backgroundColor = '#d0d0d0'; //userIdInput.backgroundColor;
			var corners = 15;
			var roundedLoginPanel = goog.ui.RoundedPanel.create(radius, borderWidth, borderColor, backgroundColor, corners);
			var loginPanel = goog.dom.getElement('loginPanel');
//			roundedLoginPanel.decorate(loginPanel);

			passwordInput.onkeydown = function(event) {
				//logger_.info('Key ' + event.keyCode);
				if ((event.keyCode == 13) || (event == 10)) {
					loginCheck();
				}
			};
			organizationIdInput.focus();
			organizationIdInput.select();
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
			goog.dom.removeChildren(goog.dom.getDocument()['body']);
		}
	};

	return self;
};
