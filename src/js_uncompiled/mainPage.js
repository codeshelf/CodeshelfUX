/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.52 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.provide('codeshelf.windowLauncher'); // Better way? Only for use inside this file.
goog.require('codeshelf.pathsview');
goog.require('codeshelf.ediservicesview');
goog.require('codeshelf.facilityeditorview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.initializenewclient');
goog.require('codeshelf.listdemoview');
goog.require('codeshelf.listview');
goog.require('codeshelf.ordersview');
goog.require('codeshelf.templates');
goog.require('codeshelf.window');
goog.require('codeshelf.workareaeditorview');
goog.require('codeshelf.workareaview');
goog.require('domainobjects');
goog.require('goog.Disposable');
goog.require('goog.debug');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.ui.Dialog');

goog.require('extern.jquery');


// utility functions for window launching
function getWindowDragLimit() {
	// we want the right and bottom limits large as the GCT window knows to scroll there.
	// As for left and top, zeros are ok. See below it comes from "frame_ = goog.dom.query('.frame')[0];"
	// which will have zeros for top and left
	var theRectLimit = new goog.math.Rect(0,0,10000,10000);
	return theRectLimit;
}

function getDomNodeForNextWindow() {
	// The right thing to do is find the top window, and available size of the browser.
	// Offset right and down of top window, unless too far compared to browser.
	// If no window up yet, then set to a default place

	// for now, act as before, returning the frame
	var theOwnerWindow = goog.dom.getElementByClass("window");
	if (false && theOwnerWindow) {
		return theOwnerWindow;
	}
	else {
		var theNode;
		// currently just gets the "frame" element that we want to remove
		theNode = goog.dom.query('.frame')[0];
		theNode.style.top = 40;
		theNode.style.left = 5;

		return theNode;
	}
}


codeshelf.doLaunchListDemoView = function(){
	try {
		 var listDemoView = codeshelf.listdemoview();
		 var listDemoWindow = codeshelf.window(listDemoView, getDomNodeForNextWindow(), getWindowDragLimit());
		 listDemoWindow.open();
		}
	catch (err) {
		 alert(err);
		}
}

// global (sort of singleton) called the "module pattern"
codeshelf.windowLauncher = (function() {
	// psuedo private
	var facility;
	var websession;

	return {
	// public methods
	setFacility: function(inFacility){
		facility = inFacility;
	},

	getFacility: function(){
		return facility;
	},
	setWebsession: function(inWebsession){
		websession = inWebsession;
	},

	getWebsession: function(){
		return websession;
	},

	loadPathsView: function () {
		try {
			var pathsView = codeshelf.pathsview(this.getWebsession(), this.getFacility());
			var pathsWindow = codeshelf.window(pathsView, getDomNodeForNextWindow(), getWindowDragLimit());
			pathsWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	doLaunchListDemoView: function(){
		try {
			var listDemoView = codeshelf.listdemoview();
			var listDemoWindow = codeshelf.window(listDemoView, getDomNodeForNextWindow(), getWindowDragLimit());
			listDemoWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	loadWorkAreaEditorView: function () {
		try {
			var workAreaEditorView = codeshelf.workareaeditorview(this.getWebsession(), this.getFacility());
			var workAreaEditorWindow = codeshelf.window(workAreaEditorView, getDomNodeForNextWindow(), getWindowDragLimit());
			workAreaEditorWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	loadEdiServicesView: function() {
		try {
			var ediServicesView_ = codeshelf.ediservicesview(this.getWebsession(), this.getFacility());
			var ediServicesWindow = codeshelf.window(ediServicesView_, getDomNodeForNextWindow(), getWindowDragLimit());
			ediServicesWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	loadWorkAreaView: function() {
		try {
			var workAreaView = codeshelf.workareaview(this.getWebsession(), this.getFacility());
			var workAreaWindow = codeshelf.window(workAreaView, getDomNodeForNextWindow(), getWindowDragLimit());
			workAreaWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	loadOrdersView: function() {
		try {
			var ordersView = codeshelf.ordersview(this.getWebsession(), this.getFacility());
			var ordersWindow = codeshelf.window(ordersView, getDomNodeForNextWindow(), getWindowDragLimit());
			ordersWindow.open();
		}
		catch (err) {
			alert(err);
		}
	}


};
})();



codeshelf.mainpage = function() {

	var application_;
	var organization_;
	var websession_;
	var frame_;
	var frameTop_ = 35; // allow 30 for the navbar
	var frameLeft_ = 5;
	var limits_;

	var ediServicesView_;

	function updateFrameSize(size) {
		// goog.style.setSize(goog.dom.getElement('frame'), size);
		frame_.style.width = size.width - 15 + 'px';
		frame_.style.height = size.height - 5 + 'px';
	}

	function websocketCmdCallback() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_GETTER_RESP) {
						if (command['data']['results'].length === 0) {
							var clientInitializer = codeshelf.initializenewclient();
							clientInitializer.start(websession_, application_.getOrganization(), frame_, loadFacilityWindows);
						} else {
							for (var i = 0; i < command['data']['results'].length; i++) {
								var facility = command['data']['results'][i];

								// save the websession and facility so we can launch windows at any time.
								codeshelf.windowLauncher.setWebsession(websession_);
								codeshelf.windowLauncher.setFacility(facility);

								loadFacilityWindows(facility);
							}
						}
					}
				}
			}
		};

		return callback;
	}

	// why does this not work as part of windowLauncher?
	function loadFacilityEditor(facility) {
		try {
			// Load the GMaps API and init() when done.
			if (typeof google !== 'undefined') {
				google.load('maps', '3', {'other_params': 'sensor=false', 'callback': function() {
					var facilityEditorView = codeshelf.facilityeditorview(websession_, application_.getOrganization(), facility);
					var facilityEditorWindow = codeshelf.window(facilityEditorView, getDomNodeForNextWindow(), getWindowDragLimit());
					facilityEditorWindow.open();
				}});
			}
		}
		catch (err) {
			alert(err);
		}
	}

	function loadFacilityWindows(facility) {
		// No longer open the list demo view
		// What windows should launch immediately?

		codeshelf.windowLauncher.loadPathsView();

		loadFacilityEditor(codeshelf.windowLauncher.getFacility());

		/*  comment out these 4 to work on window ordering problem See CD_0009 */
		codeshelf.windowLauncher.loadWorkAreaEditorView();

		codeshelf.windowLauncher.loadEdiServicesView();

		codeshelf.windowLauncher.loadOrdersView();

		codeshelf.windowLauncher.loadWorkAreaView();

	}



	/**
	 * The main page view.
	 * @type {Object}
	 */
	var self = {

	enter: function(application, websession) {

			application_ = application;
			websession_ = websession;
			organization_ = application_.getOrganization();

			websession_.setCurrentPage(this);

			goog.dom.setProperties(goog.dom.getDocument()['body'], {'class': 'main_body'});
			goog.dom.appendChild(goog.dom.getDocument()['body'], soy.renderAsElement(codeshelf.templates.mainPage));

			frame_ = goog.dom.query('.frame')[0];
			frame_.style.top = frameTop_ + 5 + 'px';
			frame_.style.left = frameLeft_ + 'px';

			limits_ = new goog.math.Rect(frameTop_, frameLeft_, 750, 600);

			updateFrameSize(goog.dom.getViewportSize());

			// Start listening for viewport size changes.
			var vsm = new goog.dom.ViewportSizeMonitor();
			goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
				var size = vsm.getSize();
				size.height -= 10;
				updateFrameSize(size);
			});

			goog.events.listen(document, goog.events.EventType.KEYPRESS, function(e) {
				if (e.keyCode === goog.events.KeyCodes.NUM_ZERO) {
					if (gFocusedWindow < gWindowList.length - 1) {
						gFocusedWindow++;
					} else {
						gFocusedWindow = 0;
					}
					var window = gWindowList[gFocusedWindow];
					window.focusWindow();
				}
			});

//			var filter = 'parentOrganization.persistentId = :theId';
//			var filterParams = [
//				{ 'name': 'theId', 'value': organization_['persistentId']}
//			];
//			var listView = codeshelf.listview('Facilities List', websession_, domainobjects['Facility'], filter, filterParams);
//			var listWindow = codeshelf.window(listView, frame_, undefined);
//			listWindow.open();

			var data = {
				'className':    organization_['className'],
				'persistentId': organization_['persistentId'],
				'getterMethod': 'getFacilities'
			};

			var websession = application_.getWebsession();
			var getFacilitiesCmd = websession.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			websession.sendCommand(getFacilitiesCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_GETTER_RESP), false);
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
		}
	};

	return self;
}
;

function contactWasSelected() {
	var dialogOptions = {
		cancelButtonVisibility: 'hidden',
		cancelButtonText: '',
		actionButtonText: 'OK',
		headerText: 'Contact Codeshelf',
		bodyText: 'Check out codeshelf.com',
		callback: function () {

		}
	};

	var injector = angular.injector(['ng', 'codeshelfApp']);

	injector.invoke(['simpleDialogService', function(simpleDialogService){
		simpleDialogService.showModalDialog({}, dialogOptions);
	// Paul: as elsewhere, not working in compiled code. Need to exportSymbol for simpleDialogService?
	}]);

}
// Necessary for now: compilation changes the function name.
goog.exportSymbol('contactWasSelected', contactWasSelected);

function demoWasSelected() {
	var theLogger = goog.debug.Logger.getLogger('navbar');
	theLogger.info(" demo selected from navbar");

	// find our application to use it.
	// Paul:
	// codeshelfApp is found. However .mainpage is not in public scope, probably should
	// not be as it can close.
	// loadListViewDemo() might be moved to public scope on codeshelfApp, but I think it would
	// have to be defined in codeshelf.controllers.js where the app is created. That
	// would cause some code rearrangement.  AND we need to pass facility for other windows.
	var codeshelfApp = angular.module('codeshelfApp');
	// next line throws
	codeshelfApp.mainpage.loadListViewDemo();
}
goog.exportSymbol('demoWasSelected', demoWasSelected);


function launchListViewDemo() {
	var theLogger = goog.debug.Logger.getLogger('navbar');
	theLogger.info(" demo selected from navbar");

	codeshelf.windowLauncher.doLaunchListDemoView();
	codeshelf.windowLauncher.loadPathsView();

}
goog.exportSymbol('launchListViewDemo', launchListViewDemo);
