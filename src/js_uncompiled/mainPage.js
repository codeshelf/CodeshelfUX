/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.52 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.provide('codeshelf.windowLauncher'); // Better way? Only for use inside this file.
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.aisleslistview');
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


window.onbeforeunload = function () {
	return "Leaving this page will reset the layout of the Codeshelf application";
};

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
	// The top window has z index = 1. Others are zero

	var windows = goog.dom.getElementsByClass("window");
	var theTopWindow = null;
	// for/in loops will iterate over keys in the ancestor prototype chain as well, so generally don't
	var l = windows.length;
	for (var i = 0; i < l; i++) {
		var aWindow = windows[i];
		if (aWindow.style.zIndex === "1")
			theTopWindow = aWindow;
	}

	if (theTopWindow) {
		return theTopWindow;
	}
	else {
		return null;
		/*
		var theNode;
		// currently just gets the "frame" element that we want to remove
		theNode = goog.dom.query('.frame')[0];
		theNode.style.top = 40;
		theNode.style.left = 5;
		return theNode;
		*/
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
	},

	loadAislesListView: function() {
		try {
			var aislesListView = codeshelf.aisleslistview(this.getWebsession(), this.getFacility());
			var aislesListWindow = codeshelf.window(aislesListView, getDomNodeForNextWindow(), getWindowDragLimit());
			aislesListWindow.open();
		}
		catch (err) {
			alert(err);
		}
	},

	loadFacilityEditor: function () {
		try {
			// Load the GMaps API and init() when done.
			if (typeof google !== 'undefined') {
				google.load('maps', '3', {'other_params': 'sensor=false', 'callback': function() {
					var facilityEditorView = codeshelf.facilityeditorview(codeshelf.windowLauncher.getWebsession(), codeshelf.windowLauncher.getFacility());
					var facilityEditorWindow = codeshelf.window(facilityEditorView, getDomNodeForNextWindow(), getWindowDragLimit());
					facilityEditorWindow.open();
				}});
			}
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
	var frameTop_ = 35; // allow 30 for the navbar
	var frameLeft_ = 5;
	var limits_;

	var ediServicesView_;

	function updateFrameSize(size) {
		// goog.style.setSize(goog.dom.getElement('frame'), size);
		// frame_.style.width = size.width - 15 + 'px';
		// frame_.style.height = size.height - 5 + 'px';
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
							clientInitializer.start(websession_, application_.getOrganization(), loadFacilityWindows);
						} else {
							for (var i = 0; i < command['data']['results'].length; i++) {
								var facility = command['data']['results'][i];

								// save the websession and facility so we can launch windows at any time.
								codeshelf.windowLauncher.setWebsession(websession_);
								codeshelf.windowLauncher.setFacility(facility);
								// and prepare the objectupdater.
								codeshelf.objectUpdater.setWebsession(websession_);
								codeshelf.objectUpdater.setFacility(facility);

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
	/*
	function loadFacilityEditor() {
		try {
			// Load the GMaps API and init() when done.
			if (typeof google !== 'undefined') {
				google.load('maps', '3', {'other_params': 'sensor=false', 'callback': function() {
					var facilityEditorView = codeshelf.facilityeditorview(codeshelf.windowLauncher.getWebsession(), codeshelf.windowLauncher.getFacility());
					var facilityEditorWindow = codeshelf.window(facilityEditorView, getDomNodeForNextWindow(), getWindowDragLimit());
					facilityEditorWindow.open();
				}});
			}
		}
		catch (err) {
			alert(err);
		}
	}
	*/

	function loadFacilityWindows(facility) {
		// No longer open the list demo view
		// What windows should launch immediately?

		// codeshelf.windowLauncher.loadPathsView();

		// codeshelf.windowLauncher.loadFacilityEditor();

		// codeshelf.windowLauncher.loadWorkAreaEditorView();

		codeshelf.windowLauncher.loadEdiServicesView();

		codeshelf.windowLauncher.loadOrdersView();

		codeshelf.windowLauncher.loadWorkAreaView();

		// Enable to show an example of a confirmation dialog that waits for confirmation before closing
//		codeshelf.windowLauncher.doLaunchListDemoView();

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

			// The frame div no longer in the window
			// frame_ = goog.dom.query('.frame')[0];
			// frame_.style.top = frameTop_ + 5 + 'px';
			// frame_.style.left = frameLeft_ + 'px';


			limits_ = new goog.math.Rect(0, 0, 750, 600);

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
/*
	var dialogOptions = {
		cancelButtonVisibility: 'hidden',
		cancelButtonText: '',
		actionButtonText: 'OK',
		headerText: 'Contact Codeshelf',
		bodyText: 'Check out codeshelf.com',
		callback: function () {

		}
	};
*/
	var dialogOptions = {};
	dialogOptions ['cancelButtonVisibility'] = "hidden";
	dialogOptions ['cancelButtonText'] = "";
	dialogOptions ['actionButtonText'] = "OK";
	dialogOptions ['headerText'] = "Contact Codeshelf";
	dialogOptions ['bodyText'] = "Check out codeshelf.com";
	dialogOptions ['callback'] = function () {

	};


	var injector = angular.injector(['ng', 'codeshelfApp']);

	injector.invoke(['simpleDialogService', function(simpleDialogService){
		simpleDialogService['showModalDialog']({}, dialogOptions);
	// Paul: as elsewhere, not working in compiled code. Need to exportSymbol for simpleDialogService?
	}]);

}
// Necessary for now: compilation changes the function name.
goog.exportSymbol('contactWasSelected', contactWasSelected);


function launchListViewDemo() {
	codeshelf.windowLauncher.doLaunchListDemoView();
}
goog.exportSymbol('launchListViewDemo', launchListViewDemo);

function launchPathsView() {
	codeshelf.windowLauncher.loadPathsView();
}
goog.exportSymbol('launchPathsView', launchPathsView);

function launchWorkAreaEditor() {
	codeshelf.windowLauncher.loadWorkAreaEditorView();
}
goog.exportSymbol('launchWorkAreaEditor', launchWorkAreaEditor);

function launchEdiServicesView() {
	codeshelf.windowLauncher.loadEdiServicesView();
}
goog.exportSymbol('launchEdiServicesView', launchEdiServicesView);

function launchOrdersView() {
	codeshelf.windowLauncher.loadOrdersView();
}
goog.exportSymbol('launchOrdersView', launchOrdersView);

function launchWorkAreaView() {
	codeshelf.windowLauncher.loadWorkAreaView();
}
goog.exportSymbol('launchWorkAreaView', launchWorkAreaView);

function launchFacilityEditor() {
	codeshelf.windowLauncher.loadFacilityEditor();
}
goog.exportSymbol('launchFacilityEditor', launchFacilityEditor);

function launchAislesListView() {
	codeshelf.windowLauncher.loadAislesListView();
}
goog.exportSymbol('launchAislesListView', launchAislesListView);

function launchTestRunner() {
	var theLogger = goog.debug.Logger.getLogger('navbar');
	theLogger.info("No tests yet from here");
}
goog.exportSymbol('launchTestRunner', launchTestRunner);
