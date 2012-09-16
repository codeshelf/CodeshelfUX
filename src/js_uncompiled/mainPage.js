/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.38 2012/09/16 00:12:47 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.require('domainobjects');
goog.require('codeshelf.ediservicesview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.facilityeditorview');
goog.require('codeshelf.workareaeditorview');
goog.require('codeshelf.initializenewclient');
goog.require('codeshelf.listdemoview');
goog.require('codeshelf.listview');
goog.require('codeshelf.templates');
goog.require('codeshelf.window');
goog.require('goog.debug');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');
goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');


codeshelf.mainpage = function() {

	var application_;
	var organization_;
	var websession_;
	var frame_;
	var frameTop_ = 5;
	var frameLeft_ = 5;
	var limits_;

	function updateFrameSize(size) {
		// goog.style.setSize(goog.dom.getElement('frame'), size);
		frame_.style.width = size.width - 15 + 'px';
		frame_.style.height = size.height - 5 + 'px';
	}

	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_GETTER_RESP) {
						if (command['data']['results'].length === 0) {
							var clientInitializer = codeshelf.initializenewclient();
							clientInitializer.start(websession_, application_.getOrganization(), frame_);
						} else {
							for (var i = 0; i < command['data']['results'].length; i++) {
								var facility = command['data']['results'][i];
								try {
									// Load the GMaps API and init() when done.
									if (typeof google !== "undefined") {
										google.load('maps', '3.8', {'other_params': 'sensor=false', 'callback': function() {
											var facilityEditorView = codeshelf.facilityeditorview(websession_, application_.getOrganization(), facility);
											var facilityEditorWindow = codeshelf.window('Facility Editor', facilityEditorView, frame_, undefined);
											facilityEditorWindow.open();
										}});
									}

									var workAreaEditorView = codeshelf.workareaeditorview(websession_, facility);
									var workAreaEditorWindow = codeshelf.window('Workarea Editor', workAreaEditorView, frame_, undefined);
									workAreaEditorWindow.open();

//									var ediServicesView = codeshelf.ediservicesview(websession_, facility);
//									var ediServicesWindow = codeshelf.window('EDI Services', ediServicesView, frame_, undefined);
//									ediServicesWindow.open();

									var hierarchyMap = [];
									hierarchyMap[0] =domainobjects.facility.className;
									hierarchyMap[1] = domainobjects.dropboxservice.className;
									hierarchyMap[2] = domainobjects.edidocumentlocator.className;

									var filter = 'parentOrganization.persistentId = :theId';
									var filterParams = [
										{ 'name': "theId", 'value': organization_['persistentId']}
									]

									var ediServicesView = codeshelf.hierarchylistview(websession_, domainobjects.facility, filter, filterParams, hierarchyMap);
									var ediServicesWindow = codeshelf.window('EDI Services', ediServicesView, frame_, undefined);
									ediServicesWindow.open();
								}
								catch
									(err) {
									alert(err);
								}

							}
						}
					}
				}
			}
		}

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

			websession_.setCurrentPage(this);

			goog.dom.setProperties(goog.dom.getDocument().body, {'class': 'main_body'});
			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.mainPage));

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
						gFocusedWindow++
					} else {
						gFocusedWindow = 0;
					}
					var window = gWindowList[gFocusedWindow];
					window.focusWindow();
				}
			});

			var listDemoView = codeshelf.listdemoview();
			var listDemoWindow = codeshelf.window('Large Demo List', listDemoView, frame_, undefined);
			listDemoWindow.open();

			var filter = 'parentOrganization.persistentId = :theId';
			var filterParams = [
				{ 'name': "theId", 'value': organization_['persistentId']}
			]
			var listView = codeshelf.listview(websession_, domainobjects.facility, filter, filterParams);
			var listWindow = codeshelf.window('Facilities List', listView, frame_, undefined);
			listWindow.open();

			var data = {
				'className':    organization_['className'],
				'persistentId': organization_['persistentId'],
				'getterMethod': 'getFacilities'
			}

			var websession = application_.getWebsession();
			var getFacilitiesCmd = websession.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			websession.sendCommand(getFacilitiesCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_GETTER_RESP), false);
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
		}
	}

	return self;
}
