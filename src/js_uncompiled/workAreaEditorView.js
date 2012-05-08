/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.1 2012/05/08 06:45:09 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');

codeshelf.workareaeditorview = function(websession, facility) {

	var thisWorkAreaEditorView_;
	var websession_ = websession;
	var facility_ = facility;
	var graphics_;

	thisWorkAreaEditorView_ = {

		setupView: function(contentElement) {

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(600, 200);

		},

		open: function() {

		},

		close: function() {

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

	return thisWorkAreaEditorView_;
}
