/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: websession.js,v 1.15 2012/03/24 18:28:03 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.websession');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.WebSocket');
goog.require('goog.json');
goog.require('goog.array');

if (typeof MozWebSocket != "undefined") {
	var WebSocket = MozWebSocket;
}

const kWebSessionCommandType = {
	LAUNCH_CODE_CHECK:   'LAUNCH_CODE_CHECK',
	LAUNCH_CODE_RESP:    'LAUNCH_CODE_RESP',
	OBJECT_GETTER_REQ:   'OBJECT_GETTER_REQ',
	OBJECT_GETTER_RESP:  'OBJECT_GETTER_RESP',
	OBJECT_CREATE_REQ:   'OBJECT_CREATE_REQ',
	OBJECT_CREATE_RESP:  'OBJECT_CREATE_RESP',
	OBJECT_UPDATE_REQ:   'OBJECT_UPDATE_REQ',
	OBJECT_UPDATE_RESP:  'OBJECT_UPDATE_RESP',
	OBJECT_DELETE_REQ:   'OBJECT_DELETE_REQ',
	OBJECT_DELETE_RESP:  'OBJECT_DELETE_RESP',
	OBJECT_LISTENER_REQ: 'OBJECT_LISTENER_REQ',
	OBJECT_LISTENER_RESP:'OBJECT_LISTENER_RESP',
	OBJECT_FILTER_REQ:   'OBJECT_FILTER_REQ',
	OBJECT_FILTER_RESP:  'OBJECT_FILTER_RESP'
};

const kWebsessionState = {
	UNVALIDATED:'UNVALIDATED',
	VALIDATED:  'VALIDATED'
};

codeshelf.websession = function () {

	var state_;
	var websocketStarted_ = false;
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

		sendCommand:function (command, callback) {
			// Attempt to send the command.
			try {
				if (callback == null) {
					alert('callback for cmd was null');
				} else {
					if (!websocket_.isOpen()) {
						//alert('WebSocket not open: try again later');
					} else {
						// Put the pending command callback in the map.
						pendingCommands_[command.id] = callback;

						websocket_.send(goog.json.serialize(command));
					}
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
			var reason;
			if (websocketStarted_) {
				reason = 'websocket error';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onOpen:function () {
			websocketStarted_ = true;
		},

		onClose:function () {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			var reason;
			if (websocketStarted_) {
				reason = 'websocket closed unexpectedly';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onMessage:function (messageEvent) {
			command = goog.json.parse(messageEvent.message);

			callback = pendingCommands_[command.id];
			if (callback == null) {
				alert('callback for cmd was null');
			} else {
				if (!command.hasOwnProperty('type')) {
					alert('response has no type');
				} else {
//					if (command.type != callback.getExpectedResponseType()) {
//						alert('response wrong type');
//					} else {
					if (!command.hasOwnProperty('data')) {
						alert('reponse has no data');
					} else {
						callback.exec(command);
					}
//					}
				}

				// Check if the callback should remain active.
				if (!callback.remainActive()) {
					delete pendingCommands_[command.id];
				}
			}
		}
	};
};
