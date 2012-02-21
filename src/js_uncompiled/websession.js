goog.provide('codeshelf.websession');
goog.require('codeshelf.templates');
goog.require('soy');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.net.WebSocket');
goog.require('goog.json');

var codeshelfWebsession = {};

if (typeof MozWebSocket != "undefined") {
	var WebSocket = MozWebSocket;
}

codeshelf.websession.CommandType = {
	LAUNCH_CODE:       'LAUNCH_CODE',
	LAUNCH_CODE_RESP:  'LAUNCH_CODE_RESP',
	OBJECT_QUERY_REQ:  'OBJECT_QUERY_REQ',
	OBJECT_QUERY_RESP:  'OBJECT_QUERY_RESP',
	OBJECT_GETBYID_REQ:'OBJECT_GETBYID_REQ',
	OBJECT_GETBYID_RESP:'OBJECT_GETBYID_RESP',
	OBJECT_CREATE_REQ: 'OBJECT_CREATE_REQ',
	OBJECT_CREATE_RESP: 'OBJECT_CREATE_RESP',
	OBJECT_UPDATE_REQ: 'OBJECT_CHANGE_REQ',
	OBJECT_UPDATE_RESP: 'OBJECT_CHANGE_RESP',
	OBJECT_DELETE_REQ: 'OBJECT_DELETE_REQ',
	OBJECT_DELETE_RESP: 'OBJECT_DELETE_RESP'
};

codeshelf.websession.State = {
	UNVALIDATED:'UNVALIDATED',
	VALIDATED:  'VALIDATED'
};

codeshelf.websession.initWebSocket = function () {

	codeshelfWebsession.state = codeshelf.websession.State.UNVALIDATED;
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
//			while (!websocket.isOpen()) {
//				setTimeout(500);
//			}
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
			alert('WebSocket not open: try again later');
		} else {
			// Put the pending command callback function in the map.
			codeshelfWebsession.pendingCommands[command.id] = callbackFunction;

			codeshelfApp.websocket.send(goog.json.serialize(command));
		}
	} catch (e) {

	}
}

codeshelf.websession.onError = function () {
	codeshelfWebsession.state = codeshelf.websession.State.UNVALIDATED;
	codeshelf.application.restartApplication('websocket error');
}

codeshelf.websession.onOpen = function () {

}

codeshelf.websession.onClose = function () {
	codeshelfWebsession.state = codeshelf.websession.State.UNVALIDATED;
	codeshelf.application.restartApplication('websocket closed unexpectedly');
}

codeshelf.websession.onMessage = function (messageEvent) {
	command = goog.json.parse(messageEvent.message);

	callbackFunction = codeshelfWebsession.pendingCommands[command.id];
	if (callbackFunction != null) {
		callbackFunction(command);
	}
}
