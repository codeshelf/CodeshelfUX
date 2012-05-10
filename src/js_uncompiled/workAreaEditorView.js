/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.2 2012/05/10 07:14:43 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');
goog.require('goog.math');

codeshelf.workareaeditorview = function(websession, facility) {

	var thisWorkAreaEditorView_;
	var websession_ = websession;
	var facility_ = facility;
	var graphics_;
	var vertices = [];
	var points = [];

	thisWorkAreaEditorView_ = {

		setupView: function(contentElement) {

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(600, 200);

		},

		open: function() {
			// Create the filter to listen to all vertex updates for this facility.
			var data = {
				'className':     codeshelf.domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, thisWorkAreaEditorView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		computeDistanceMeters: function(lat1, lon1, lat2, lon2) {
			var r = 6371; // km
			var dLat = goog.math.toRadians(lat2 - lat1);
			var dLon = goog.math.toRadians(lon2 - lon1);
			var lat1 = goog.math.toRadians(lat1);
			var lat2 = goog.math.toRadians(lat2);

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var dist = r * c * 1000;

			return dist;
		},

		computeBearing: function(lat1, lon1, lat2, lon2) {
			var dLon = goog.math.toRadians(lon2 - lon1);
			var y = Math.sin(dLon) * Math.cos(lat2);
			var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
			var bearing = goog.math.toDegrees(Math.atan2(y, x));
			return bearing;
		},

		computePath: function() {

			var lastVertex;
			for (vertex in vertices) {
				if (vertices.hasOwnProperty(vertex)) {
					var vertex = vertices[vertex];
					if (lastVertex !== undefined) {
						var dist = thisWorkAreaEditorView_.computeDistanceMeters(lastVertex.PosY, lastVertex.PosX, vertex.PosY, vertex.PosX);
						var bearing = thisWorkAreaEditorView_.computeBearing(lastVertex.PosY, lastVertex.PosX, vertex.PosY, vertex.PosX);
						points[vertex.DrawOrder] = {};
						points[vertex.DrawOrder].dist = dist;
						points[vertex.DrawOrder].bearing = bearing;
					}
					lastVertex = vertex;
				}
			}

		},

		handleCreateVertexCmd: function(lat, lon, object) {
			vertices[object.DrawOrder] = object;
			thisWorkAreaEditorView_.computePath();
		},

		handleUpdateVertexCmd: function(lat, lon, object) {
			vertices[object.DrawOrder] = object;
			thisWorkAreaEditorView_.computePath();
		},

		handleDeleteVertexCmd: function(lat, lon, object) {
			vertices[object.DrawOrder] = null;
			thisWorkAreaEditorView_.computePath();
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
									if (object['op'] === 'cr') {
										thisWorkAreaEditorView_.handleCreateVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'up') {
										thisWorkAreaEditorView_.handleUpdateVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'dl') {
										thisWorkAreaEditorView_.handleDeleteVertexCmd(object['PosY'], object['PosX'], object);
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
