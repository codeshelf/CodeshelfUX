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
goog.require('codeshelf.pathtool');
goog.require('codeshelf.websession');
goog.require('domainobjects');

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
 * Just snap to nearby grid value
 * @param inPixelValue an integer
 * @return {integer}
 */
function snapTo(inPixelValue){
	// This works well within one work session if you leave the window scaled to same size through aisle creation.
	var gridSnapValue = 10;
	var divResult = Math.floor((inPixelValue)/gridSnapValue);
	remResult = inPixelValue % gridSnapValue;
	returnValue = divResult * gridSnapValue;
	// want to snap to nearer grid.
	if (remResult > gridSnapValue/2)
		returnValue += gridSnapValue;
	return returnValue;
	// When window is very small, 10 is too large.
	// More importantly, if you resize, pixel scale is impacted. It is impossible to match.
	// stackoverflow: jquery UI? The draggable utility allows snapping.
}

/**
 * The facility in pixel space (instead of GPS space) where the user can work on it in a normal size/orientation.
 * @param websession The websession used for updates.
 * @param facility The facility we're editing.
 * @return {Object} The work area editor.
 */
codeshelf.workareaeditorview = function (websession, facility, options) {

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
	var aisles_ = {};
	var paths_ = [];
	var consts = {};
	var logger_ = goog.debug.Logger.getLogger('codeshelf.workareaeditor');
	function savePath(path) {

		function callbackForCreatePath() {
			var callback = {
				exec: function (type,command) {
					if (command['type'] == kWebSessionCommandType.OBJECT_METHOD_RESP) {
						//handle error case
						console.log(command);
					}
				}
			};
			return callback;
		}

		var cmd = {
			'CreatePathRequest' : {
				'facilityId' : facility_['persistentId'],
				'domainId' : path['domainId'],
				'pathSegments' : path['segments']
			}
		};
		websession_.sendCommand(cmd, callbackForCreatePath(), false);
		logger_.info("saved a new path" + goog.debug.expose(path['segments']));

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

		if (Object.size(aisleData.vertices) > 0) {
			var path = new goog.graphics.Path();

			var start = {};
			var width = 0;
			var height = 0;
			for (var i = 0; i < Object.size(aisleData.vertices); i++) {
				var vertex = aisleData.vertices[i];
				var point = convertAisleVertexToPoint(aisleData.aisle, vertex);
				logger_.fine("Path point : " + i + ", " + goog.debug.expose(point));

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
			return path;
		}
		else {
			return null;
		}
	}

	function convertAisleVertexToPoint(aisle, vertex) {
		var point = {};
		point.x = (vertex['posX'] + aisle['anchorPosX']) * self.getPixelsPerMeter();
		point.y = (vertex['posY'] + aisle['anchorPosY']) * self.getPixelsPerMeter();
		return point;
	}

	function drawPath(path, stroke, fill) {
		graphics_.drawPath(path, stroke, fill);
	}

	function drawPathSegment(startPoint, endPoint, travelDir) {
		var startArrow = 0.0;
		var endArrow = 0.0;


		if (travelDir == null || travelDir === 'FORWARD' || travelDir === 'BOTH') {
			endArrow = 7.5;
		}

		if (travelDir != null && (travelDir === 'REVERSE' || travelDir === 'BOTH')) {
			endArrow = 7.5;
		}

		var pathSegmentPath = goog.graphics.paths.createArrow(startPoint, endPoint, startArrow, endArrow);
		var stroke = new goog.graphics.Stroke(0.5, 'black');
		var fill = new goog.graphics.SolidFill('black', 0.6);
		drawPath(pathSegmentPath, stroke, fill);
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

	function handleDeleteFacilityVertexCmd(lat, lon, persistentId) {
		for (var drawOrder in vertices_) {
			if (vertices_[drawOrder]['persistentId'] === persistentId){
				vertices_.splice(drawOrder, 1);
				self.invalidate();
				break;
			}
		}
	}

	function handleUpdateAisleCmd(aisle) {
		if (aisles_[aisle['persistentId']] === undefined) {

			var aisleData = {};

			// Create and populate the aisle's data record.
			aisleData.aisleElement = soy.renderAsElement(codeshelf.templates.aisleView, {id: aisle['domainId']});
			aisleData.aisleElement.style.left = Math.round(aisle['anchorPosX'] * self.getPixelsPerMeter()) + 'px';
			aisleData.aisleElement.style.top = Math.round(aisle['anchorPosY'] * self.getPixelsPerMeter()) + 'px';
			goog.dom.appendChild(workAreaEditorPane_, aisleData.aisleElement);

			aisleData.aisle = aisle;
			aisleData.aisleView = codeshelf.aisleview(websession_, aisle);
			aisleData.aisleView.setupView(aisleData.aisleElement);
			self.addSubview(aisleData.aisleView);

			aisles_[aisle['persistentId']] = aisleData;

			// Create the filter to listen to all vertex updates for this aisle.
			var className = domainobjects['Vertex']['className'];
			var propertyNames = ['domainId', 'posType', 'posX', 'posY', 'drawOrder', 'parentPersistentId'];
			var filterClause = 'allByParent';
			var filterParams = [{ 'name': 'parentId', 'value': aisle['persistentId']}];
			var vertexFilterCmd = websession_.createRegisterFilterRequest(className,propertyNames,filterClause,filterParams);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackAisle(), true);
		}
		self.invalidate();
	}

	function handleDeleteAisleCmd(aisle) {
		if (aisles_[aisle['persistentId']] !== undefined) {
			self.removeSubview(aisles_[aisle['persistentId']['aisleView']]);
			delete aisles_[aisle['persistentId']];
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

			var className = domainobjects['PathSegment']['className'];
			var propertyNames = ['domainId', 'posType', 'startPosX', 'startPosY', 'endPosX', 'endPosY', 'parentPersistentId'];
			var filterClause = 'allByParent';
			var filterParams = [{ 'name': 'parentId', 'value': path['persistentId']}];

			var pathSegmentFilterCmd = websession_.createRegisterFilterRequest(className,propertyNames,filterClause,filterParams);
			websession_.sendCommand(pathSegmentFilterCmd, websocketCmdCallbackPath(),true);
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

	function logWorkAreaEditorResponse(inStringToLog) {
		//uncomment to really see the updates on work area editor
		if (true) {
			var theLogger = goog.debug.Logger.getLogger('WorkAreaEditorWebsocket');
			theLogger.info(inStringToLog);
		}
	}

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function (type,command) {
				if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['results'].length; i++) {
						var object = command['results'][i];

						if (object['className'] === domainobjects['Vertex']['className']) {
							// Vertex updates.
							if (object['op'] === 'cre') {
								handleUpdateFacilityVertexCmd(object['posY'], object['posX'], object);

							} else if (object['op'] === 'upd') {
								handleUpdateFacilityVertexCmd(object['posY'], object['posX'], object);

							} else if (object['op'] === 'del') {
								handleDeleteFacilityVertexCmd(object['posY'], object['posX'], object['persistentId']);

							}
						}
					}
				} else if (type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					logWorkAreaEditorResponse('UPDATE_RESP -- ack the facility vertex update that I sent');
				} else if (type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					logFacilityResponse('UPDATE_RESP -- ack the facility vertex delete that I sent');
				}
			}
		};
		return callback;
	}

	function websocketCmdCallbackAisle() {
		var callback = {
			exec: function (type,command) {
				if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['results'].length; i++) {
						var object = command['results'][i];

						if (object['className'] === domainobjects['Aisle']['className']) {
							// Aisle updates
							if (object['op'] === 'cre') {
								handleUpdateAisleCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdateAisleCmd(object);
								logWorkAreaEditorResponse('FILTER_RESP:upd -- init or update aisle from backend');
							} else if (object['op'] === 'del') {
								handleDeleteAisleCmd(object);
							}
						} else if (object['className'] === domainobjects['Vertex']['className']) {
							// Vertex updates.
							if (object['op'] === 'cre') {
								handleUpdateAisleVertexCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdateAisleVertexCmd(object);
								logWorkAreaEditorResponse('FILTER_RESP:upd -- init or update aisle vertex from backend');
							} else if (object['op'] === 'del') {
								handleDeleteAisleVertexCmd(object);
							}
						}

					}
				} else if (type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					logWorkAreaEditorResponse('UPDATE_RESP -- ack the aisle update that I sent');
				} else if (type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					logWorkAreaEditorResponse('UPDATE_RESP -- ack the aisle delete that I sent');
				}
			}
		};

		return callback;
	}

	function websocketCmdCallbackPath() {
		var callback = {
			exec: function (type,command) {
				if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['results'].length; i++) {
						var object = command['results'][i];

						if (object['className'] === domainobjects['Path']['className']) {
							// Aisle updates
							if (object['op'] === 'cre') {
								handleUpdatePathCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdatePathCmd(object);
								logWorkAreaEditorResponse('FILTER_RESP:upd -- init or update path from backend');
							} else if (object['op'] === 'del') {
								handleDeletePathCmd(object);
							}
						} else if (object['className'] === domainobjects['PathSegment']['className']) {
							// VAisle ertex updates.
							if (object['op'] === 'cre') {
								handleUpdatePathSegmentCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdatePathSegmentCmd(object);
								logWorkAreaEditorResponse('FILTER_RESP:upd -- init or update path segment from backend');
							} else if (object['op'] === 'del') {
								handleDeletePathSegmentCmd(object);
							}
						}
					}
				} else if (type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					logWorkAreaEditorResponse('UPDATE_RESP -- ack the path update that I sent');
				} else if (type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					logWorkAreaEditorResponse('UPDATE_RESP -- ack the path delete that I sent');
				}
			}
		};

		return callback;
	}

	/**
	 * Select all of the bays in the given rectangle and deselect the ones not in it.
	 * @param {Object} rect selection rectangle.
	 */
	function selectBays(rect) {
		var selectedBays = goog.dom.findNodes(workAreaEditorPane_, function (node) {
			if (goog.dom.classes.has(node, 'bayView')) {

				var element = $(node);
				var offset = element.offset();
				var dim = {
					left: offset.left,
					top: offset.top,
					width: element.width(),
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
		var selectedBays = goog.dom.findNodes(workAreaEditorPane_, function (node) {
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
	 * @return {number|null} Percentage of area cover.
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


	function drawPathArrow(graphics, start, end) {
		var path = new goog.graphics.Path()
			.moveTo(start.x, start.y)
			.lineTo(end.x, end.y);
		graphics.drawPath(path, stroke, null);
	}

	/**
	 * The work area editor object we'll return.
	 * @type {Object}
	 * @private
	 */
	var self = {

		'getViewName': function () {
			return 'Work Area Editor';
		},

        'getViewMenu': null,

		doSetupView: function () {

			// Setup the work area view elements.
			var workAreaEditor = soy.renderAsElement(codeshelf.templates.workAreaEditor);
			goog.dom.appendChild(self.getMainPaneElement(), workAreaEditor);

			workAreaEditorPane_ = workAreaEditor.getElementsByClassName('workAreaEditorPane')[0];

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(workAreaEditorPane_.clientWidth, workAreaEditorPane_.clientHeight);
			graphics_.render(workAreaEditorPane_);

			pathCounter = 0;
			self.pathTool = new PathTool(self.getContentElement(),
				function createPath() {
					return new Path(facility_['domainId'] + "." + pathCounter++,
						function pixelToMeters(pixel) {
							return pixel / self.getPixelsPerMeter();
						});
				});

			self.pathTool.newSegments.onValue(function (segment) {
				drawPathSegment(segment['startPoint'], segment['endPoint'], "FORWARD");
			});

			self.pathTool.newPaths.onValue(function (path) {
				if ((path['segments'] !== undefined) && (path['segments'].length > 0)) {
					savePath(path);
				}
			});
		},

		open: function () {
			// Create the filter to listen to all vertex updates for this facility.
			var className = domainobjects['Vertex']['className'];
			var propertyNames = ['domainId', 'posType', 'posX', 'posY', 'drawOrder'];
			var filterClause = 'allByParent';
			var filterParams = [{'name': 'parentId', 'value': facility_['persistentId']}];
			var vertexFilterCmd = websession_.createRegisterFilterRequest(className,propertyNames,filterClause,filterParams);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackFacility(), true);

			// Create the filter to listen to all aisle updates for this facility.

			var className = domainobjects['Aisle']['className'];
			var propertyNames = ['domainId', 'anchorPosX', 'anchorPosY'];
			var filterClause = 'allActiveByParent';
			var filterParams = [{ 'name': 'parentId', 'value': facility_['persistentId']}];
			var aisleFilterCmd = websession_.createRegisterFilterRequest(className,propertyNames,filterClause,filterParams);
			websession_.sendCommand(aisleFilterCmd, websocketCmdCallbackAisle(), true);

			// Create the filter to listen to all path updates for this facility.

			var className = domainobjects['Path']['className'];
			var propertyNames = ['domainId', 'travelDir'];
			var filterClause = 'allByParent';
			var filterParams = [{ 'name': 'parentId', 'value': facility_['persistentId']}];

			var pathFilterCmd = websession_.createRegisterFilterRequest(className,propertyNames,filterClause,filterParams);
			websession_.sendCommand(pathFilterCmd, websocketCmdCallbackPath(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

        refresh: function() {
            self.open();
        },

		close: function () {

		},

		exit: function () {

		},

		doMouseDownHandler: function (event) {

		},

		doGetContentElement: function () {
			return workAreaEditorPane_;
		},

		canDragSelect: function (event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), event['offsetX'], event['offsetY'])) {
				alert('Select a starting point inside the facility bounds.');
				return false;
			} else {
				return true;
			}
		},

		doDraggerBefore: function (event) {

		},

		doDraggerStart: function (event) {
			deselectBays();

			var stroke = new goog.graphics.Stroke(1, 'black');
			var fill = new goog.graphics.SolidFill('blue', 0.2);
			startDragPoint_ = { 'x': snapTo(event.browserEvent['offsetX']), y: snapTo(event.browserEvent['offsetY']) };
			currentRect_ = new goog.math.Rect(startDragPoint_.x, startDragPoint_.y, 0, 0);
			currentDrawRect_ = graphics_.drawRect(startDragPoint_.x, startDragPoint_.y, 0, 0, stroke, fill);
		},

		doDraggerDrag: function (event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_),
					startDragPoint_.x + snapTo(event.target.deltaX), startDragPoint_.y + snapTo(event.target.deltaY))) {
				// Dont' do anything, the last drag point was inside the facility bounds.
			} else {
				var x = snapTo(event.target.deltaX);
				if (x < 0) {
					x *= -1;
					currentRect_.left = startDragPoint_.x - x;
				} else {
					currentRect_.left = startDragPoint_.x;
				}

				var y = snapTo(event.target.deltaY);
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

		doDraggerEnd: function (event) {
			var tool = self.getToolbarTool();
			graphics_.removeElement(currentDrawRect_);
			currentDrawRect_.dispose();
			logger_.info("actions on drag unimplemented");


		},

		doResize: function () {
			graphics_.setSize(workAreaEditorPane_.clientWidth, workAreaEditorPane_.clientHeight);
			self.invalidate();
		},

		doDraw: function () {
			startDraw();

			// Draw the facility path.

			facilityPath_ = computeFacilityPath();
			var stroke = new goog.graphics.Stroke(1.5, 'grey');
			var fill = new goog.graphics.SolidFill('white');
			drawPath(facilityPath_, stroke, fill);
			logger_.fine("Drew facility outline");

			// Draw the aisles
			var aisleCount = 0;
			for(var persistentId in aisles_) {
				if (aisles_.hasOwnProperty(persistentId)) {
					aisleCount++;
					var aisleData = aisles_[persistentId];
					var aislePath = computeAislePath(aisleData);
					if (aislePath != null) {
						var aisleStroke = new goog.graphics.Stroke(1, 'black');
						var aisleFill = new goog.graphics.SolidFill('green', 0.75);
						logger_.fine("aisle path: " + goog.debug.expose(aislePath));
						drawPath(aislePath, aisleStroke, aisleFill);
						logger_.fine("drew aisle path: " + goog.debug.expose(aislePath));
					}


					aisleData.aisleElement.style.left = Math.round(aisleData.aisle['anchorPosX'] * self.getPixelsPerMeter()) + 'px';
					aisleData.aisleElement.style.top = Math.round(aisleData.aisle['anchorPosY'] * self.getPixelsPerMeter()) + 'px';

				}
			}
			logger_.fine("Drew " + aisleCount + " aisles");
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

							drawPathSegment(start, end, pathData['path']['travelDir']);
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
