/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.52 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.provide('codeshelf.windowLauncher'); // Better way? Only for use inside this file.
goog.require('codeshelf.authz');
goog.require('codeshelf.navbar');
goog.require('codeshelf.sessionGlobals');
goog.require('codeshelf.aisleslistview');
goog.require('codeshelf.chelistview');
goog.require('codeshelf.baylistview');
goog.require('codeshelf.containeruselistview');
goog.require('codeshelf.domainobjectpropertiesview');
goog.require('codeshelf.extensionpointsview');
goog.require('codeshelf.gtinlistview');
goog.require('codeshelf.itemlistview');
goog.require('codeshelf.itemmasterlistview');
goog.require('codeshelf.workinstructionlistview');
goog.require('codeshelf.tierlistview');
goog.require('codeshelf.tierslotlistview');
goog.require('codeshelf.ledcontrollerslistview');
goog.require('codeshelf.locationaliaseslistview');
goog.require('codeshelf.pathsview');
goog.require('codeshelf.ediservicesview');
goog.require('codeshelf.facilityeditorview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.listdemoview');
goog.require('codeshelf.ordersview');
goog.require('codeshelf.orderdetailsview');
goog.require('codeshelf.templates');
goog.require('codeshelf.window');
goog.require('codeshelf.workareaeditorview');
goog.require('domainobjects');
goog.require('goog.Disposable');
goog.require('goog.Uri');
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
goog.require('goog.json');
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
				var workAreaEditorView = codeshelf.workareaeditorview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), {});
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

		loadOrdersView: function(partialOrderIdQuery, inOutboundOrders) {
			try {
				var ordersView = codeshelf.ordersview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), inOutboundOrders, partialOrderIdQuery);
				var ordersWindow = codeshelf.window(ordersView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				ordersWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadOrderDetailsView: function() {
			try {
				var orderDetailsView = codeshelf.orderdetailsview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var orderDetailsWindow = codeshelf.window(orderDetailsView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				orderDetailsWindow.open();
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

		loadLocationAliasesListView: function() {
			try {
				var locationAliasesListView = codeshelf.locationaliaseslistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var locationAliasesListWindow = codeshelf.window(locationAliasesListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				locationAliasesListWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadCheListView: function() {
			try {
				var cheListView = codeshelf.cheslistview(codeshelf.sessionGlobals.getWebsession(),
														 codeshelf.sessionGlobals.getFacility());
				var cheListWindow = codeshelf.window(cheListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				cheListWindow.open();
			}
			catch (err) {
                console.log(err);
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

		loadTierSlotListView: function(inTier) { // inTier specified. Only slots for this tier. Navbar would not call this directly.
			try {
				var tierSlotListView = codeshelf.tierslotlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), inTier);
				var tierListSlotWindow = codeshelf.window(tierSlotListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				tierListSlotWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadSlotListView: function() { // null tier parameter in the tierslotlistview means all slots for the facility
			try {
				var tierSlotListView = codeshelf.tierslotlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), null);
				var tierListSlotWindow = codeshelf.window(tierSlotListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				tierListSlotWindow.open();
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
				var workInstructionListView = codeshelf.workinstructionsAll(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var workInstructionWindow = codeshelf.window(workInstructionListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				workInstructionWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadItemMastersListView: function() {
			try {
				var itemMasterListView = codeshelf.itemmasterlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var itemMasterWindow = codeshelf.window(itemMasterListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				itemMasterWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadDomainObjectPropertiesView: function() {
			try {
				var domainObjectPropertiesView = codeshelf.domainobjectpropertiesview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var domainObjectPropertiesWindow = codeshelf.window(domainObjectPropertiesView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				domainObjectPropertiesWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},
		
		loadExtensionPointsView: function() {
			try {
				var domainExtensionPointsView = codeshelf.extensionpointsview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var domainExtensionPointsWindow = codeshelf.window(domainExtensionPointsView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				domainExtensionPointsWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},
		
		loadGtinListView: function() {
			try {
				var gtinListView = codeshelf.gtinlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
				var gtinListViewWindow = codeshelf.window(gtinListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				gtinListViewWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},


		/**
		 * @param {?Object} location
		 */
		loadItemsListView: function(location) {
			var listView;
			if (location) {
				listView = codeshelf.itemListViewForTier(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), location);
			} else {
				listView = codeshelf.itemlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility());
			}

			try {
				var itemWindow = codeshelf.window(listView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				itemWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		/**
		 * @param {?Object} skub
		 */
		loadItemsListViewForSku: function(sku) {
			var listView = codeshelf.itemListViewForSku(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), sku);
			try {
				var itemWindow = codeshelf.window(listView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				itemWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadItemsListViewForGtin: function(gtin, itemMaster, uomMaster) {
			var listView = codeshelf.itemListViewForGtin(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), gtin, itemMaster, uomMaster);
			try {
				var itemWindow = codeshelf.window(listView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				itemWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadWorkInstructionsForDetail: function(detailPersistentId) {
			var listView = codeshelf.workinstructionsByOrderDetail(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), detailPersistentId);
			try {
				var wiWindow = codeshelf.window(listView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				wiWindow.open();
			}
			catch (err) {
				alert(err);
			}
		},

		loadWorkInstructionsForHeader: function(headerPersistentId) {
			var listView = codeshelf.workinstructionsByOrderHeader(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), headerPersistentId);
			try {
				var wiWindow = codeshelf.window(listView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				wiWindow.open();
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

	function setupNavbar(facility, authz, configValues) {
		goog.dom.setProperties(goog.dom.getDocument()['body'], {'class': 'main_body'});
		var navbar = new codeshelf.Navbar();

		var filteredNavbar = navbar.getNavbarItems(facility, authz, configValues);
		goog.dom.appendChild(goog.dom.getDocument()['body'], soy.renderAsElement(codeshelf.templates.mainPage, {navbar: filteredNavbar}));
	}

	function domainPropertiesCallback(websession, facility, authz) {
		var domainPropertiesCallbackObj = {
			exec: function(type,command) {
				if (type == kWebSessionCommandType.OBJECT_PROPERTIES_RESP) {
                    var configValues = command['results'];
                    //this needs to go in the callback
					if (facility != null) {
						setupNavbar(facility, authz, configValues);
					}

				}
			}
		};

		return domainPropertiesCallbackObj;
	}

	function getFacilitiesCallback(authz) {
		var callback = {
			exec: function(type,command) {
				if (type == kWebSessionCommandType.OBJECT_GETTER_RESP) {
					if (command['results'].length === 0) {
						codeshelf.sessionGlobals.setWebsession(websession_);
						// A bit odd here. No facilities were setup on first login or by admin
                        alert("no facilities have been created");
					} else {
                        var facilities = command['results'];
					    var lastFacility = null;
                        var uri = goog.Uri.parse(window.location.href);
                        var requestedFacilityId = uri.getParameterValue("facilityId");
						for (var i = 0; i < facilities.length; i++) {

							lastFacility = facilities[i];
                            var domainId = lastFacility["domainId"];
                            if (domainId === requestedFacilityId) {
                                break;
                            }
						}
						// save the websession and facility so we can launch windows at any time.
						codeshelf.sessionGlobals.setWebsession(websession_);
						codeshelf.sessionGlobals.setFacility(lastFacility);

						var theDomainPropertiesCmd = websession_.createObjectPropertiesRequest('Facility', lastFacility['persistentId']);
				        websession_.sendCommand(theDomainPropertiesCmd, domainPropertiesCallback(websession_, lastFacility, authz), true);
					}
				}
			}
		};

		return callback;
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
            var authz = websession_.getAuthz();
			websession_.setCurrentPage(this);

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

			/*
			var data = {
				'className':    organization_['className'],
				'persistentId': organization_['persistentId'],
				'getterMethod': 'getFacilities'
			};

			var getFacilitiesCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			*/

			var getFacilitiesCmd = websession_.createObjectGetRequest(organization_['className'],organization_['persistentId'],'getFacilities');
			websession.sendCommand(getFacilitiesCmd, getFacilitiesCallback(authz), false);
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

function doFacilityNameDialog() {
	var data = {
		'facility': codeshelf.sessionGlobals.getFacility()
	};
	// See codeshelfApp.facilityNgController defined below. And then referenced in angular.module
	var promise = codeshelf.simpleDlogService.showCustomDialog("partials/set-facility-name.html", "FacilityNgController as controller", data);

	promise.result.then(function(){

	});
}
goog.exportSymbol('doFacilityNameDialog', doFacilityNameDialog);


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

function launchOrdersView(partialOrderIdQuery) {
	codeshelf.windowLauncher.loadOrdersView(partialOrderIdQuery, true); // OUTBOUND orders
}
goog.exportSymbol('launchOrdersView', launchOrdersView);

function launchBatchOrdersView(partialOrderIdQuery) {
	codeshelf.windowLauncher.loadOrdersView(partialOrderIdQuery, false); // CROSS orders, no outbound
}
goog.exportSymbol('launchBatchOrdersView', launchBatchOrdersView);

function launchOrderDetailsView() {
	codeshelf.windowLauncher.loadOrderDetailsView(false); // non-hierarchical
}
goog.exportSymbol('launchOrderDetailsView', launchOrderDetailsView);

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
goog.exportSymbol('launchLocationAliasesListView', launchLocationAliasesListView);

function launchLocationAliasesListView() {
	codeshelf.windowLauncher.loadLocationAliasesListView();
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

function launchSlotListView() {
	codeshelf.windowLauncher.loadSlotListView();
}
goog.exportSymbol('launchSlotListView', launchSlotListView);

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

function launchInventoryView() {
	codeshelf.windowLauncher.loadItemsListView();
}
goog.exportSymbol('launchInventoryView', launchInventoryView);

function launchItemMastersView() {
	codeshelf.windowLauncher.loadItemMastersListView();
}
goog.exportSymbol('launchItemMastersView', launchItemMastersView);

function launchGtinView() {
	codeshelf.windowLauncher.loadGtinListView();
}
goog.exportSymbol('launchGtinView', launchGtinView);

function launchDomainObjectPropertiesView() {
	codeshelf.windowLauncher.loadDomainObjectPropertiesView();
}

goog.exportSymbol('launchDomainObjectPropertiesView', launchDomainObjectPropertiesView);

function launchExtensionPointsView() {
	codeshelf.windowLauncher.loadExtensionPointsView();
}

goog.exportSymbol('launchExtensionPointsView', launchExtensionPointsView);

function launchTestRunner() {
	var theLogger = goog.debug.Logger.getLogger('navbar');
	theLogger.info("Opening all windows available from navbar");
	// But not the about dialog.  18 windows now.
	// But not the tier/slot window, which needs a tier reference to start.
	launchListViewDemo();
	launchPathsView();
	launchWorkAreaEditor();
	launchEdiServicesView();
	launchOrdersView(''); // only outbound orders
	launchOrderDetailsView(); // only outbound orders
	// launchWorkAreaView();
	launchFacilityEditor();
	launchAislesListView();
	launchLedControllersListView();
	launchLocationAliasesListView();
	launchCheListView();
	launchBayListView();
	launchTierListView();
	launchContainerUseListView();
	launchWorkInstructionListView();
	launchInventoryView();
	launchItemMastersView();
	launchDomainObjectPropertiesView();

}
goog.exportSymbol('launchTestRunner', launchTestRunner);


/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.FacilityNgController = function($scope, $modalInstance, websession, data){

	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;

	$scope['facility'] = data['facility'];

	// tweaking separate fields
	// first has html/angular scope matching js field.
	$scope['facility']['description'] = data['facility']['description'];
	// second could match. Just being different to practice for when we have to be different
	$scope['facility']['domainId'] = data['facility']['domainId'];
	$scope['facility']['primaryChannel'] = data['facility']['primaryChannel'];
	$scope['facility']['primarySiteControllerId'] = data['facility']['primarySiteControllerId'];

};

/**
 * @export
 */
codeshelfApp.FacilityNgController.prototype.ok = function(){
	var facility = this.scope_['facility'];
	facility["className"] = "Facility";
	this.websession_.update(facility, ["domainId", "description", "primaryChannel", "primarySiteControllerId"]).then(function(newFacility) {
		codeshelf.sessionGlobals.setFacility(newFacility);
	});
	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.FacilityNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('FacilityNgController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.FacilityNgController]);
