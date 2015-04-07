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
goog.require('goog.net.Cookies');

codeshelf.loginWindow = function() {

	var logger_ = goog.debug.Logger.getLogger('codeshelf.loginWindow');

	var websession_;
	var application_;

	var self = {

        handleLoginSuccessful: function() {
			self.exit();
			var mainpage = codeshelf.mainpage();
			mainpage.enter(application_, websession_);
        },

		enter: function(application, websession) {

			application_ = application;
			websession_ = websession;

			websession_.setCurrentPage(self);

            var cookies_ = new goog.net.Cookies(document);
            var cstoken = cookies_.get("CSTOK");
            websession_.loginWSToken(cstoken).done(function() {
                self.handleLoginSuccessful();
            }).fail(function() {
                logger_.info("cookie ws login failed");
                if (location.port == '8000') {
                    console.log("redirecting to cs companion login");
                    location.replace("/login?nextPath=" + encodeURIComponent(location.href));
                }
            });


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
                        self.handleLoginSuccessful();
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
