goog.provide('codeshelf.websession');
goog.require('codeshelf.templates');
goog.require('soy');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.net.WebSocket');
goog.require('goog.json');

var codeshelfWebsession = {};

codeshelf.websession.CommandType = {
	LAUNCH_CODE:'LAUNCH_CODE',
	LAUNCH_CODE_RESULT:'LAUNCH_CODE_RESULT'
};

codeshelf.websession.initWebSocket = function () {

	codeshelfWebsession.pendingCommands = new Object();

	/**
	 * Strategy for reconnection that backs off linearly with a 1 second offset.
	 * @return {number} The amount of time to the next reconnect, in milliseconds.
	 */

	codeshelfWebsession.attempt = 0;
	function linearBackOff() {
		return (codeshelfWebsession.attempt++ * 1000) + 1000;
	}

	var websocket = new goog.net.WebSocket(true, linearBackOff);
	codeshelfWebsession.handler = new goog.events.EventHandler();
	codeshelfWebsession.handler.listen(websocket, goog.net.WebSocket.EventType.ERROR, codeshelf.websession.onError);
	codeshelfWebsession.handler.listen(websocket, goog.net.WebSocket.EventType.OPENED, codeshelf.websession.onOpen);
	codeshelfWebsession.handler.listen(websocket, goog.net.WebSocket.EventType.CLOSED, codeshelf.websession.onClose);
	codeshelfWebsession.handler.listen(websocket, goog.net.WebSocket.EventType.MESSAGE, codeshelf.websession.onMessage);

	try {
		if (!websocket.isOpen()) {
			websocket.open('ws://127.0.0.1:8080');
		}
	} catch (e) {
		//
	}
	return websocket;
}

codeshelf.websession.createCommand = function (commandType, data) {
	var command = {
		id:  goog.events.getUniqueId('cmdid'),
		type:commandType,
		data:data
	}
	return command;
}

codeshelf.websession.sendCommand = function (command, callbackFunction) {


	//goog.events.listen(codeshelfWebsession.handler, command.id, responseFunction);
	//codeshelfWebsession.handler.dispatchEvent(command.id);
	//goog.events.unlisten(codeshelfWebsession.handler, command.id, responseFunction);

	// Attempt to send the command.
	try {
		if (!codeshelfApp.websocket.isOpen()) {
			Alert('WebSocket not open: try again later');
		} else {
			// Put the pending command callback function in the map.
			codeshelfWebsession.pendingCommands[command.id] = callbackFunction;

			codeshelfApp.websocket.send(goog.json.serialize(command));
		}
	} catch (e) {

	}
}

codeshelf.websession.onError = function () {
	//alert('Error');
}

codeshelf.websession.onOpen = function () {
	//alert('Open');
}

codeshelf.websession.onClose = function () {
	//alert('Close');
}

codeshelf.websession.onMessage = function (messageEvent) {
//	alert('Message:' + messageEvent.message);

	command = goog.json.parse(messageEvent.message);

	callbackFunction = codeshelfWebsession.pendingCommands[command.id];
	if (callbackFunction != null) {
		callbackFunction(command);
	}
}
