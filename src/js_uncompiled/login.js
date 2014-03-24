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
//goog.require('arrowlets');

codeshelf.loginWindow = function() {

	var logger_ = goog.debug.Logger.getLogger('codeshelf.loginWindow');

	var websession_;
	var application_;

	function loginCheck() {

		var credentialData = {
			'organizationId' : goog.dom.getElement('organizationIdInput').value,
			'userId': goog.dom.getElement('userIdInput').value,
			'password': goog.dom.getElement('passwordInput').value
		};
		var loginCommand = websession_.createCommand(kWebSessionCommandType.LOGIN_REQ, credentialData);
		websession_.sendCommand(loginCommand, websocketCmdCallback(kWebSessionCommandType.LOGIN_RESP), false);
	}

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty(kWebSessionCommandType.LOGIN_RESP)) {
					alert('response has no login result');
				} else {
					if (command['data']['LOGIN_RS'] == 'SUCCEED') {
						websession_.setState(kWebsessionState.VALIDATED);
						application_.setOrganization(command['data']['organization']);
						self.exit();
						var mainpage = codeshelf.mainpage();
						mainpage.enter(application_, websession_);
					} else {
						alert('Login invalid');
					}
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
			roundedLoginPanel.decorate(loginPanel);

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
