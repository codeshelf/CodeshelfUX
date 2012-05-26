/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.7 2012/05/26 03:48:26 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');
goog.require('goog.math');

codeshelf.workareaeditorview = function(websession, facility) {

	var thisWorkAreaEditorView_;
	var websession_ = websession;
	var facility_ = facility;
	var graphics_;
	var vertices_ = [];
	var points_ = [];
	var anchorPoint_;
	var drawArea_;
	var facilityBounds_ = { x: 0, y: 0 };
	var rotateByDeg_ = 0;

	thisWorkAreaEditorView_ = {

		setupView: function(contentElement) {

			drawArea_ = contentElement;
			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(drawArea_.clientWidth, drawArea_.clientHeight);
			graphics_.render(drawArea_);

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
			facilityBounds_ = { x: 0, y: 0 };
			thisWorkAreaEditorView_.draw();
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
			var lat1 = goog.math.toRadians(latArg1)
			var lat2 = goog.math.toRadians(latArg2);
			var dLon = goog.math.toRadians(lonArg2 - lonArg1);

			var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
			if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
			var bearing = Math.atan2(dLon, dPhi);
			bearing = (goog.math.toDegrees(bearing) + 360) % 360;

			return bearing;
		},

		convertPolarToCartesian: function(radius, angle) {
			var y = radius * Math.cos(goog.math.toRadians(angle));
			var x = radius * Math.sin(goog.math.toRadians(angle));

			return {'x': x, 'y': y};
		},

		convertCartesianToPolar: function(point1, point2) {
			var x = point2.x - point1.x;
			var y = point2.y - point1.y;
			var dist = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
			var angle = Math.atan(y / x) * 360 / 2 / Math.PI;
			if (x >= 0 && y >= 0) {
				angle = angle;
			} else if (x < 0 && y >= 0) {
				angle = 180 + angle;
			} else if (x < 0 && y < 0) {
				angle = 180 + angle;
			} else if (x > 0 && y < 0) {
				angle = 360 + angle;
			}

			return { 'angle': angle, 'dist': dist};
		},

		convertLatLongToXY: function(lat1, lon1, lat2, lon2) {
			var dist = thisWorkAreaEditorView_.computeDistanceMeters(lat1, lon1, lat2, lon2);
			var bearing = thisWorkAreaEditorView_.computeBearing(lat1, lon1, lat2, lon2);
			var coord = thisWorkAreaEditorView_.convertPolarToCartesian(dist, bearing);
			return coord;
		},

		normalizeCoordinates: function(mostNegPoint) {

			// Compute all of the points for the facility relative to the anchor lat/long.
			// (possibly negative if the anchor lat/long is east or south of other facility lat/longs.)
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
					if (points_[i].x < mostNegPoint.x) {
						mostNegPoint.x = points_[i].x;
					}
					if (points_[i].y < mostNegPoint.y) {
						mostNegPoint.y = points_[i].y;
					}

					// Figure out the angle between point 1 and 2.
					var polar = thisWorkAreaEditorView_.convertCartesianToPolar(points_[0], points_[1]);
					rotateByDeg_ = 0 - polar.angle;
				}

			}

			// Translate the whole facility into positive coordinate space.
			facilityBounds_ = { x: 0, y: 0 };
			for (var i = 0; i < points_.length; i++) {
				var point = points_[i];

				point.x += Math.abs(mostNegPoint.x);
				point.y += Math.abs(mostNegPoint.y);

				if (point.x > facilityBounds_.x) {
					facilityBounds_.x = point.x;
				}

				if (point.y > facilityBounds_.y) {
					facilityBounds_.y = point.y;
				}
			}

			// Remember the anchor point;
			anchorPoint_ = points_[0];

		},

		rotatePoint: function(point, a) {
			// Convert to radians because that's what JavaScript likes
			var a = goog.math.toRadians(a);

			// Find the midpoints for rotation.
			var xm = anchorPoint_.x; //facilityBounds_.x / 2;
			var ym = anchorPoint_.y; //facilityBounds_.y / 2;

			// Subtract midpoints, so that midpoint is translated to origin and add it in the end again
			var xr = (point.x - xm) * Math.cos(a) - (point.y - ym) * Math.sin(a) + xm;
			var yr = (point.x - xm) * Math.sin(a) + (point.y - ym) * Math.cos(a) + ym;

			// Return the rotated point.
			return { x: xr, y: yr };
		},

		adjustPointForReferenceFrame: function(point, mostNegPoint) {

			// Rotate the points, so that the primary path segment is aligned with 0deg or 90deg.
			var resultPoint = thisWorkAreaEditorView_.rotatePoint(point, rotateByDeg_);

			// Scale it to 80% of the draw area.
			var drawRatio = Math.min(drawArea_.clientHeight / facilityBounds_.y, drawArea_.clientWidth / facilityBounds_.x) * 0.9;

			resultPoint.x *= drawRatio;
			resultPoint.y *= drawRatio;

			resultPoint.x += Math.abs(mostNegPoint.x);
			resultPoint.y += Math.abs(mostNegPoint.y);

			// Mirror Y since the zero scale is upside down in DOM.
			resultPoint.y = drawArea_.clientHeight - resultPoint.y - (drawArea_.clientHeight - (facilityBounds_.y * drawRatio * 0.8));

			return {x: resultPoint.x, y: resultPoint.y};
		},

		computePath: function(stroke) {
			var path = new goog.graphics.Path();

			points_ = [];
			minDim_ = Math.min(drawArea_.clientWidth, drawArea_.clientHeight);
			if (Object.size(vertices_) === vertices_.length) {
				mostNegPoint = { x: 0, y: 0};
				thisWorkAreaEditorView_.normalizeCoordinates(mostNegPoint);
				var firstPoint;
				for (var i = 0; i < points_.length; i++) {
					var point = points_[i];
					// Transpose and rotate
					var drawPoint = thisWorkAreaEditorView_.adjustPointForReferenceFrame(point, mostNegPoint);

					if (i === 0) {
						path.moveTo(drawPoint.x, drawPoint.y);
						firstPoint = drawPoint;
					} else {
						path.lineTo(drawPoint.x, drawPoint.y);
					}
				}
				path.lineTo(firstPoint.x, firstPoint.y);
			}
			return path;
		},

		drawPath: function(path, stroke) {
			graphics_.drawPath(path, stroke, null);
		},

		startDraw: function() {
			graphics_.clear();
		},

		endDraw: function() {

		},

		draw: function() {
			thisWorkAreaEditorView_.startDraw();
			var path = thisWorkAreaEditorView_.computePath();
			var stroke = new goog.graphics.Stroke(2, 'black');
			thisWorkAreaEditorView_.drawPath(path, stroke);
			thisWorkAreaEditorView_.endDraw();
		},

		handleCreateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.draw();
		},

		handleUpdateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.draw();
		},

		handleDeleteVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = null;
			thisWorkAreaEditorView_.draw();
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
