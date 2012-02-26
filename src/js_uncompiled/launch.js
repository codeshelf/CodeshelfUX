goog.provide('codeshelf.launch');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.ui.RoundedPanel');

codeshelf.launchWindow = function () {

	var websession_;
	var application_;
	var thisLaunchWindow_;

	return {

		enter:function (application, websession) {

			application_ = application;
			websession_ = websession;
			thisLaunchWindow_ = this;

			websession_.setCurrentPage(this);

			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.launchCodeDialog));
			var launchCodeInput = goog.dom.getElement('launchCodeInput');

			// Set the dimensions of the panel and decorate roundedPanel.
			var radius = 25;
			var borderWidth = 5;
			var borderColor = '#a0a0a0';//goog.style.getCascadedStyle(launchCodePanel, 'border-color');
			var backgroundColor = '#d0d0d0';//goog.style.getCascadedStyle(launchCodePanel, 'background-color');
			var corners = 15;
			var roundedLaunchCodePanel = goog.ui.RoundedPanel.create(radius, borderWidth, borderColor, backgroundColor, corners);
			var launchCodePanel = goog.dom.getElement('launchCodePanel');
			roundedLaunchCodePanel.decorate(launchCodePanel);

			launchCodeInput.onchange = this.launchCodeCheck;
			launchCodeInput.focus();
			launchCodeInput.select();
		},

		exit:function () {
			websession_.setCurrentPage(undefined);
			goog.dom.removeChildren(goog.dom.getDocument().body);
		},

		launchCodeCheck:function () {
			var launchCodeInput = {
				launchCode:goog.dom.getElement('launchCodeInput').value
			}
			var launchCommand = websession_.createCommand(kWebSessionCommandType.LAUNCH_CODE_CHECK, launchCodeInput);
			websession_.sendCommand(launchCommand, this.webSessionCommandCallback);
		},

		webSessionCommandCallback:function (command) {
			if (!command.hasOwnProperty('type')) {
				alert('response has no type');
			} else {
				if (!command.type == kWebSessionCommandType.LAUNCH_CODE_RESP) {
					alert('response wrong type');
				} else {
					if (!command.hasOwnProperty('data')) {
						alert('reponse has no data');
					} else {
						if (!command.data.hasOwnProperty(kWebSessionCommandType.LAUNCH_CODE_RESP)) {
							alert('response has no launch code result');
						} else {
							if (command.data.LAUNCH_CODE_RESP == "SUCCEED") {
								websession_.setState(kWebsessionState.VALIDATED);
								application_.setOrganization(command.data.organization);
								thisLaunchWindow_.exit();
								var mainpage = codeshelf.mainpage();
								mainpage.enter(application_, websession_);
							} else {
								alert('Lauch code invalid');
							}
						}
					}
				}
			}
		}
	}
}
