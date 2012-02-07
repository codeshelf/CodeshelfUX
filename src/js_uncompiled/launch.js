goog.provide('codeshelf.launch');
goog.require('codeshelf.templates');
goog.require('soy');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.math.Size');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.net.WebSocket');
goog.require('goog.json');

function enterLaunchWindow() {
//	var doc = goog.dom.getDocument();
//	doc.write('<img id="background_image" class="background_image" src="../src/images/STS-125.jpg" alt=""/>');
//	doc.write('<div id="launchCodePanel"></div>');
//	var launchDiv = goog.dom.getElement('launchCodePanel');
//	launchDiv.write('<div class="goog-roundedpanel-content"></div>');

	var backgroundImageElement = goog.dom.createDom('img', {'id':'background_image', 'class':'background_image', 'src':'../src/images/STS-125.jpg', 'alt':''}, null);
	goog.dom.appendChild(goog.dom.getDocument().body, backgroundImageElement);

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

	launchCodeInput.onchange = launchCodeCheck;
}

function initWebSocket() {

	/**
	 * Strategy for reconnection that backs off linearly with a 1 second offset.
	 * @param {number} attempt The number of reconnects since the last connection.
	 * @return {number} The amount of time to the next reconnect, in milliseconds.
	 */

	codeshelfApp.attempt = 0;

	function linearBackOff() {
		return (codeshelfApp.attempt++ * 1000) + 1000;
	}

	var websocket = new goog.net.WebSocket(true, linearBackOff);
	var handler = new goog.events.EventHandler();
	handler.listen(websocket, goog.net.WebSocket.EventType.ERROR, onError);
	handler.listen(websocket, goog.net.WebSocket.EventType.OPENED, onOpen);
	handler.listen(websocket, goog.net.WebSocket.EventType.CLOSED, onClose);
	handler.listen(websocket, goog.net.WebSocket.EventType.MESSAGE, onMessage);

	try {
		if (!websocket.isOpen()) {
			websocket.open('ws://127.0.0.1:8080');
			//while (!websocket.isOpen()) {
			//}
		}
	} catch (e) {
		//
	}
	return websocket;
}

function onError() {
	alert('Error');
}

function onOpen() {
	alert('Open');
}

function onClose() {
	alert('Close');
}

function onMessage(messageEvent) {
	alert('Message:' + messageEvent.message);
}

function exitLaunchWindow() {

}

function launchCodeCheck() {
	var launchCodeInput = goog.dom.getElement('launchCodeInput');
	//alert('Launch code: ' + launchCodeInput.value);

	// Put it into JSON format:
	var launchCommand = {
		id:  0,
		type:'LAUNCH_CODE',
		data:{
			launchCode:launchCodeInput.value
		}
	}
	// Use getUid to get a new UID for this object.
	// (The call mutates the object, but we don't want to send that over the stream, so remove the mutation and just use the ID.)
	launchCommand.id = goog.getUid(launchCommand);
	goog.removeUid(launchCommand);

	// Attempt to send the command.
	try {
		if (!codeshelfApp.websocket.isOpen()) {
			Alert('WebSocket not open: try again later');
		} else {
			codeshelfApp.websocket.send(goog.json.serialize(launchCommand));
		}
	} catch (e) {

	}
}

var codeshelfApp = {};

function initApplication() {
	codeshelfApp.websocket = initWebSocket();
	enterLaunchWindow();
}

initApplication();
