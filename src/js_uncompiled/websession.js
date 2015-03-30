/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: websession.js,v 1.32 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.websession');

goog.require('codeshelf.authz');
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
	OBJECT_METHOD_RESP: 'ObjectMethodResponse',
	OBJECT_PROPERTIES_RESP: 'ObjectPropertiesResponse'

};

var kResponseStatus = {
	SUCCESS: "Success",
	FAIL: "Fail"
};

var kWebsessionState = {
	UNVALIDATED: 'UNVALIDATED',
	VALIDATED: 'VALIDATED'
};

var pollFrequency = 1000 * 60 * 4; //4 minutes;

function setPollInterval(func, delay) {
    if (!(this instanceof setPollInterval)) {
        return new setPollInterval(func, delay);
    }

    var that = this;
    function tick() {
        if (that.stopped) return;
        func().always(function(){
            that.token = setTimeout(tick, delay);
        });
    };

    this.token = setTimeout(tick, delay);
}

function clearPollInterval(instance) {
    if (instance != null) {
        instance.stopped = true;
        if (instance.token) {
            clearTimeout(instance.token);
        }
    }
}

codeshelf.websession = function () {
	var logger_ = goog.debug.Logger.getLogger('codeshelf.websession');

    var apiPoller_;
	var state_;
	var authz_;
	var websocketStarted_ = false;
	var pendingCommands_;
	var connectAttempts_ = 0;
	var application_;
	var websocket_;
	var currentPage_;
	var uniqueIdFunc_ = goog.events.getUniqueId;
	var websocketAddr_ = "ws://localhost:8181/ws/";

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
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.ERROR, self_.onEnd.bind(self_, "websocket error"));
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.OPENED, self_.onOpen);
			webSocketEventHandler.listen(websocket_, goog.net.WebSocket.EventType.CLOSED, self_.onEnd.bind(self_, "websocket closed"));
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
		// new generic function to invoke an object method
		createServiceMethodRequest : function (className,methodName,methodArgsArray) {
			var command = {
				'ServiceMethodRequest' : {
						'className' : className,
						'methodName': methodName,
						'methodArgs': methodArgsArray
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

		createObjectDeleteRequest : function (className,persistentId) {
			var command = {
				'ObjectDeleteRequest' : {
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

		// from v10, the objectPropertiesRequest
		createObjectPropertiesRequest : function (className,facilityPersistentId) {
			var command = {
				'ObjectPropertiesRequest' : {
					'className':    className,
					'persistentId': facilityPersistentId
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

        ping: function(interval) {
            return jQuery.get("/api/facilities");
        },

        login: function(username, password) {
            //concurrently set auth cookie
            // and setup websocket with login request
            self_.loginHTTP(username, password);

            return self_.loginCSWebSocket(username, password);
        },

        loginHTTP: function(username, password) {
            jQuery.post("/auth/", {
                "u": username,
                "p": password
            }).done(function() {
                logger_.info("setting auth cookie");
            }).fail(function() {
                logger_.info("login failed did not set auth cookie");
            });
        },
        loginCSWebSocket: function(username, password) {
            var loginCommand = {
				'LoginRequest' : {
					'userId': username,
					'password': password
				}
			};

			var promise = jQuery.Deferred();
			self_.sendCommand(loginCommand,  {
				exec: function(commandType, response) {
                    if (response.status == 'Success') {
					    self_.setState(kWebsessionState.VALIDATED);
					    application_.setOrganization(response['organization']);
					    var user = response['user'];
					    var email = user['username'];
					    var authz = new codeshelf.Authz();
					    if (email.indexOf('configure') == 0) {
						    authz.setPermissions(["*"]);
					    } else if (email.indexOf('view') == 0
							       || email == 'a@example.com') {
						    authz.setPermissions(["*:view"]);
					    } else if (email.indexOf('simulate') == 0) {
						    authz.setPermissions(["*"]);
					    } else if (email.indexOf('che') == 0) {
						    authz.setPermissions(["*:view", "che:simulate"]);
					    } else if (email.indexOf('work') == 0) {
						    authz.setPermissions(["*:view", "item:edit"]);
					    } else {
						    authz.setPermissions([]); // no permissions by default
					    }
					    authz = Object.freeze(authz); //ECMAScript 5 prevent changes from this point
					    self_.setAuthz(authz);
                        self_.onAuthenticated();
					    promise.resolve(response);
                    }
                    else {
                        promise.reject(response);
                    }
				},
				fail: function(commandType, response) {
					promise.reject(response);
				}
			}, false);
			return promise;
        },

		callServiceMethod: function(inClassName, inMethodName, inArgArray) {
			var methodCallCmd = self_.createServiceMethodRequest(inClassName, inMethodName, inArgArray);
			var promise = jQuery.Deferred();
			self_.sendCommand(methodCallCmd,  {
				exec: function(commandType, response) {
					promise.resolve(response["results"]);
				},
				fail: function(commandType, response) {
					promise.reject(response);
				}
			}, false);
			return promise;
		},


		callMethod: function(csDomainObject, inClassName, inMethodName, inMethodArgs) {
			if (!csDomainObject || !csDomainObject.hasOwnProperty('persistentId')){
				throw "domainObject with persistentId required";
			}
			var methodCallCmd = self_.createObjectMethodRequest(inClassName,csDomainObject['persistentId'], inMethodName, inMethodArgs);
			var promise = jQuery.Deferred();
			self_.sendCommand(methodCallCmd,  {
				exec: function(response) {
					promise.resolve(response);
				},
				fail: function(commandType, response) {
					promise.reject(response);
				}
			}, false);
			return promise;
		},

		update: function(csDomainObject, selectedFields) {
			var objectProperties = {};
			goog.array.forEach(selectedFields, function(fieldName) {
				objectProperties[fieldName] = csDomainObject[fieldName];
			});
			var command = self_.createObjectUpdateRequest(csDomainObject['className'], csDomainObject['persistentId'], objectProperties);
			var promise = jQuery.Deferred();
			self_.sendCommand(command,  {
					exec: function(commandType, response) {
						promise.resolve(response["results"]);
					},
					fail: function(commandType, response) {
						promise.reject(response);
					}
			}, false);
			return promise;
		},

		remove: function(csDomainObject) {
			var command = self_.createObjectDeleteRequest(csDomainObject['className'], csDomainObject['persistentId']);
			var promise = jQuery.Deferred();
			self_.sendCommand(command,  {
					exec: function(response) {
						promise.resolve(response);
					},
					fail: function(commandType, response) {
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
						return messageId;
					}
				}
			} catch (e) {
				logger_.severe("Error sending message: "+e);
			}
			return null;
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

		cancelCommand: function (commandToken) {
			if (commandToken != null) {
				delete pendingCommands_[commandToken];
			}
		},

		setCurrentPage: function (currentPage) {
			currentPage_ = currentPage;
		},

        onEnd: function(reason) {
            clearPollInterval(apiPoller_);
			state_ = kWebsessionState.UNVALIDATED;
			currentPage_.exit();
			if (websocketStarted_) {
				websocketStarted_ = false;
			} else {
                //ignore reason
                reason = null ;
            }
			application_.restartApplication(reason);
        },

		onOpen: function () {
			websocketStarted_ = true;
		},

        onAuthenticated: function() {
            if (apiPoller_ != null) {clearPollInterval(apiPoller_);}
            apiPoller_ = setPollInterval(self_.ping, pollFrequency);
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
