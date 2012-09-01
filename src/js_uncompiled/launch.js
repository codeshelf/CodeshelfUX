/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: launch.js,v 1.29 2012/09/01 23:56:32 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.launch');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.ui.RoundedPanel');
//goog.require('arrowlets');

codeshelf.launchWindow = function() {

	var websession_;
	var application_;

	function launchCodeCheck() {
//			var launchCodeInput = {
//				'launchCode': 'O1'
//			}
//			var launchCommand = websession_.createCommand(kWebSessionCommandType.LAUNCH_CODE_CHECK, launchCodeInput);
//			var requestA = WebSessionA(websession_, launchCommand, kWebSessionCommandType.LAUNCH_CODE_RESP);
//			var progressA = requestA.next(Repeat).repeat().run();

		var launchCodeInput = {
			'launchCode': goog.dom.getElement('launchCodeInput').value
		}
		var launchCommand = websession_.createCommand(kWebSessionCommandType.LAUNCH_CODE_CHECK, launchCodeInput);
		websession_.sendCommand(launchCommand, websocketCmdCallback(kWebSessionCommandType.LAUNCH_CODE_RESP), false);
	}

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty(kWebSessionCommandType.LAUNCH_CODE_RESP)) {
					alert('response has no launch code result');
				} else {
					if (command['d']['LAUNCH_CODE_RS'] == "SUCCEED") {
						websession_.setState(kWebsessionState.VALIDATED);
						application_.setOrganization(command['d']['organization']);
						self.exit();
						var mainpage = codeshelf.mainpage();
						mainpage.enter(application_, websession_);
					} else {
						alert('Lauch code invalid');
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

			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.launchCodeDialog));
			var launchCodeInput = goog.dom.getElement('launchCodeInput');

			// Set the dimensions of the panel and decorate roundedPanel.
			var radius = 25;
			var borderWidth = 5;
			var borderColor = '#a0a0a0'; //launchCodeInput.borderColor;
			var backgroundColor = '#d0d0d0'; //launchCodeInput.backgroundColor;
			var corners = 15;
			var roundedLaunchCodePanel = goog.ui.RoundedPanel.create(radius, borderWidth, borderColor, backgroundColor, corners);
			var launchCodePanel = goog.dom.getElement('launchCodePanel');
			roundedLaunchCodePanel.decorate(launchCodePanel);

			//launchCodeInput.onchange = launchCodeCheck;
			launchCodeInput.onkeydown = function(event) {
				if (event.keyCode == 13) {
					launchCodeCheck();
				}
			}
			launchCodeInput.focus();
			launchCodeInput.select();
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
			goog.dom.removeChildren(goog.dom.getDocument().body);
		}
	};

	return self;
};
