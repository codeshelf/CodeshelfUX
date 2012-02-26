goog.provide('codeshelf.websession');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.WebSocket');
goog.require('goog.json');

if (typeof MozWebSocket != "undefined") {
	var WebSocket = MozWebSocket;
}

const kWebSessionCommandType = {
	LAUNCH_CODE_CHECK:  'LAUNCH_CODE_CHECK',
	LAUNCH_CODE_RESP:   'LAUNCH_CODE_RESP',
	OBJECT_GETTER_REQ:  'OBJECT_GETTER_REQ',
	OBJECT_GETTER_RESP: 'OBJECT_GETTER_RESP',
	OBJECT_GETBYID_REQ: 'OBJECT_GETBYID_REQ',
	OBJECT_GETBYID_RESP:'OBJECT_GETBYID_RESP',
	OBJECT_CREATE_REQ:  'OBJECT_CREATE_REQ',
	OBJECT_CREATE_RESP: 'OBJECT_CREATE_RESP',
	OBJECT_UPDATE_REQ:  'OBJECT_CHANGE_REQ',
	OBJECT_UPDATE_RESP: 'OBJECT_CHANGE_RESP',
	OBJECT_DELETE_REQ:  'OBJECT_DELETE_REQ',
	OBJECT_DELETE_RESP: 'OBJECT_DELETE_RESP'
};

const kWebsessionState = {
	UNVALIDATED:'UNVALIDATED',
	VALIDATED:  'VALIDATED'
};

codeshelf.websession = function () {

	var state_;
	var pendingCommands_;
	var connectAttempts_ = 0;
	var application_;
	var websocket_;
	var currentPage_;

	return {

		getState:function () {
			return state_;
		},

		setState:function (state) {
			state_ = state;
		},

		initWebSocket:function (application) {

			application_ = application;
			state_ = kWebsessionState.UNVALIDATED;
			pendingCommands_ = new Object();

			/**
			 * Strategy for reconnection that backs off linearly with a 1 second offset.
			 * @return {number} The amount of time to the next reconnect, in milliseconds.
			 */

			function linearBackOff() {
				return (connectAttempts_++ * 1000) + 1000;
			}

			websocket_ = new goog.net.WebSocket(true, linearBackOff);
			pendingCommands_ = new goog.events.EventHandler();
			pendingCommands_.listen(websocket_, goog.net.WebSocket.EventType.ERROR, this.onError);
			pendingCommands_.listen(websocket_, goog.net.WebSocket.EventType.OPENED, this.onOpen);
			pendingCommands_.listen(websocket_, goog.net.WebSocket.EventType.CLOSED, this.onClose);
			pendingCommands_.listen(websocket_, goog.net.WebSocket.EventType.MESSAGE, this.onMessage);

			try {
				if (!websocket_.isOpen()) {
					websocket_.open('ws://127.0.0.1:8080');
//			while (!websocket.isOpen()) {
//				setTimeout(500);
//			}
				}
			} catch (e) {
				//
			}
		},

		createCommand:function (commandType, data) {
			var command = {
				id:  goog.events.getUniqueId('cmdid'),
				type:commandType,
				data:data
			}
			return command;
		},

		sendCommand:function (command, callbackFunction) {

			//goog.events.listen(pendingCommands_, command.id, responseFunction);
			//pendingCommands_.dispatchEvent(command.id);
			//goog.events.unlisten(pendingCommands_, command.id, responseFunction);

			// Attempt to send the command.
			try {
				if (!websocket_.isOpen()) {
					alert('WebSocket not open: try again later');
				} else {
					// Put the pending command callback function in the map.
					pendingCommands_[command.id] = callbackFunction;

					websocket_.send(goog.json.serialize(command));
				}
			} catch (e) {

			}
		},

		setCurrentPage:function (currentPage) {
			currentPage_ = currentPage;
		},

		onError:function () {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			application_.restartApplication('websocket error');
		},

		onOpen:function () {

		},

		onClose:function () {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			application_.restartApplication('websocket closed unexpectedly');
		},

		onMessage:function (messageEvent) {
			command = goog.json.parse(messageEvent.message);

			callbackFunction = pendingCommands_[command.id];
			if (callbackFunction != null) {
				callbackFunction(command);
			}
		}
	}
}
