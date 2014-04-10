/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.52 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
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
								loadFacilityWindows(facility);
							}
						}
					}
				}
			}
		};

		return callback;
	}

	function getWindowDragLimit() {
		// we want the right and bottom limits large as the GCT window knows to scroll there.
		// As for left and top, zeros are ok. See below it comes from "frame_ = goog.dom.query('.frame')[0];"
		// which will have zeros for top and left
		var theRectLimit = new goog.math.Rect(0,0,10000,10000);
		return theRectLimit;
	}


	function loadFacilityWindows(facility) {
		// keep old behavior of launching all for now.
		// Later, if no facility exists yet, launch the facility editor.
		// If one does exist, launch orders

		loadListDemoView();

		loadFacilityEditor(facility);

		loadWorkAreaEditorView(facility);

		loadEdiServicesView(facility);

		loadOrdersView(facility);

		loadWorkAreaView(facility);
	}

	function loadListDemoView() {
		try {
			var listDemoView = codeshelf.listdemoview();
			var listDemoWindow = codeshelf.window(listDemoView, frame_, getWindowDragLimit());
			listDemoWindow.open();
		}
		catch (err) {
			alert(err);
		}
	}

	function loadFacilityEditor(facility) {
		try {
			// Load the GMaps API and init() when done.
			if (typeof google !== 'undefined') {
				google.load('maps', '3', {'other_params': 'sensor=false', 'callback': function() {
					var facilityEditorView = codeshelf.facilityeditorview(websession_, application_.getOrganization(), facility);
					var facilityEditorWindow = codeshelf.window(facilityEditorView, frame_, getWindowDragLimit());
					facilityEditorWindow.open();
				}});
			}
		}
		catch (err) {
			alert(err);
		}
	}

	function loadWorkAreaEditorView(facility) {
		try {
			var workAreaEditorView = codeshelf.workareaeditorview(websession_, facility);
			var workAreaEditorWindow = codeshelf.window(workAreaEditorView, frame_, getWindowDragLimit());
			workAreaEditorWindow.open();
		}
		catch (err) {
			alert(err);
		}
	}

	function loadEdiServicesView(facility) {
		try {
			var ediServicesView_ = codeshelf.ediservicesview(websession_, facility);
			var ediServicesWindow = codeshelf.window(ediServicesView_, frame_, getWindowDragLimit());
			ediServicesWindow.open();
		}
		catch (err) {
			alert(err);
		}
	}

	function loadWorkAreaView(facility) {
		try {
			var workAreaView = codeshelf.workareaview(websession_, facility);
			var workAreaWindow = codeshelf.window(workAreaView, frame_, getWindowDragLimit());
			workAreaWindow.open();
		}
		catch (err) {
				alert(err);
		}
	}

	function loadOrdersView(facility) {
		try {
			var ordersView = codeshelf.ordersview(websession_, facility);
			var ordersWindow = codeshelf.window(ordersView, frame_, getWindowDragLimit());
			ordersWindow.open();
		}
		catch (err) {
				alert(err);
		}
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
