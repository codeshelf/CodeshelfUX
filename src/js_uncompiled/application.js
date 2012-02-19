goog.provide('codeshelf.application');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession')
goog.require('codeshelf.launch')
goog.require('codeshelf.mainpage')
goog.require('soy');

var codeshelfApp = {};

codeshelf.application.startApplication_ = function () {
	// Remove all markup from the URL - we'll build it from the app itself.
	goog.dom.removeChildren(goog.dom.getDocument().body);
	codeshelfApp.websocket = codeshelf.websession.initWebSocket();
	codeshelf.launch.enterLaunchWindow();
	
	// Cause automatic login to save on test time.
	setTimeout(function() {codeshelf.launch.launchCodeCheck();},1250);

}

codeshelf.application.restartApplication = function (reason) {
	alert('Application restarted: ' + reason + '.');
	codeshelf.application.startApplication_();
}

// Launch the application.
codeshelf.application.startApplication_();

