/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: websession.js,v 1.21 2012/06/10 03:13:32 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.websession');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.WebSocket');
goog.require('goog.json');
goog.require('goog.array');

if (typeof MozWebSocket !== "undefined") {
	var WebSocket = MozWebSocket;
}

var kWebSessionCommandType = {
	LAUNCH_CODE_CHECK:    'LAUNCH_CODE_RQ',
	LAUNCH_CODE_RESP:     'LAUNCH_CODE_RS',
	OBJECT_GETTER_REQ:    'OBJ_GET_RQ',
	OBJECT_GETTER_RESP:   'OBJ_GET_RS',
	OBJECT_CREATE_REQ:    'OBJ_CRE_RQ',
	OBJECT_CREATE_RESP:   'OBJ_CRE_RS',
	OBJECT_UPDATE_REQ:    'OBJ_UPD_RQ',
	OBJECT_UPDATE_RESP:   'OBJ_UPD_RS',
	OBJECT_DELETE_REQ:    'OBJ_DEL_RQ',
	OBJECT_DELETE_RESP:   'OBJ_DEL_RS',
	OBJECT_LISTENER_REQ:  'OBJ_LSN_RQ',
	OBJECT_LISTENER_RESP: 'OBJ_LSN_RS',
	OBJECT_FILTER_REQ:    'OBJ_FLT_RQ',
	OBJECT_FILTER_RESP:   'OBJ_FLT_RS'
};

var kWebsessionState = {
	UNVALIDATED: 'UNVALIDATED',
	VALIDATED:   'VALIDATED'
};

codeshelf.websession = function() {

	var state_;
	var thisWebsession_;
	var websocketStarted_ = false;
	var pendingCommands_;
	var connectAttempts_ = 0;
	var application_;
	var websocket_;
	var currentPage_;

	thisWebsession_ = {

		getState: function() {
			return state_;
		},

		setState: function(state) {
			state_ = state;
		},

		initWebSocket: function(application) {

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
			var webSocketEventHandler = new goog.events.EventHandler();
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.ERROR, thisWebsession_.onError);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.OPENED, thisWebsession_.onOpen);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.CLOSED, thisWebsession_.onClose);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.MESSAGE, thisWebsession_.onMessage);

			try {
				if (!websocket_.isOpen()) {
					websocket_.open('ws://127.0.0.1:8080');
				}
			} catch (e) {
				//
			}
		},

		createCommand: function(commandType, data) {
			var command = {
				'id':   goog.events.getUniqueId('cid'),
				't': commandType,
				'd': data
			}
			return command;
		},

		sendCommand: function(inCommand, inCallback, inRemainActive) {
			// Attempt to send the command.
			try {
				if (inCallback == null) {
					alert('callback for cmd was null');
				} else {
					if (!websocket_.isOpen()) {
						//alert('WebSocket not open: try again later');
					} else {
						// Put the pending command callback in the map.
						var commandWrapper = {
							remainActive: inRemainActive,
							command:      inCommand,
							callback:     inCallback
						};
						pendingCommands_[inCommand.id] = commandWrapper;

						websocket_.send(goog.json.serialize(inCommand));
					}
				}
			} catch (e) {

			}
		},

		cancelCommand: function(inCommand) {
			delete pendingCommands_[inCommand.id];
		},

		setCurrentPage: function(currentPage) {
			currentPage_ = currentPage;
		},

		onError: function() {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			var reason;
			if (websocketStarted_) {
				reason = 'websocket error';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onOpen: function() {
			websocketStarted_ = true;
		},

		onClose: function() {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			var reason;
			if (websocketStarted_) {
				reason = 'websocket closed unexpectedly';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onMessage: function(messageEvent) {
			var command = goog.json.parse(messageEvent.message);

			var commandWrapper = pendingCommands_[command.id];
			var callback = commandWrapper.callback;
			if (callback == null) {
				alert('callback for cmd was null');
			} else {
				if (!command.hasOwnProperty('t')) {
					alert('response has no type');
				} else {
					if (!command.hasOwnProperty('d')) {
						alert('reponse has no data');
					} else {
						callback.exec(command);
					}
				}

				// Check if the callback should remain active.
				if (!commandWrapper.remainActive) {
					thisWebsession_.cancelCommand(command);
				}
			}

			messageEvent.dispose();
		}
	};

	return thisWebsession_;
};
