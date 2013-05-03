/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.62 2013/05/03 06:06:51 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.graphics');
goog.require('goog.graphics.paths');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Dialog');
goog.require('raphael');

/**
 * The facility in pixel space (instead of GPS space) where the user can work on it in a normal size/orientation.
 * @param websession The websession used for updates.
 * @param facility The facility we're editing.
 * @return {Object} The work area editor.
 */
codeshelf.workareaeditorview = function(websession, facility, options) {

	var websession_ = websession;
	var facility_ = facility;
	var facilityPoints_ = {};
	var workAreaEditorPane_;
	var graphics_;
	var vertices_ = [];
	var rotateFacilityByDeg_ = 0;
	var facilityPath_;
	var startDragPoint_;
	var currentRect_;
	var currentDrawRect_;
	var aisles_ = [];
	var paths_ = [];
	var consts = {};

	function createAisle() {

		Object.defineProperty(consts, 'feetInMeters', {value: 0.3048,
			writable:                                         false,
			enumerable:                                       true,
			configurable:                                     true});

		var buttonSet = new goog.ui.Dialog.ButtonSet().
			addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE).
			addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);

		var dataEntryDialog = codeshelf.dataentrydialog('Create Aisle', buttonSet);
		var dialogContentElement = soy.renderAsElement(codeshelf.templates.createAisleDialogContent);
		dataEntryDialog.setupDialog(dialogContentElement);
		dataEntryDialog.createField('aisleId', 'text', true);
		dataEntryDialog.createField('bayHeight', 'text');
		dataEntryDialog.createField('bayWidth', 'text');
		dataEntryDialog.createField('bayDepth', 'text');
		dataEntryDialog.createField('baysHigh', 'text');
		dataEntryDialog.createField('baysLong', 'text');
		dataEntryDialog.createField('opensLowSide', 'checkbox');
		dataEntryDialog.open(function(event, dialog) {
			                     if (event.key === goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE.key) {
				                     var xOriginMeters = startDragPoint_.x / self.getPixelsPerMeter();
				                     var yOriginMeters = startDragPoint_.y / self.getPixelsPerMeter();

				                     var aisleId = dialog.getFieldValue('aisleId');
				                     var bayHeight = dialog.getFieldValue('bayHeight') * consts['feetInMeters'];
				                     var bayWidth = dialog.getFieldValue('bayWidth') * consts['feetInMeters'];
				                     var bayDepth = dialog.getFieldValue('bayDepth') * consts['feetInMeters'];
				                     var baysHigh = dialog.getFieldValue('baysHigh');
				                     var baysLong = dialog.getFieldValue('baysLong');
				                     var opensLowSide = dialog.getFieldValue('opensLowSide');


				                     var runInXDim = true;
				                     if (currentRect_.width < currentRect_.height) {
					                     runInXDim = false;
				                     }

				                     // Call Facility.createAisle();
				                     var data = {
					                     'className':    domainobjects['Facility']['className'],
					                     'persistentId': facility_['persistentId'],
					                     'methodName':   'createAisle',
					                     'methodArgs':   [
						                     { 'name': 'inAisleId', 'value': aisleId, 'classType': 'java.lang.String'},
						                     { 'name': 'inPosXMeters', 'value': xOriginMeters, 'classType': 'java.lang.Double'},
						                     { 'name': 'inPosYMeters', 'value': yOriginMeters, 'classType': 'java.lang.Double'},
						                     { 'name': 'inProtoBayXDimMeters', 'value': bayWidth, 'classType': 'java.lang.Double'},
						                     { 'name': 'inProtoBayYDimMeters', 'value': bayDepth, 'classType': 'java.lang.Double'},
						                     { 'name': 'inProtoBayZDimMeters', 'value': bayHeight, 'classType': 'java.lang.Double'},
						                     { 'name': 'inProtoBaysHigh', 'value': baysHigh, 'classType': 'java.lang.Integer'},
						                     { 'name': 'inProtoBaysLong', 'value': baysLong, 'classType': 'java.lang.Integer'},
						                     { 'name': 'inRunInXDir', 'value': runInXDim, 'classType': 'java.lang.Boolean'},
						                     { 'name': 'inOpensLowSide', 'value': opensLowSide, 'classType': 'java.lang.Boolean'}
					                     ]
				                     };

				                     var createAisleCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
				                     websession_.sendCommand(createAisleCmd,
				                                             websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ),
				                                             true);
			                     }
		                     }
		);
	}

	function computeDistanceMeters(latArg1, lonArg1, latArg2, lonArg2) {
		var r = 6371; // km
		var dLat = goog.math.toRadians(latArg2 - latArg1);
		var dLon = goog.math.toRadians(lonArg2 - lonArg1);
		var lat1 = goog.math.toRadians(latArg1);
		var lat2 = goog.math.toRadians(latArg2);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var dist = r * c * 1000;

		return dist;
	}

	function computeBearing(latArg1, lonArg1, latArg2, lonArg2) {
		var lat1 = goog.math.toRadians(latArg1);
		var lat2 = goog.math.toRadians(latArg2);
		var dLon = goog.math.toRadians(lonArg2 - lonArg1);

		var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
		if (Math.abs(dLon) > Math.PI) dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
		var bearing = Math.atan2(dLon, dPhi);
		bearing = (goog.math.toDegrees(bearing) + 360) % 360;

		return bearing;
	}

	function convertPolarToCartesian(radius, angle) {
		var y = radius * Math.cos(goog.math.toRadians(angle));
		var x = radius * Math.sin(goog.math.toRadians(angle));

		return {'x': x, 'y': y};
	}

	function convertCartesianToPolar(point1, point2) {
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
	}

	function convertLatLongToXY(lat1, lon1, lat2, lon2) {
		var dist = computeDistanceMeters(lat1, lon1, lat2, lon2);
		var bearing = computeBearing(lat1, lon1, lat2, lon2);
		var coord = convertPolarToCartesian(dist, bearing);
		return coord;
	}

	function convertGpsToPoints() {

		var points = [];
		// Compute all of the points for the facility relative to the anchor lat/long.
		// (possibly negative if the anchor lat/long is east or south of other facility lat/longs.)
		for (var i = 0; i < Object.size(vertices_); i++) {
			var vertex = vertices_[i];
			if (i === 0) {
				points[0] = {};
				points[0].x = 0;
				points[0].y = 0;
			} else if (points[i - 1] !== undefined) {
				var lastVertex = vertices_[i - 1];
				var coord = convertLatLongToXY(lastVertex['posY'], lastVertex['posX'], vertex['posY'], vertex['posX']);
				points[i] = {};
				points[i].x = points[i - 1].x + coord.x;
				points[i].y = points[i - 1].y + coord.y;

				// Figure out the angle between point 1 and 2.
				var polar = convertCartesianToPolar(points[0], points[1]);
				rotateFacilityByDeg_ = 0 - polar['angle'];
			}

		}
		return points;
	}

	function rotatePoint(aroundPoint, point, a) {
		// Convert to radians because that's what JavaScript likes
		var a = goog.math.toRadians(a);

		// Find the midpoints for rotation.
		var xm = aroundPoint.x;
		var ym = aroundPoint.y;

		// Subtract midpoints, so that midpoint is translated to origin and add it in the end again
		var xr = (point.x - xm) * Math.cos(a) - (point.y - ym) * Math.sin(a) + xm;
		var yr = (point.x - xm) * Math.sin(a) + (point.y - ym) * Math.cos(a) + ym;

		// Return the rotated point.
		//return { x: xr, y: yr };
		point.x = xr;
		point.y = yr;
	}

	function rotatePoints(points, mostNegPoint) {
		for (var i = 0; i < Object.size(points); i++) {
			var point = points[i];
			if (i > 0) {
				rotatePoint(points[0], point, rotateFacilityByDeg_);
			}
			if (point.x < mostNegPoint.x) {
				mostNegPoint.x = point.x;
			}
			if (point.y < mostNegPoint.y) {
				mostNegPoint.y = point.y;
			}
		}
	}

	function translatePoints(points, mostNegPoint, mostPosPoint) {
		for (var i = 0; i < Object.size(points); i++) {
			var point = points[i];
			point.x += Math.abs(mostNegPoint.x);
			point.y += Math.abs(mostNegPoint.y);

			if (point.x > mostPosPoint.x) {
				mostPosPoint.x = point.x;
			}
			if (point.y > mostPosPoint.y) {
				mostPosPoint.y = point.y;
			}
		}
	}

	function scalePoints(points, mostPosPoint, bufferPoint) {
		for (var i = 0; i < Object.size(points); i++) {
			var point = points[i];
			// Scale it to 80% of the draw area.
			self.setPixelsPerMeter(Math.min((graphics_.getPixelSize().width - bufferPoint.x * 2) / mostPosPoint.x,
			                                (graphics_.getPixelSize().height - bufferPoint.y) / mostPosPoint.y));

			point.x *= self.getPixelsPerMeter();
			point.y *= self.getPixelsPerMeter();
		}
		mostPosPoint.x *= self.getPixelsPerMeter();
		mostPosPoint.y *= self.getPixelsPerMeter();
	}

	function mirrorYPoints(points, mostPosPoint, bufferPoint) {
		for (var i = 0; i < Object.size(points); i++) {
			var point = points[i];
			// Mirror Y since the zero scale is upside down in DOM.
			point.y = graphics_.getPixelSize().height - point.y - (graphics_.getPixelSize().height - mostPosPoint.y);

			// Remove half of the buffer at the end to slide the image into the middle of the draw area.
			point.x += (bufferPoint.x / 2);
			point.y += (bufferPoint.y / 2);
		}
	}

	function computeFacilityPath() {
		var path = new goog.graphics.Path();

		var mostNegPoint = { x: 0, y: 0 };
		var mostPosPoint = { x: 0, y: 0 };
		var bufferPoint = { x: 10, y: 10 };
		if ((Object.size(vertices_) === Object.size(vertices_)) && (Object.size(vertices_) > 1)) {
			mostNegPoint = { x: 0, y: 0};
			facilityPoints_ = convertGpsToPoints();
			rotatePoints(facilityPoints_, mostNegPoint);
			translatePoints(facilityPoints_, mostNegPoint, mostPosPoint);
			scalePoints(facilityPoints_, mostPosPoint, bufferPoint);
			mirrorYPoints(facilityPoints_, mostPosPoint, bufferPoint);
			for (var i = 0; i < Object.size(facilityPoints_); i++) {
				var point = facilityPoints_[i];
				if (i === 0) {
					path.moveTo(point.x, point.y);
				} else {
					path.lineTo(point.x, point.y);
				}
			}
			path.lineTo(facilityPoints_[0].x, facilityPoints_[0].y);
		}
		return path;
	}

	function computeAislePath(aisleData) {
		var path = new goog.graphics.Path();

		if (Object.size(aisleData.vertices) > 0) {
			var start = {};
			var width = 0;
			var height = 0;
			for (var i = 0; i < Object.size(aisleData.vertices); i++) {
				var vertex = aisleData.vertices[i];
				var point = convertAisleVertexToPoint(aisleData.aisle, vertex);
				if (i === 0) {
					path.moveTo(point.x, point.y);
					start.x = point.x;
					start.y = point.y;
					aisleData.aisleElement.style.left = point.x;
					aisleData.aisleElement.style.top = point.y;
				} else {
					path.lineTo(point.x, point.y);
					if (Math.abs(start.x - point.x) > width) {
						width = Math.abs(start.x - point.x);
					}
					if (Math.abs(start.y - point.y) > height) {
						height = Math.abs(start.y - point.y);
					}
				}
			}
			path.lineTo(start.x, start.y);
			aisleData.aisleElement.style.width = width + 'px';
			aisleData.aisleElement.style.height = height + 'px';
		}

		return path;
	}

	function convertAisleVertexToPoint(aisle, vertex) {
		var point = {};
		point.x = (vertex['posX'] + aisle['posX']) * self.getPixelsPerMeter();
		point.y = (vertex['posY'] + aisle['posY']) * self.getPixelsPerMeter();
		return point;
	}

	function drawPath(path, stroke, fill) {
		graphics_.drawPath(path, stroke, fill);
	}

	function startDraw() {
		graphics_.clear();
	}

	function endDraw() {

	}

	function handleUpdateFacilityVertexCmd(lat, lon, facilityVertex) {
		vertices_[facilityVertex['drawOrder']] = facilityVertex;
		self.invalidate();
	}

	function handleDeleteFacilityVertexCmd(lat, lon, facilityVertex) {
		vertices_.splice(facilityVertex['drawOrder'], 1);
		self.invalidate();
	}

	function handleUpdateAisleCmd(aisle) {
		if (aisles_[aisle['persistentId']] === undefined) {

			var aisleData = {};

			// Create and populate the aisle's data record.
			aisleData.aisleElement = soy.renderAsElement(codeshelf.templates.aisleView, {id: aisle['domainId']});
			aisleData.aisleElement.style.left = Math.round(aisle['posX'] * self.getPixelsPerMeter()) + 'px';
			aisleData.aisleElement.style.top = Math.round(aisle['posY'] * self.getPixelsPerMeter()) + 'px';
			goog.dom.appendChild(workAreaEditorPane_, aisleData.aisleElement);

			aisleData.aisle = aisle;
			aisleData.aisleView = codeshelf.aisleview(websession_, aisle);
			aisleData.aisleView.setupView(aisleData.aisleElement);
			self.addSubview(aisleData.aisleView);

			aisles_[aisle['persistentId']] = aisleData;

			// Create the filter to listen to all vertex updates for this aisle.
			var vertexFilterData = {
				'className':     domainobjects['Vertex']['className'],
				'propertyNames': ['domainId', 'posTypeEnum', 'posX', 'posY', 'drawOrder', 'parentPersistentId'],
				'filterClause':  'parent.persistentId = :theId',
				'filterParams':  [
					{ 'name': 'theId', 'value': aisle['persistentId']}
				]
			};

			var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackAisle(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		}
		self.invalidate();
	}

	function handleDeleteAisleCmd(aisle) {
		if (aisles_[aisle['persistentId']] !== undefined) {
			self.removeSubview(aisles_[aisle['persistentId']['aisleView']]);
			aisles_.splice(aisle['persistentId'], 1);
			self.invalidate();
		}
	}

	function handleUpdateAisleVertexCmd(aisleVertex) {
		var aislePersistentId = aisleVertex['parentPersistentId'];
		if (aisles_[aislePersistentId] !== undefined) {
			var aisleData = aisles_[aislePersistentId];
			if (aisleData.vertices === undefined) {
				aisleData.vertices = [];
			}
			aisleData.vertices[aisleVertex['drawOrder']] = aisleVertex;
		}
		self.invalidate();
	}

	function handleDeleteAisleVertexCmd(aisleVertex) {

	}

	function handleUpdatePathCmd(path) {
		if (paths_[path['persistentId']] === undefined) {

			var pathData = {};

			pathData.path = path;

			paths_[path['persistentId']] = pathData;

			// Create the filter to listen to all vertex updates for this aisle.
			var pathSegmentFilterData = {
				'className':     domainobjects['PathSegment']['className'],
				'propertyNames': ['domainId', 'posTypeEnum', 'startPosX', 'startPosY', 'endPosX', 'endPosY', 'parentPersistentId'],
				'filterClause':  'parent.persistentId = :theId',
				'filterParams':  [
					{ 'name': 'theId', 'value': path['persistentId']}
				]
			};

			var pathSegmentFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, pathSegmentFilterData);
			websession_.sendCommand(pathSegmentFilterCmd, websocketCmdCallbackPath(kWebSessionCommandType.OBJECT_FILTER_RESP),
			                        true);
		}
		self.invalidate();
	}

	function handleDeletePathCmd(path) {
		if (paths_[path['persistentId']] !== undefined) {
			self.removeSubview(paths_[path['persistentId']['pathView']]);
			paths_.splice(path['persistentId'], 1);
			self.invalidate();
		}
	}

	function handleUpdatePathSegmentCmd(pathSegment) {
		var pathSegmentPersistentId = pathSegment['parentPersistentId'];
		if (paths_[pathSegmentPersistentId] !== undefined) {
			var pathData = paths_[pathSegmentPersistentId];
			if (pathData['segments'] === undefined) {
				pathData['segments'] = [];
			}
			pathData['segments'][pathSegment['domainId']] = pathSegment;
		}
		self.invalidate();
	}

	function handleDeletePathSegmentCmd(pathSegment) {

	}

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['data']['results'].length; i++) {
							var object = command['data']['results'][i];

							if (object['className'] === domainobjects['Vertex']['className']) {
								// Vertex updates.
								if (object['op'] === 'cre') {
									handleUpdateFacilityVertexCmd(object['posY'], object['posX'], object);
								} else if (object['op'] === 'upd') {
									handleUpdateFacilityVertexCmd(object['posY'], object['posX'], object);
								} else if (object['op'] === 'dl') {
									handleDeleteFacilityVertexCmd(object['posY'], object['posX'], object);
								}
							}
						}
					} else if (command['type'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['type'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		};

		return callback;
	}

	function websocketCmdCallbackAisle() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['data']['results'].length; i++) {
							var object = command['data']['results'][i];

							if (object['className'] === domainobjects['Aisle']['className']) {
								// Aisle updates
								if (object['op'] === 'cre') {
									handleUpdateAisleCmd(object);
								} else if (object['op'] === 'upd') {
									handleUpdateAisleCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeleteAisleCmd(object);
								}
							} else if (object['className'] === domainobjects['Vertex']['className']) {
								// VAisle ertex updates.
								if (object['op'] === 'cre') {
									handleUpdateAisleVertexCmd(object);
								} else if (object['op'] === 'upd') {
									handleUpdateAisleVertexCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeleteAisleVertexCmd(object);
								}
							}

						}
					} else if (command['type'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['type'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		};

		return callback;
	}

	function websocketCmdCallbackPath() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['data']['results'].length; i++) {
							var object = command['data']['results'][i];

							if (object['className'] === domainobjects['Path']['className']) {
								// Aisle updates
								if (object['op'] === 'cre') {
									handleUpdatePathCmd(object);
								} else if (object['op'] === 'upd') {
									handleUpdatePathCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeletePathCmd(object);
								}
							} else if (object['className'] === domainobjects['PathSegment']['className']) {
								// VAisle ertex updates.
								if (object['op'] === 'cre') {
									handleUpdatePathSegmentCmd(object);
								} else if (object['op'] === 'upd') {
									handleUpdatePathSegmentCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeletePathSegmentCmd(object);
								}
							}

						}
					} else if (command['type'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['type'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		};

		return callback;
	}

	/**
	 * Select all of the bays in the given rectangle and deselect the ones not in it.
	 * @param {rect} The selection rectangle.
	 */
	function selectBays(rect) {
		var selectedBays = goog.dom.findNodes(workAreaEditorPane_, function(node) {
			if (goog.dom.classes.has(node, 'bayView')) {

				var element = $(node);
				var offset = element.offset();
				var dim = {
					left:   offset.left,
					top:    offset.top,
					width:  element.width(),
					height: element.height()
				};

				var offsetRect = $(workAreaEditorPane_).offset();
				offsetRect.top += rect.top;
				offsetRect.left += rect.left;
				offsetRect.width = rect.width;
				offsetRect.height = rect.height;

				if (percentCovered(offsetRect, dim) > 25) {
					element.addClass('selected');
				} else {
					element.removeClass('selected');
				}
			}
		});
	}

	/**
	 * Deselect all bays.
	 */
	function deselectBays() {
		var selectedBays = goog.dom.findNodes(workAreaEditorPane_, function(node) {
			if (goog.dom.classes.has(node, 'bayView')) {
				var element = $(node);
				element.removeClass('selected');
			}
		});
	}

	/**
	 * Returns the amount (in %) that dim1 covers dim2
	 * @param dim1
	 * @param dim2
	 * @return {Number} Percentaage of area cover.
	 */
	function percentCovered(dim1, dim2) {
		if (
		// The whole thing is covering the whole other thing
			(dim1.left <= dim2.left) &&
				(dim1.top <= dim2.top) &&
				((dim1.left + dim1.width) >= (dim2.left + dim2.width)) &&
				((dim1.top + dim1.height) > (dim2.top + dim2.height))
			) {
			return 100;
		} else {
			// Only parts may be covered, calculate percentage
			dim1.right = dim1.left + dim1.width;
			dim1.bottom = dim1.top + dim1.height;
			dim2.right = dim2.left + dim2.width;
			dim2.bottom = dim2.top + dim2.height;

			var l = Math.max(dim1.left, dim2.left);
			var r = Math.min(dim1.right, dim2.right);
			var t = Math.max(dim1.top, dim2.top);
			var b = Math.min(dim1.bottom, dim2.bottom);

			if (b >= t && r >= l) {
				var percent = (((r - l) * (b - t)) / (dim2.width * dim2.height)) * 100;
				return percent;
			}
		}
		// Nothing covered, return 0
		return 0;
	}


	/**
	 * The work area editor object we'll return.
	 * @type {Object}
	 * @private
	 */
	var self = {

		getViewName: function() {
			return 'Work Area Editor';
		},

		doSetupView: function() {

			// Setup the work area view elements.
			var workAreaEditor = soy.renderAsElement(codeshelf.templates.workAreaEditor);
			goog.dom.appendChild(self.getMainPaneElement(), workAreaEditor);

			workAreaEditorPane_ = workAreaEditor.getElementsByClassName('workAreaEditorPane')[0];

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(workAreaEditorPane_.clientWidth, workAreaEditorPane_.clientHeight);
			graphics_.render(workAreaEditorPane_);

		},

		open: function() {
			// Create the filter to listen to all vertex updates for this facility.
			var vertexFilterData = {
				'className':     domainobjects['Vertex']['className'],
				'propertyNames': ['domainId', 'posTypeEnum', 'posX', 'posY', 'drawOrder'],
				'filterClause':  'parent.persistentId = :theId',
				'filterParams':  [
					{ 'name': 'theId', 'value': facility_['persistentId']}
				]
			};

			var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			// Create the filter to listen to all aisle updates for this facility.
			var aisleFilterData = {
				'className':     domainobjects['Aisle']['className'],
				'propertyNames': ['domainId', 'posX', 'posY'],
				'filterClause':  'parent.persistentId = :theId',
				'filterParams':  [
					{ 'name': 'theId', 'value': facility_['persistentId']}
				]
			};

			var aisleFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, aisleFilterData);
			websession_.sendCommand(aisleFilterCmd, websocketCmdCallbackAisle(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			// Create the filter to listen to all path updates for this facility.
			var pathFilterData = {
				'className':     domainobjects['Path']['className'],
				'propertyNames': ['domainId', 'travelDirEnum'],
				'filterClause':  'parent.persistentId = :theId',
				'filterParams':  [
					{ 'name': 'theId', 'value': facility_['persistentId']}
				]
			};

			var pathFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, pathFilterData);
			websession_.sendCommand(pathFilterCmd, websocketCmdCallbackPath(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		exit: function() {

		},

		doMouseDownHandler: function(event) {

		},

		doGetContentElement: function() {
			return workAreaEditorPane_;
		},

		canDragSelect: function(event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), event['offsetX'], event['offsetY'])) {
				alert('Select a starting point inside the facility bounds.');
				return false;
			} else {
				return true;
			}
		},

		doDraggerBefore: function(event) {

		},

		doDraggerStart: function(event) {
			deselectBays();

			var stroke = new goog.graphics.Stroke(1, 'black');
			var fill = new goog.graphics.SolidFill('blue', 0.2);
			startDragPoint_ = { 'x': event.browserEvent['offsetX'], y: event.browserEvent['offsetY'] };
			currentRect_ = new goog.math.Rect(startDragPoint_.x, startDragPoint_.y, 0, 0);
			currentDrawRect_ = graphics_.drawRect(startDragPoint_.x, startDragPoint_.y, 0, 0, stroke, fill);
		},

		doDraggerDrag: function(event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_),
			                               startDragPoint_.x + event.target.deltaX, startDragPoint_.y + event.target.deltaY)) {
				// Dont' do anything, the last drag point was inside the facility bounds.
			} else {
				var x = event.target.deltaX;
				if (x < 0) {
					x *= -1;
					currentRect_.left = startDragPoint_.x - x;
				} else {
					currentRect_.left = startDragPoint_.x;
				}

				var y = event.target.deltaY;
				if (y < 0) {
					y *= -1;
					currentRect_.top = startDragPoint_.y - y;
				} else {
					currentRect_.top = startDragPoint_.y;
				}
				currentRect_.width = x;
				currentRect_.height = y;

				currentDrawRect_.setPosition(currentRect_.left, currentRect_.top);
				currentDrawRect_.setSize(currentRect_.width, currentRect_.height);

				if (self.getToolbarTool().getId() === 'select-tool') {
					selectBays(currentRect_);
				}
			}
		},

		doDraggerEnd: function(event) {
			var tool = self.getToolbarTool();
			switch (tool.getId()) {
				case 'aisle-tool':
					createAisle();
					break;
				default:
					break;
			}
			graphics_.removeElement(currentDrawRect_);
			currentDrawRect_.dispose();
		},

		doResize: function() {
			graphics_.setSize(workAreaEditorPane_.clientWidth, workAreaEditorPane_.clientHeight);
			self.invalidate();
		},

		doDraw: function() {
			startDraw();

			// Draw the facility path.
			facilityPath_ = computeFacilityPath();
			var stroke = new goog.graphics.Stroke(1.5, 'grey');
			var fill = new goog.graphics.SolidFill('white');
			drawPath(facilityPath_, stroke, fill);

			// Draw the aisles
			for (var aisleKey in aisles_) {
				if (aisles_.hasOwnProperty(aisleKey)) {
					var aisleData = aisles_[aisleKey];

					var aislePath = computeAislePath(aisleData);
					var stroke = new goog.graphics.Stroke(1, 'black');
					var fill = new goog.graphics.SolidFill('green', 0.75);
					drawPath(aislePath, stroke, fill);

					aisleData.aisleElement.style.left = Math.round(aisleData.aisle['posX'] * self.getPixelsPerMeter()) + 'px';
					aisleData.aisleElement.style.top = Math.round(aisleData.aisle['posY'] * self.getPixelsPerMeter()) + 'px';
				}
			}

			// Draw the paths
			for (var pathKey in paths_) {
				if (paths_.hasOwnProperty(pathKey)) {
					var pathData = paths_[pathKey];

					for (var pathSegmentKey in pathData['segments']) {
						if (pathData['segments'].hasOwnProperty(pathSegmentKey)) {
							var pathSegmentData = pathData['segments'][pathSegmentKey];

							var start = {};
							start.x = /*facilityPoints_[0]['x'] + */(pathSegmentData['startPosX'] * self.getPixelsPerMeter());
							start.y = /*facilityPoints_[0]['y'] + */(pathSegmentData['startPosY'] * self.getPixelsPerMeter());

							var end = {};
							end.x = /*facilityPoints_[0]['x'] + */(pathSegmentData['endPosX'] * self.getPixelsPerMeter());
							end.y = /*facilityPoints_[0]['y'] + */(pathSegmentData['endPosY'] * self.getPixelsPerMeter());

							var startArrow = 0.0;
							var endArrow = 0.0;

							if ((pathData['path']['travelDirEnum'] === 'BOTH') || (pathData['path']['travelDirEnum'] === 'REVERSE')) {
								startArrow = 7.5;
							}

							if ((pathData['path']['travelDirEnum'] === 'BOTH') || (pathData['path']['travelDirEnum'] === 'FORWARD')) {
								endArrow = 7.5;
							}

							var pathSegmentPath = goog.graphics.paths.createArrow(start, end, startArrow, endArrow);
							var stroke = new goog.graphics.Stroke(0.5, 'black');
							var fill = new goog.graphics.SolidFill('black', 0.6);
							drawPath(pathSegmentPath, stroke, fill);
						}
					}
				}
			}
			endDraw();
		}
	};

	var tools = [
		{id: 'select-tool', title: 'Select Tool', icon: 'select-icon.png'},
		{id: 'aisle-tool', title: 'Aisle Tool', icon: 'rack-icon.png'},
		{id: 'staging-tool', title: 'Staging Tool', icon: 'staging-icon.png'},
		{id: 'door-tool', title: 'Door Tool', icon: 'door-icon.png'}
	];

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view({doHandleSelection: true, doDragSelect: true, toolbarTools: tools});
	jQuery.extend(view, self);
	self = view;

	return self;
};
