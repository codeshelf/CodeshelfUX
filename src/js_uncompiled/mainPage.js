/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.52 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.provide('codeshelf.windowLauncher'); // Better way? Only for use inside this file.
goog.require('codeshelf.sessionGlobals');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.aisleslistview');
goog.require('codeshelf.chelistview');
goog.require('codeshelf.baylistview');
goog.require('codeshelf.containeruselistview');
goog.require('codeshelf.workinstructionlistview');
goog.require('codeshelf.tierlistview');
goog.require('codeshelf.tierslotlistview');
goog.require('codeshelf.ledcontrollerslistview');
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
goog.require('codeshelf.simpleDlogService');

goog.require('twitter.bootstrap');


window.onbeforeunload = function () {
	return "Leaving this page will reset the layout of the Codeshelf application";
};


codeshelf.doLaunchListDemoView = function(){
	try {
		 var listDemoView = codeshelf.listdemoview();
		 var listDemoWindow = codeshelf.window(listDemoView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
		 listDemoWindow.open();
		}
	catch (err) {
		 alert(err);
		}
}

// global (sort of singleton) called the "module pattern"
codeshelf.windowLauncher = (function() {
	// psuedo private

	return {
		// public methods

		loadPathsView: function () {
			try {
				var pathsView = codeshelf.pathsview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var pathsWindow = codeshelf.window(pathsView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				pathsWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		doLaunchListDemoView: function(){
			try {
				var listDemoView = codeshelf.listdemoview();
				var listDemoWindow = codeshelf.window(listDemoView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				listDemoWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadWorkAreaEditorView: function () {
			try {
				var workAreaEditorView = codeshelf.workareaeditorview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var workAreaEditorWindow = codeshelf.window(workAreaEditorView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				workAreaEditorWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadEdiServicesView: function() {
			try {
				var ediServicesView_ = codeshelf.ediservicesview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var ediServicesWindow = codeshelf.window(ediServicesView_, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				ediServicesWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadWorkAreaView: function() {
			try {
				var workAreaView = codeshelf.workareaview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var workAreaWindow = codeshelf.window(workAreaView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				workAreaWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadOrdersView: function(inOutboundOrders) {
			try {
				var ordersView = codeshelf.ordersview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), inOutboundOrders);
				var ordersWindow = codeshelf.window(ordersView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				ordersWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadAislesListView: function() {
			try {
				var aislesListView = codeshelf.aisleslistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var aislesListWindow = codeshelf.window(aislesListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				aislesListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadLedControllersListView: function() {
			try {
				var ledControllersListView = codeshelf.ledcontrollerslistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var ledControllersListWindow = codeshelf.window(ledControllersListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				ledControllersListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadCheListView: function() {
			try {
				var cheListView = codeshelf.cheslistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var cheListWindow = codeshelf.window(cheListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				cheListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadTierListView: function() {
			try {
				var tierListView = codeshelf.tierlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), null);
				var tierListWindow = codeshelf.window(tierListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				tierListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadBayListView: function() {
			try {
				var bayListView = codeshelf.baylistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var bayListWindow = codeshelf.window(bayListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				bayListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadTierSlotListView: function(inTier) { // this one cannot be called from window launcher
			try {
				var tierListSlotView = codeshelf.tierslotlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), inTier);
				var tierListSlotWindow = codeshelf.window(tierSlotListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				tierListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadContainerUseListView: function() {
			try {
				var containerUseListView = codeshelf.containeruselistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), null);
				var containerUseWindow = codeshelf.window(containerUseListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				containerUseWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadWorkInstructionListView: function() {
			try {
				var workInstructionListView = codeshelf.workinstructionlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), null, null, null);
				var workInstructionWindow = codeshelf.window(workInstructionListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				workInstructionWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadFacilityEditor: function () {
			try {
				// Load the GMaps API and init() when done.
				if (typeof google !== 'undefined') {
					google.load('maps', '3.15', {'other_params': 'sensor=false', 'callback': function() {
						var facilityEditorView = codeshelf.facilityeditorview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
						var facilityEditorWindow = codeshelf.window(facilityEditorView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
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
							codeshelf.sessionGlobals.setWebsession(websession_);
							// A bit odd here. We set the facility in clientInitializer

							clientInitializer.start(websession_, application_.getOrganization(), loadFacilityWindows);
						} else {
							for (var i = 0; i < command['data']['results'].length; i++) {
								var facility = command['data']['results'][i];

								// save the websession and facility so we can launch windows at any time.
								codeshelf.sessionGlobals.setWebsession(websession_);
								codeshelf.sessionGlobals.setFacility(facility);

								loadFacilityWindows();
							}
						}
					}
				}
			}
		};

		return callback;
	}

	function loadFacilityWindows() {
		// What windows should launch immediately?


		// Will this be the one operational view that all should see upon opening?
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
	codeshelf.simpleDlogService.showNotifyDialog("Contact Codeshelf", "Check out <a href=\"http://www.codeshelf.com\">codeshelf.com</a>");

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
	codeshelf.windowLauncher.loadOrdersView(true); // OUTBOUND orders
}
goog.exportSymbol('launchOrdersView', launchOrdersView);

function launchBatchOrdersView() {
	codeshelf.windowLauncher.loadOrdersView(false); // CROSS orders, no outbound
}
goog.exportSymbol('launchBatchOrdersView', launchBatchOrdersView);

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

function launchLedControllersListView() {
	codeshelf.windowLauncher.loadLedControllersListView();
}
goog.exportSymbol('launchLedControllersListView', launchLedControllersListView);

function launchCheListView() {
	codeshelf.windowLauncher.loadCheListView();
}
goog.exportSymbol('launchCheListView', launchCheListView);

function launchTierListView() {
	codeshelf.windowLauncher.loadTierListView();
}
goog.exportSymbol('launchTierListView', launchTierListView);

function launchBayListView() {
	codeshelf.windowLauncher.loadBayListView();
}
goog.exportSymbol('launchBayListView', launchBayListView);

function launchTierSlotListView(inTier) {
	codeshelf.windowLauncher.loadTierSlotListView(inTier);
}
goog.exportSymbol('launchTierSlotListView', launchTierSlotListView);

function launchContainerUseListView() {
	codeshelf.windowLauncher.loadContainerUseListView();
}
goog.exportSymbol('launchContainerUseListView', launchContainerUseListView);

function launchWorkInstructionListView() {
	codeshelf.windowLauncher.loadWorkInstructionListView();
}
goog.exportSymbol('launchWorkInstructionListView', launchWorkInstructionListView);


function launchTestRunner() {
	var theLogger = goog.debug.Logger.getLogger('navbar');
	theLogger.info("Opening all windows available from navbar");
	// But not the about dialog.  12 windows now.
	// But not the tier/slot window, which needs a tier reference to start.
	launchListViewDemo();
	launchPathsView();
	launchWorkAreaEditor();
	launchEdiServicesView();
	launchOrdersView(); // only outbound orders
	launchWorkAreaView();
	launchFacilityEditor();
	launchAislesListView();
	launchLedControllersListView();
	launchCheListView();
	launchBayListView();
	launchTierListView();
	launchContainerUseListView();
	launchWorkInstructionListView();

}
goog.exportSymbol('launchTestRunner', launchTestRunner);
