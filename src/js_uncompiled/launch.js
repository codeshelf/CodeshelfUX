/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: launch.js,v 1.28 2012/08/31 00:48:34 jeffw Exp $
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
	var thisLaunchWindow_;

	thisLaunchWindow_ = {

		enter: function(application, websession) {

			application_ = application;
			websession_ = websession;

			websession_.setCurrentPage(thisLaunchWindow_);

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

			//launchCodeInput.onchange = thisLaunchWindow_.launchCodeCheck;
			launchCodeInput.onkeydown = function(event) {
				if (event.keyCode == 13) {
					thisLaunchWindow_.launchCodeCheck();
				}
			}
			launchCodeInput.focus();
			launchCodeInput.select();
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
			goog.dom.removeChildren(goog.dom.getDocument().body);
		},

		launchCodeCheck: function() {
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
			websession_.sendCommand(launchCommand, thisLaunchWindow_.websocketCmdCallback(kWebSessionCommandType.LAUNCH_CODE_RESP), false);
		},

		websocketCmdCallback: function(expectedResponseType) {
			var callback = {
				exec:                    function(command) {
					if (!command['d'].hasOwnProperty(kWebSessionCommandType.LAUNCH_CODE_RESP)) {
						alert('response has no launch code result');
					} else {
						if (command['d']['LAUNCH_CODE_RS'] == "SUCCEED") {
							websession_.setState(kWebsessionState.VALIDATED);
							application_.setOrganization(command['d']['organization']);
							thisLaunchWindow_.exit();
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

	};

	return thisLaunchWindow_;
};
