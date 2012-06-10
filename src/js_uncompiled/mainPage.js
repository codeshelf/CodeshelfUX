/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.30 2012/06/10 03:13:31 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.require('codeshelf.domainobjects');
goog.require('codeshelf.facilityeditorview');
goog.require('codeshelf.workareaeditorview');
goog.require('codeshelf.initializenewclient');
goog.require('codeshelf.listdemo');
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
	var websession_;
	var thisMainpage_;
	var frame_;
	var frameTop_ = 5;
	var frameLeft_ = 5;
	var limits_;

	return {

		enter: function(application, websession) {

			application_ = application;
			websession_ = websession;
			thisMainpage_ = this;

			var organization = application_.getOrganization();

			websession_.setCurrentPage(this);

			goog.dom.setProperties(goog.dom.getDocument().body, {'class': 'main_body'});
			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.mainPage));

			frame_ = goog.dom.query('.frame')[0];
			frame_.style.top = frameTop_ + 5 + 'px';
			frame_.style.left = frameLeft_ + 'px';

			limits_ = new goog.math.Rect(frameTop_, frameLeft_, 750, 600);

			thisMainpage_.updateFrameSize(goog.dom.getViewportSize());

			// Start listening for viewport size changes.
			var vsm = new goog.dom.ViewportSizeMonitor();
			goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
				var size = vsm.getSize();
				size.height -= 10;
				thisMainpage_.updateFrameSize(size);
			});

			goog.events.listen(document, goog.events.EventType.KEYPRESS, function(e) {
				if (e.keyCode === goog.events.KeyCodes.NUM_ZERO) {
					if (focusedWindow < windowList.length - 1) {
						focusedWindow++
					} else {
						focusedWindow = 0;
					}
					var window = windowList[focusedWindow];
					window.focusWindow();
				}
			});

			var listDemoView = codeshelf.listdemo();
			var listDemoWindow = codeshelf.window('Large Demo List', listDemoView, frame_, undefined);
			listDemoWindow.open();

			var filter = 'parentOrganization.persistentId = :theId';
			var filterParams = [
				{ 'name': "theId", 'value': organization['persistentId']}
			]
			var listView = codeshelf.listview(websession_, codeshelf.domainobjects.facility, filter, filterParams);
			var listWindow = codeshelf.window('Facilities List', listView, frame_, undefined);
			listWindow.open();

			var data = {
				'className':    organization['className'],
				'persistentId': organization['persistentId'],
				'getterMethod': 'getFacilities'
			}

			var websession = application_.getWebsession();
			var getFacilitiesCmd = websession.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			websession.sendCommand(getFacilitiesCmd, thisMainpage_.websocketCmdCallback(kWebSessionCommandType.OBJECT_GETTER_RESP), false);
		},

		exit: function() {
			websession_.setCurrentPage(undefined);
		},

		updateFrameSize: function(size) {
			// goog.style.setSize(goog.dom.getElement('frame'), size);
			frame_.style.width = size.width - 15 + 'px';
			frame_.style.height = size.height - 5 + 'px';
		},

		websocketCmdCallback: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command.d.hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command.t == kWebSessionCommandType.OBJECT_GETTER_RESP) {
							if (command.d.r.length === 0) {
								var clientInitializer = codeshelf.initializenewclient();
								clientInitializer.start(websession_, application_.getOrganization(), frame_);
							} else {
								for (var i = 0; i < command.d.r.length; i++) {
									var facility = command.d.r[i];
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
									}
									catch (err) {
										alert(err);
									}

								}
							}
						}
					}
				},
				getExpectedResponseType: function() {
					return expectedResponseType_;
				}
			}
			return callback;
		}
	}
}
