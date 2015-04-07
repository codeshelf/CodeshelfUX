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

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(type,command) {
				if (command.status == 'Success') {
					websession_.setState(kWebsessionState.VALIDATED);
					application_.setOrganization(command['organization']);
					var user = command['user'];
					var email = user['username'];
					var authz = new codeshelf.Authz();
					var permissions = command['permissions'];

					authz.setPermissions(permissions);
					// translate permissions (could also change existing checks)
					if(authz.hasPermission("facility:edit")) {
						permissions.push("*"); // "configure@" or "simulate@" user
					}
					else if(authz.hasPermission("inventory:edit")) {
						permissions.push(["*:view"]); 
						permissions.push("item:edit"); // "work@" user  
					}
					else if(authz.hasPermission("ux")) {
						permissions.push(["*:view"]); // all logged in users
					}
					// no special translation for "che@" user ("che:simulate" permission exists on app server)
					authz.setPermissions(permissions);
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
                    websession_.login(userIdInput.value, passwordInput.value).done(function(response){
					    self.exit();
					    var mainpage = codeshelf.mainpage();
					    mainpage.enter(application_, websession_);
                    }).fail(function(response){
                        logger_.info("Login failed");
                        console.log("login failed: ", response);
                    });
				}
			};

			userIdInput.focus();
			userIdInput.select();
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
			goog.dom.removeChildren(goog.dom.getDocument()['body']);
		}
	};

	return self;
};
