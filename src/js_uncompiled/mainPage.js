/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: mainPage.js,v 1.15 2012/03/30 23:23:08 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.mainpage');
goog.require('codeshelf.templates');
goog.require('codeshelf.domainobjects');
goog.require('codeshelf.listdemo');
goog.require('codeshelf.listview');
goog.require('codeshelf.facilityeditor');
goog.require('codeshelf.window');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Size');
goog.require('goog.dom.ViewportSizeMonitor');

codeshelf.mainpage = function () {

	var application_;
	var websession_;
	var thisMainpage_;
	var frame_;
	var frameTop_ = 5;
	var frameLeft_ = 5;
	var limits_;

	return {

		enter:function (application, websession) {

			application_ = application;
			websession_ = websession;
			thisMainpage_ = this;

			websession_.setCurrentPage(this);

			goog.dom.setProperties(goog.dom.getDocument().body, {class:'main_body'});
			goog.dom.appendChild(goog.dom.getDocument().body, soy.renderAsElement(codeshelf.templates.mainPage));

			z_ = 5;
			frame_ = goog.dom.query('.frame')[0];
			frame_.style.top = frameTop_ + 5 + 'px';
			frame_.style.left = frameLeft_ + 'px';

			limits_ = new goog.math.Rect(frameTop_, frameLeft_, 750, 600);

			this.updateFrameSize(goog.dom.getViewportSize());

			// Start listening for viewport size changes.
			var vsm = new goog.dom.ViewportSizeMonitor();
			goog.events.listen(vsm, goog.events.EventType.RESIZE, function (e) {
				size = vsm.getSize();
				size.height -= 10;
				thisMainpage_.updateFrameSize(size);
			});

			var listdemo = codeshelf.listdemo();
			listdemo.launchListDemo(frame_);

			var listview = codeshelf.listview(codeshelf.domainobjects.digg);
			listview.launchListView(frame_);

			var organization = application_.getOrganization();

			var data = {
				className:   organization.className,
				persistentId:organization.persistentId,
				getterMethod:'getFacilities'
			}

			var websession = application_.getWebsession();
			var getFacilitiesCmd = websession.createCommand(kWebSessionCommandType.OBJECT_GETTER_REQ, data);
			websession.sendCommand(getFacilitiesCmd, thisMainpage_.mainPageCallback(kWebSessionCommandType.OBJECT_GETTER_RESP), false);
		},

		exit:function () {
			websession_.setCurrentPage(undefined);
		},

		updateFrameSize:function (size) {
			// goog.style.setSize(goog.dom.getElement('frame'), size);
			frame_.style.width = size.width - 15 + 'px';
			frame_.style.height = size.height - 5 + 'px';
		},

		mainPageCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else {
						if (command.type == kWebSessionCommandType.OBJECT_GETTER_RESP) {
							for (var i = 0; i < command.data.result.length; i++) {
								var object = command.data.result[i];
								try {
									var facilityEditor = codeshelf.facilityeditor();
									facilityEditor.start(websession_, application_.getOrganization(), frame_, object.persistentId);
								}
								catch (err) {
									alert(err);
								}

							}
						}
					}
				},
				getExpectedResponseType:function () {
					return expectedResponseType_;
				}
			}
			return callback;
		}
	}
}
