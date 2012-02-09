goog.provide('codeshelf.application');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession')
goog.require('codeshelf.launch')
goog.require('soy');

var codeshelfApp = {};

function initApplication_() {
	codeshelfApp.websocket = codeshelf.websession.initWebSocket();
	enterLaunchWindow();
}

// Launch the application.
initApplication_();

