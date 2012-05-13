/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.4 2012/05/13 03:03:54 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');
goog.require('goog.math');

codeshelf.workareaeditorview = function(websession, facility) {

	var thisWorkAreaEditorView_;
	var websession_ = websession;
	var facility_ = facility;
	var graphics_;
	var path_;
	var vertices_ = [];
	var points_ = [];

	thisWorkAreaEditorView_ = {

		setupView: function(contentElement) {

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(contentElement.clientWidth, contentElement.clientHeight);
			graphics_.render(contentElement);

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

		resize: function() {

		},

		computeDistanceMeters: function(latArg1, lonArg1, latArg2, lonArg2) {
			var r = 6371; // km
			var dLat = goog.math.toRadians(latArg2 - latArg1);
			var dLon = goog.math.toRadians(lonArg2 - lonArg1);
			var lat1 = goog.math.toRadians(latArg1);
			var lat2 = goog.math.toRadians(latArg2);

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var dist = r * c * 1000;

			return dist;
		},

		computeBearing: function(latArg1, lonArg1, latArg2, lonArg2) {
			var dLon = lonArg2 - lonArg1;//goog.math.toRadians(lonArg2 - lonArg1);
			var y = Math.sin(dLon) * Math.cos(latArg2);
			var x = Math.cos(latArg1) * Math.sin(latArg2) - Math.sin(latArg1) * Math.cos(latArg2) * Math.cos(dLon);
			var bearing = goog.math.toDegrees(Math.atan2(y, x));
			return bearing;
		},

		convertPolarToCartesian: function(radius, angle) {
			var y = radius * Math.cos(goog.math.toRadians(angle));
			var x = radius * Math.sin(goog.math.toRadians(angle));

			return {'x': x, 'y': y};
		},

		convertLatLongToXY: function(lat1, lon1, lat2, lon2) {
			var dist = thisWorkAreaEditorView_.computeDistanceMeters(lat1, lon1, lat2, lon2);
			var bearing = thisWorkAreaEditorView_.computeBearing(lat1, lon1, lat2, lon2);
			var coord = thisWorkAreaEditorView_.convertPolarToCartesian(dist, bearing);
			return coord;
		},

		computePath: function() {
			points_ = [];
			var mostNegX = 0;
			var mostNegY = 0;
			for (var i = 0; i < vertices_.length; i++) {
				var vertex = vertices_[i];
				if (i === 0) {
					points_[0] = {};
					points_[0].x = 0;
					points_[0].y = 0;
				} else if (points_[i - 1] !== undefined) {
					var lastVertex = vertices_[i - 1];
					var coord = thisWorkAreaEditorView_.convertLatLongToXY(lastVertex.PosY, lastVertex.PosX, vertex.PosY, vertex.PosX);
					points_[i] = {};
					points_[i].x = points_[i - 1].x + coord.x;
					points_[i].y = points_[i - 1].y + coord.y;
					if (points_[i].x < mostNegX) {
						mostNegX = points_[i].x;
					}
					if (points_[i].y < mostNegY) {
						mostNegY = points_[i].y;
					}
				}
			}

			// Create the path from it.
			path_ = graphics_.createPath();
			for (var i = 0; i < vertices_.length; i++) {
				var point = points_[i];
				// Offset everything to be greater than zero.
				point.x += Math.abs(mostNegX + 5);
				point.y += Math.abs(mostNegY + 5);

				if (i === 0) {
					path_.moveTo(point.x, point.y);
				} else {
					path_.lineTo(point.x, point.y);
				}
			}
			stroke = new goog.graphics.Stroke(2, 'black');
			graphics_.drawPath(path_, stroke, null);

		},

		handleCreateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.computePath();
		},

		handleUpdateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.computePath();
		},

		handleDeleteVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = null;
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
