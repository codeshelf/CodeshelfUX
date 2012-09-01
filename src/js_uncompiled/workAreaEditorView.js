/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.36 2012/09/01 23:56:32 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.graphics');
goog.require('goog.graphics.paths');
goog.require('goog.math');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');
goog.require('extern.jquery');
goog.require('extern.jquery.dragToSelect');
goog.require('raphael');

/**
 * The facility in pixel space (instead of GPS space) where the user can work on it in a normal size/orientation.
 * @param websession The websession used for updates.
 * @param facility The facility we're editing.
 * @return {Object} The work area editor.
 */
codeshelf.workareaeditorview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;
	var mouseDownHandler_;
	var clickHandler_;
	var doubleClickHandler_;
	var dragger_;
	var startDragPoint_;
	var mainPane_;
	var toolbar_;
	var toolbarSelectionModel_;
	var graphics_;
	var vertices_ = [];
	var rotateFacilityByDeg_ = 0;
	var facilityPath_;
	var currentRect_;
	var currentDrawRect_;
	var aisles_ = [];

	/**
	 * Handle the user's click on the toolbar.
	 * @param e
	 */
	function handleToolbarEvent(e) {
		var a = 2;
	}

	function clickHandler(event) {

	}

	function mouseDownHandler(event) {
		if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), event.offsetX, event.offsetY)) {
			alert("Select a starting point inside the facility bounds.");
		} else {
			var dragTarget = goog.dom.createDom('div', { 'style': 'display:none;' });
			dragger_ = new goog.fx.Dragger(dragTarget);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.START, draggerStart);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.DRAG, draggerDrag);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.BEFOREDRAG, draggerBefore);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.END, draggerEnd);
			dragger_.startDrag(event);
			var stroke = new goog.graphics.Stroke(1, 'black');
			var fill = new goog.graphics.SolidFill('red', 0.2);
			startDragPoint_ = { 'x': event.offsetX, y: event.offsetY };
			currentRect_ = new goog.math.Rect(startDragPoint_.x, startDragPoint_.y, 0, 0);
			currentDrawRect_ = graphics_.drawRect(startDragPoint_.x, startDragPoint_.y, 0, 0, stroke, fill);
		}
	}

	function doubleClickHandler(event) {

	}

	function draggerStart(event) {
		event.dispose();
	}

	function draggerBefore(event) {
		event.dispose();
	}

	function draggerDrag(event) {
		if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), startDragPoint_.x + event.target.deltaX, startDragPoint_.y + event.target.deltaY)) {
			// Dont' do anything, the last drag point was inside the facility bounds.
		} else {
			currentRect_.width = event.target.deltaX;
			currentRect_.height = event.target.deltaY;
			currentDrawRect_.setSize(event.target.deltaX, event.target.deltaY);
		}
		event.dispose();
	}

	function draggerEnd(event) {
		var tool = toolbarSelectionModel_.getSelectedItem();
		switch (tool.getId()) {
			case 'aisle-tool':
				createAisle();
				break;
		}
		event.dispose();
		dragger_.dispose();
	}

	function createAisle() {
		var dataEntryDialog = codeshelf.dataentrydialog();
		var dialogContentElement = soy.renderAsElement(codeshelf.templates.createAisleDialogContent);
		dataEntryDialog.setupDialog(dialogContentElement);
		dataEntryDialog.createField('bayHeight', 'text');
		dataEntryDialog.createField('bayWidth', 'text');
		dataEntryDialog.createField('bayDepth', 'text');
		dataEntryDialog.createField('baysHigh', 'text');
		dataEntryDialog.createField('baysLong', 'text');
		dataEntryDialog.createField('backToBack', 'checkbox');
		dataEntryDialog.open(function(event, dialog) {
				if (event.key === goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL.key) {
					graphics_.removeElement(currentRect_);
					currentDrawRect_.dispose();
				} else {
					var xOriginMeters = startDragPoint_.x / self.getPixelsPerMeter();
					var yOriginMeters = startDragPoint_.y / self.getPixelsPerMeter();

					var bayHeight = dialog.getFieldValue('bayHeight') * 0.3048;
					var bayWidth = dialog.getFieldValue('bayWidth') * 0.3048;
					var bayDepth = dialog.getFieldValue('bayDepth') * 0.3048;
					var baysHigh = dialog.getFieldValue('baysHigh');
					var baysLong = dialog.getFieldValue('baysLong');
					var backToBack = dialog.getFieldValue('backToBack');


					var runInXDim = true;
					if (currentRect_.width < currentRect_.height) {
						runInXDim = false;
					}

					// Call Facility.createAisle();
					//public final void createAisle(Double inPosX, Double inPosY, Double inProtoBayHeight, Double inProtoBayWidth, Double inProtoBayDepth, int inBaysHigh, int inBaysLong, Boolean inCreateBackToBack) {
					var data = {
						'className':    domainobjects.facility.classname,
						'persistentId': facility_['persistentId'],
						'methodName':   'createAisle',
						'methodArgs':   [
							{ 'name': 'inPosXMeters', 'value': xOriginMeters, 'classType': 'java.lang.Double'},
							{ 'name': 'inPosYMeters', 'value': yOriginMeters, 'classType': 'java.lang.Double'},
							{ 'name': 'inProtoBayXDimMeters', 'value': bayHeight, 'classType': 'java.lang.Double'},
							{ 'name': 'inProtoBayYDimMeters', 'value': bayWidth, 'classType': 'java.lang.Double'},
							{ 'name': 'inProtoBayZDimMeters', 'value': bayHeight, 'classType': 'java.lang.Double'},
							{ 'name': 'inProtoBaysHigh', 'value': baysHigh, 'classType': 'java.lang.Integer'},
							{ 'name': 'inProtoBaysLong', 'value': baysLong, 'classType': 'java.lang.Integer'},
							{ 'name': 'inRunInXDir', 'value': runInXDim, 'classType': 'java.lang.Boolean'},
							{ 'name': 'inCreateBackToBack', 'value': backToBack, 'classType': 'java.lang.Boolean'}
						]
					}

					var createAisleCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
					websession_.sendCommand(createAisleCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ), true);
				}
			}
		)
		;
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
		var lat1 = goog.math.toRadians(latArg1)
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
				var coord = convertLatLongToXY(lastVertex['PosY'], lastVertex['PosX'], vertex['PosY'], vertex['PosX']);
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
			self.setPixelsPerMeter(Math.min((graphics_.getPixelSize().width - bufferPoint.x * 2) / mostPosPoint.x, (graphics_.getPixelSize().height - bufferPoint.y) / mostPosPoint.y));

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
			var points = convertGpsToPoints();
			rotatePoints(points, mostNegPoint);
			translatePoints(points, mostNegPoint, mostPosPoint);
			scalePoints(points, mostPosPoint, bufferPoint);
			mirrorYPoints(points, mostPosPoint, bufferPoint);
			for (var i = 0; i < Object.size(points); i++) {
				var point = points[i];
				if (i === 0) {
					path.moveTo(point.x, point.y);
				} else {
					path.lineTo(point.x, point.y);
				}
			}
			path.lineTo(points[0].x, points[0].y);
		}
		return path;
	}

	function computeAislePath(aisleData) {
		var path = new goog.graphics.Path();

		if (Object.size(aisleData.vertices) > 0) {
			var start = {};
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
					var width = parseInt(aisleData.aisleElement.style.width);
					if ((isNaN(width)) || (width < (Math.abs(start.x - point.x)))) {
						aisleData.aisleElement.style.width = (Math.abs(start.x - point.x)) + 'px';
					}
					var height = parseInt(aisleData.aisleElement.style.width);
					if ((isNaN(height)) || (height < (Math.abs(start.y - point.y)))) {
						aisleData.aisleElement.style.height = (Math.abs(start.y - point.y)) + 'px';
					}
				}
			}
			path.lineTo(start.x, start.y);
		}

		return path;
	}

	function convertAisleVertexToPoint(aisle, vertex) {
		var point = {};
		point.x = (vertex['PosX'] + aisle['PosX']) * self.getPixelsPerMeter();
		point.y = (vertex['PosY'] + aisle['PosY']) * self.getPixelsPerMeter();
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
		vertices_[facilityVertex['DrawOrder']] = facilityVertex;
		self.invalidate();
	}

	function handleDeleteFacilityVertexCmd(lat, lon, facilityVertex) {
		vertices_.splice(facilityVertex['DrawOrder'], 1);
		self.invalidate();
	}

	function handleUpdateAisleCmd(aisle) {
		if (aisles_[aisle['persistentId']] === undefined) {

			var aisleData = {};

			// Create and populate the aisle's data record.
			aisleData.aisleElement = soy.renderAsElement(codeshelf.templates.aisleView, {id: aisle['DomainId']});
			aisleData.aisleElement.style.left = Math.round(aisle['PosX'] * self.getPixelsPerMeter()) + 'px';
			aisleData.aisleElement.style.top = Math.round(aisle['PosY'] * self.getPixelsPerMeter()) + 'px';
			goog.dom.appendChild(mainPane_, aisleData.aisleElement);

			aisleData.aisle = aisle;
			aisleData.aisleView = codeshelf.aisleview(websession_, aisle);
			aisleData.aisleView.setupView(aisleData.aisleElement);
			self.addSubview(aisleData.aisleView);

			aisles_[aisle['persistentId']] = aisleData;

			// Create the filter to listen to all vertex updates for this aisle.
			var vertexFilterData = {
				'className':     domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder', 'ParentPersistentId'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': aisle['persistentId']}
				]
			}

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
		var aislePersistentId = aisleVertex['ParentPersistentId'];
		if (aisles_[aislePersistentId] !== undefined) {
			var aisleData = aisles_[aislePersistentId];
			if (aisleData.vertices === undefined) {
				aisleData.vertices = [];
			}
			aisleData.vertices[aisleVertex['DrawOrder']] = aisleVertex;
		}
		self.invalidate();
	}

	function handleDeleteAisleVertexCmd(aisleVertex) {

	}

	function websocketCmdCallbackFacility(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty('r')) {
					alert('response has no result');
				} else {
					if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];

							if (object['className'] === domainobjects.vertex.classname) {
								// Vertex updates.
								if (object['op'] === 'cr') {
									handleUpdateFacilityVertexCmd(object['PosY'], object['PosX'], object);
								} else if (object['op'] === 'up') {
									handleUpdateFacilityVertexCmd(object['PosY'], object['PosX'], object);
								} else if (object['op'] === 'dl') {
									handleDeleteFacilityVertexCmd(object['PosY'], object['PosX'], object);
								}
							}
						}
					} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		}

		return callback;
	}

	function websocketCmdCallbackAisle(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty('r')) {
					alert('response has no result');
				} else {
					if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];

							if (object['className'] === domainobjects.aisle.classname) {
								// Aisle updates
								if (object['op'] === 'cr') {
									handleUpdateAisleCmd(object);
								} else if (object['op'] === 'up') {
									handleUpdateAisleCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeleteAisleCmd(object);
								}
							} else if (object['className'] === domainobjects.vertex.classname) {
								// VAisle ertex updates.
								if (object['op'] === 'cr') {
									handleUpdateAisleVertexCmd(object);
								} else if (object['op'] === 'up') {
									handleUpdateAisleVertexCmd(object);
								} else if (object['op'] === 'dl') {
									handleDeleteAisleVertexCmd(object);
								}
							}

						}
					} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		}

		return callback;
	}

	/**
	 * The work area editor object we'll return.
	 * @type {Object}
	 * @private
	 */
	var self = {

		doSetupView: function() {

			// Setup the work area view elements.
			var workAreaEditor = soy.renderAsElement(codeshelf.templates.workAreaEditor);
			goog.dom.appendChild(self.getMainPaneElement(), workAreaEditor);

			mainPane_ = workAreaEditor.getElementsByClassName('workAreaEditorPane')[0];
			var toolbarPane = workAreaEditor.getElementsByClassName('workAreaEditorToolbarPane')[0];

			$('.workAreaEditorPane').dragToSelect({
				selectables: 'path',
				onHide:      function() {
					alert($('.workAreaEditorPane path.selected').length + ' selected');
				}
			});

			var workAreaEditorToolbarDom = soy.renderAsElement(codeshelf.templates.workAreaEditorToolbar);
			goog.dom.appendChild(toolbarPane, workAreaEditorToolbarDom);
			toolbar_ = new goog.ui.Toolbar();
			toolbar_.decorate(workAreaEditorToolbarDom);
			toolbar_.setEnabled(true);
			goog.events.listen(toolbar_, goog.object.getValues(goog.ui.Component.EventType), handleToolbarEvent);

			clickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.CLICK, clickHandler);
//			mouseDownHandler_ = goog.events.listen(mainPane_, goog.events.EventType.MOUSEDOWN, mouseDownHandler);
			doublClickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.DBLCLICK, doubleClickHandler);

			goog.events.listen(mainPane_, goog.events.EventType.MOUSEOVER,
				function(e) {
					mainPane_.onselectstart = function() {
						return false;
					};
					mainPane_.onsmousedown = function() {
						return false;
					};
				});

			goog.events.listen(mainPane_, goog.events.EventType.MOUSEOUT,
				function(event) {
					mainPane_.onselectstart = null;
					mainPane_.onmousedown = null;
				});

			// Have the alignment buttons be controlled by a selection model.
			toolbarSelectionModel_ = new goog.ui.SelectionModel();
			toolbarSelectionModel_.setSelectionHandler(function(button, select) {
				if (button) {
					button.setChecked(select);
				}
			});

			goog.array.forEach(['aisle-tool', 'staging-tool', 'door-tool'],
				function(id) {
					var button = toolbar_.getChild(id);
					// Let the selection model control the button's checked state.
					button.setAutoStates(goog.ui.Component.State.CHECKED, false);
					toolbarSelectionModel_.addItem(button);
					goog.events.listen(button, goog.ui.Component.EventType.ACTION,
						function(event) {
							toolbarSelectionModel_.setSelectedItem(event.target);
							event.dispose();
						});
				});
			//toolbar_.getChildAt(0).setChecked(true);
			toolbarSelectionModel_.setSelectedIndex(0);

			// Compute the dimensions of the facility outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the facility outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(mainPane_.clientWidth, mainPane_.clientHeight);
			graphics_.render(mainPane_);

		},

		open: function() {
			// Create the filter to listen to all vertex updates for this facility.
			var vertexFilterData = {
				'className':     domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			// Create the filter to listen to all aisle updates for this facility.
			var aisleFilterData = {
				'className':     domainobjects.aisle.classname,
				'propertyNames': ['DomainId', 'PosX', 'PosY'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var aisleFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, aisleFilterData);
			websession_.sendCommand(aisleFilterCmd, websocketCmdCallbackAisle(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		exit: function() {
			google.maps.event.removeListener(clickHandler_);
			google.maps.event.removeListener(doubleClickHandler_);
		},

		doResize: function() {
			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);
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

					aisleData.aisleElement.style.left = Math.round(aisleData['aisle']['PosX'] * self.getPixelsPerMeter()) + 'px';
					aisleData.aisleElement.style.top = Math.round(aisleData['aisle']['PosY'] * self.getPixelsPerMeter()) + 'px';
				}
			}
			endDraw();
		}
	}

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
}
