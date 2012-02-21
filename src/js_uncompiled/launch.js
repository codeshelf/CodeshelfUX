goog.provide('codeshelf.launch');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('codeshelf.mainpage');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.net.WebSocket');
goog.require('goog.json');

codeshelf.launch.enterLaunchWindow = function () {
//	var doc = goog.dom.getDocument();
//	doc.write('<img id="background_image" class="background_image" src="../src/images/STS-125.jpg" alt=""/>');
//	doc.write('<div id="launchCodePanel"></div>');
//	var launchDiv = goog.dom.getElement('launchCodePanel');
//	launchDiv.write('<div class="goog-roundedpanel-content"></div>');

//	var backgroundImageElement = goog.dom.createDom('img', {'id':'background_image', 'class':'background_image', 'src':'../src/images/STS-125.jpg', 'alt':''}, null);
//	goog.dom.appendChild(goog.dom.getDocument().body, backgroundImageElement);

	// Create DOM structure to represent the launch code.
	//var launchCode = goog.dom.createDom('div', {'id':'launchCodeLabel'}, launchCodePanelContent);
//	var launchCodeInput = goog.dom.createDom('input', {'type':'text', 'id':'launchCodeInput', 'class':'dataEntry'}, null);
//	var launchCodeLabel = goog.dom.createDom('div', {'id':'launchCodeLabel', 'class':'dataEntry'}, 'Launch Code:', launchCodeInput);
//	var launchCodePanelContent = goog.dom.createDom('div', {'class':'goog-roundedpanel-content'}, launchCodeLabel);
//	launchCodeLabel.style.marginTop = '15px';
//	launchCodeLabel.style.marginLeft = '15px';
//
//	var launchCodePanel = goog.dom.createDom('div', {'id':'launchCodePanel'}, launchCodePanelContent);
//	goog.dom.appendChild(goog.dom.getDocument().body, launchCodePanel);

	//goog.dom.getDocument().body.innerHTML += codeshelf.templates.launchCodeDialog();
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

	launchCodeInput.onchange = codeshelf.launch.launchCodeCheck;
	launchCodeInput.focus();
	launchCodeInput.select();
}

codeshelf.launch.exitLaunchWindow = function () {
	goog.dom.removeChildren(goog.dom.getDocument().body);
	codeshelf.mainpage.launch();
}

codeshelf.launch.launchCodeCheck = function () {
	var launchCodeInput = {
		launchCode:goog.dom.getElement('launchCodeInput').value
	}
	var launchCommand = codeshelf.websession.createCommand(codeshelf.websession.CommandType.LAUNCH_CODE, launchCodeInput);
	codeshelf.websession.sendCommand(launchCommand, codeshelf.launch.webSessionCommandCallback);
}

codeshelf.launch.webSessionCommandCallback = function (command) {
	if (!command.hasOwnProperty('type')) {
		alert('response has no type');
	} else {
		if (!command.type == codeshelf.websession.LAUNCH_CODE_RESP) {
			alert('response wrong type');
		} else {
			if (!command.hasOwnProperty('data')) {
				alert('reponse has no data');
			} else {
				if (!command.data.hasOwnProperty(codeshelf.websession.CommandType.LAUNCH_CODE_RESP)) {
					alert('response has no launch code result');
				} else {
					if (command.data.LAUNCH_CODE_RESP == "SUCCEED") {
						codeshelfWebsession.state = codeshelf.websession.State.VALIDATED;
						codeshelf.launch.exitLaunchWindow();
					} else {
						alert('Lauch code invalid');
					}
				}
			}
		}
	}
}
