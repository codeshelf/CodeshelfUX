/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: websession.js,v 1.32 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.websession');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('goog.net.WebSocket');
goog.require('goog.debug');
goog.require('goog.debug.Logger');

if (typeof MozWebSocket !== 'undefined') {
	var WebSocket = MozWebSocket;
}

var kWebSessionCommandType = {
	INVALID: 'INVALID',
	LOGIN_REQ: 'LOGIN_RQ',
	LOGIN_RESP: 'LOGIN_RS',
	OBJECT_GETTER_REQ: 'OBJ_GET_RQ',
	// OBJECT_GETTER_RESP: 'OBJ_GET_RS',
	OBJECT_GETTER_RESP: 'ObjectGetResponse',
	OBJECT_UPDATE_REQ: 'OBJ_UPD_RQ',
	// OBJECT_UPDATE_RESP: 'OBJ_UPD_RS',
	OBJECT_UPDATE_RESP: 'ObjectUpdateResponse',
	OBJECT_DELETE_REQ: 'OBJ_DEL_RQ',
	OBJECT_DELETE_RESP: 'OBJ_DEL_RS',
	OBJECT_LISTENER_REQ: 'OBJ_LSN_RQ',
	//OBJECT_LISTENER_RESP: 'OBJ_LSN_RS',
	OBJECT_LISTENER_RESP: 'ObjectChangeResponse',
	OBJECT_FILTER_REQ: 'OBJ_FLT_RQ',
	// OBJECT_FILTER_RESP: 'OBJ_FLT_RS',
	OBJECT_FILTER_RESP: 'ObjectChangeResponse',
	OBJECT_METHOD_REQ: 'OBJ_METH_RQ',
	// OBJECT_METHOD_RESP: 'OBJ_METH_RS',
	OBJECT_METHOD_RESP: 'ObjectMethodResponse'
};

var kResponseStatus = {
	SUCCESS: "Success",
	FAIL: "Fail"
};

var kWebsessionState = {
	UNVALIDATED: 'UNVALIDATED',
	VALIDATED: 'VALIDATED'
};


codeshelf.websession = function () {
	var logger_ = goog.debug.Logger.getLogger('codeshelf.websession');

	var logger_ = goog.debug.Logger.getLogger("codeshelf.websession");
	var state_;
	var authz_;
	var websocketStarted_ = false;
	var pendingCommands_;
	var connectAttempts_ = 0;
	var application_;
	var websocket_;
	var currentPage_;
	var uniqueIdFunc_ = goog.events.getUniqueId;
	var websocketAddr_ = "wss://localhost:8444";

	function privateOpen_() {
		try {
			if (!websocket_.isOpen()) {
				websocket_.open(websocketAddr_);
			}
		} catch (e) {
			//
		}
	}

	var self_ = {

		getState: function () {
			return state_;
		},

		setState: function (state) {
			state_ = state;
		},


		getAuthz: function () {
			return authz_;
		},

		setAuthz: function (authz) {
			authz_ = authz;
		},

		initWebSocket: function (application, websocket) {

			application_ = application;
			state_ = kWebsessionState.UNVALIDATED;
			pendingCommands_ = new Object();

			websocket_ = websocket;
			var webSocketEventHandler = new goog.events.EventHandler();
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.ERROR, self_.onError);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.OPENED, self_.onOpen);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.CLOSED, self_.onClose);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.MESSAGE, self_.onMessage);

			self_.openWebSocket();
		},

		openWebSocket: function () {
			$.getJSON('websocket.addr.json', function (data) {
				if (data.hasOwnProperty('addr')) {
					websocketAddr_ = data['addr'];
				}
				privateOpen_();
			}).fail(function () {
				// Ignore
				privateOpen_();
			});
		},

		createCommand: function (commandType, data) {
			/*
			if (commandType==kWebSessionCommandType.OBJECT_GETTER_REQ) {
				var command = {
					ObjectGetRequest : {

					}
				}
			}
			else {

			}
			var command = {
				'id': uniqueIdFunc_('cid'),
				'type': commandType,
				'data': data
			};
			return command;
			*/
			alert('createCommand method is no longer support.  please use specific methods to create requests');
		},

		// new generic function to request object getter data
		createObjectGetRequest : function (className,persistentId,method) {
			var command = {
				'ObjectGetRequest' : {
						'className' : className,
						'persistentId': persistentId,
						'getterMethod': method
					}
				};
			return command;
		},

		// new generic function to invoke an object method
		createObjectMethodRequest : function (className,persistentId,methodName,methodArgs) {
			var command = {
				'ObjectMethodRequest' : {
						'className' : className,
						'persistentId': persistentId,
						'methodName': methodName,
						'methodArgs': methodArgs
					}
				};
			return command;
		},

		/**
		 * @param {string} className
		 * @param {string} persistentId
		 * @param {object} properties
		 */
		createObjectUpdateRequest : function (className,persistentId,properties) {
			var command = {
				'ObjectUpdateRequest' : {
						'className':    className,
						'persistentId': persistentId,
						'properties':   properties
					}
				};
			return command;
		},

		createObjectListenerRequest : function (className,persistentIds,properties) {
			var command = {
				'RegisterListenerRequest' : {
						'className':    className,
						'objectIds': persistentIds,
						'propertyNames': properties
					}
				};
			return command;
		},

		createObjectDeleteRequest : function (className,persistentId,properties) {
			var command = {
				'ObjectUpdateRequest' : {
						'className':    className,
						'persistentId': persistentId
					}
				};
			return command;
		},

		// new generic function to register a filter
		createRegisterFilterRequest : function (className,propertyNames,clause,params) {
			var command = {
				'RegisterFilterRequest' : {
						'className':     className,
						'propertyNames': propertyNames,
						'filterClause':  clause,
						'filterParams': params
					}
				};
			return command;
		},

		createKeepAliveMessage: function () {
			var command = {
				'KeepAlive' : {
					'messageId': self_.getUUID()
				}
			};
			return command;
		},

		update: function(csDomainObject, selectedFields) {
			var promise = jQuery.Deferred();
			var objectProperties = {};
			goog.array.forEach(selectedFields, function(fieldName) {
				objectProperties[fieldName] = csDomainObject[fieldName];
			});
			var command = self_.createObjectUpdateRequest(csDomainObject['className'], csDomainObject['persistentId'], objectProperties);
			self_.sendCommand(command,  {
					exec: function(response) {
						promise.resolve(response);
					},
					fail: function(response) {
						promise.reject(response);
					}
			}, false);
			return promise;
		},

		sendCommand: function (inCommand, inCallback, inRemainActive) {
			// Attempt to send the command.
			try {
				if (inCallback == null) {
					logger_.error("callback for cmd was null");
				} else {
					if (!websocket_.isOpen()) {
						inCallback.fail("websocket is not open");
					} else {
						var messageId = self_.getMessageId(inCommand);
						if (messageId==undefined) {
							messageId = self_.setMessageId(inCommand);
						}

						// Put the pending command callback in the map.
						var commandWrapper = {
							remainActive: inRemainActive,
							command: inCommand,
							callback: inCallback
						};
						pendingCommands_[messageId] = commandWrapper;

						websocket_.send(goog.json.serialize(inCommand));
					}
				}
			} catch (e) {
				logger_.severe("Error sending message: "+e);
			}
		},

		sendMessage: function (inCommand) {
			// Attempt to send the message.
			try {
				if (!websocket_.isOpen()) {
					// alert('WebSocket not open: try again later');
				} else {
					var messageId = self_.getMessageId(inCommand);
					if (messageId==undefined) {
						messageId = self_.setMessageId(inCommand);
					}
					websocket_.send(goog.json.serialize(inCommand));
				}
			} catch (e) {
				var theLogger = goog.debug.Logger.getLogger('websocket');
				theLogger.error("Error sending message: "+e);
			}
		},

		getMessageId: function (message) {
			// extract id using old format
			var messageId = message['id'];
			if (messageId==undefined) {
				// try new format, if not defined
				messageId = message[Object.keys(message)[0]]['messageId'];
			}
			return messageId;
		},

		setMessageId: function (message) {
			// generate message id, if not already defined
			var messageId = uniqueIdFunc_('cid');
			message[Object.keys(message)[0]]['messageId'] = messageId;
			return messageId;
		},

		cancelCommand: function (inCommand) {
			delete pendingCommands_[inCommand.id];
		},

		setCurrentPage: function (currentPage) {
			currentPage_ = currentPage;
		},

		onError: function () {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			var reason;
			if (websocketStarted_) {
				reason = 'websocket error';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onOpen: function () {
			websocketStarted_ = true;
		},

		onClose: function () {
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			var reason;
			if (websocketStarted_) {
				reason = 'websocket closed unexpectedly';
				websocketStarted_ = false;
			}
			application_.restartApplication(reason);
		},

		onMessage: function (messageEvent) {
			var command = goog.json.parse(messageEvent.message);
			var messageId = command[Object.keys(command)[0]]['requestId'];
			var commandType = Object.keys(command)[0];

			// check for keep alive message
			if (commandType=="KeepAlive") {
				// respond with keep alive
				var msg = self_.createKeepAliveMessage();
				self_.sendMessage(msg);
				return;
			}

			// handle other messages
			var commandWrapper = pendingCommands_[messageId];
			var callback = commandWrapper.callback;
			if (callback == null) {
				alert('callback for cmd was null');
			} else {
				var failFn = callback["fail"];
				if (typeof failFn === 'undefined') {
					failFn = function(response) {};
				}
				if (Object.keys(command).length==1) {
					if (commandType != undefined) {
						var unwrappedMessage = command[Object.keys(command)[0]];
						// validate message
						if (commandType == kWebSessionCommandType.OBJECT_FILTER_RESP && unwrappedMessage['results'] == undefined) {
							// filter response has no data
							logger_.severe('filter response has no data:' + goog.debug.expose(command));
							failFn('filter response has no data');
						} else if (unwrappedMessage['status'] == kResponseStatus.FAIL) {
							failFn(commandType, unwrappedMessage);
						} else {
							callback.exec(commandType, unwrappedMessage);
						}
					}
					else {
						logger_.severe('command has no type');
						failFn('command has no type');
					}
				}
				else {
					logger_.severe('invalid response: one root property expected');
					failFn('invalid response: one root property expected');
				}
				// Check if the callback should remain active.
				if (!commandWrapper.remainActive) {
					self_.cancelCommand(command);
				}
			}

			messageEvent.dispose();
		},

		getUUID: function() {
			  function s4() {
				  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			  }
			  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}

	};

	return self_;
};
