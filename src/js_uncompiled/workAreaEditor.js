/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditor.js,v 1.1 2012/05/07 06:34:27 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditor');
goog.require('codeshelf.templates');

codeshelf.workareaeditor = function() {

	var thisWorkAreaEditor_;
	var websession_;
	var parentFrame_;
	var facility_;
	var graphics_;

	thisWorkAreaEditor_ = {

		start: function(websession, parentFrame, facility) {

			websession_ = websession;
			parentFrame_ = parentFrame;
			facility_ = facility;
			var editorWindow = codeshelf.window();
			editorWindow.init("Work Area Editor", parentFrame_, undefined, undefined);
			editorWindow.open();
			var contentPane = editorWindow.getContentElement();

			graphics_ = goog.graphics.createGraphics(600, 200);
		},

		websocketCmdCallback: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command.d.hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command.t == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command.d.r.length; i++) {
								var object = command.d.r[i];

								// Make sure the class name matches.
								if (object['className'] === codeshelf.domainobjects.vertex.classname) {
									var latLng = new google.maps.LatLng(object['PosY'], object['PosX']);

									if (object['op'] === 'cr') {
										thisFacilityEditor_.handleCreateVertexCmd(latLng, object);
									} else if (object['op'] === 'up') {
										thisFacilityEditor_.handleUpdateVertexCmd(latLng, object);
									} else if (object['op'] === 'dl') {
										thisFacilityEditor_.handleDeleteVertexCmd(latLng, object);
									}
								}
							}
						} else if (command.t == kWebSessionCommandType.OBJECT_CREATE_RESP) {
						} else if (command.t == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
						} else if (command.t == kWebSessionCommandType.OBJECT_DELETE_RESP) {
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

	return thisWorkAreaEditor_;
}
