/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.27 2012/08/01 00:46:39 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.aisleview');
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
goog.require('raphael');

codeshelf.workareaeditorview = function(websession, facility) {

	var thisWorkAreaEditorView_;
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
	var drawRatio_;
	var currentRect_;
	var currentDrawRect_;
	var aisles_ = [];

	thisWorkAreaEditorView_ = {

		handleToolbarEvent: function(e) {
			var a = 2;
		},

		setupView: function(contentElement) {

			// Add the toolbar
			var workAreaEditor = soy.renderAsElement(codeshelf.templates.workAreaEditor);
			goog.dom.appendChild(contentElement, workAreaEditor);

			mainPane_ = workAreaEditor.getElementsByClassName('workAreaEditorPane')[0];
			var toolbarPane = workAreaEditor.getElementsByClassName('workAreaEditorToolbarPane')[0];

			var workAreaEditorToolbarDom = soy.renderAsElement(codeshelf.templates.workAreaEditorToolbar);
			goog.dom.appendChild(toolbarPane, workAreaEditorToolbarDom);
			toolbar_ = new goog.ui.Toolbar();
			toolbar_.decorate(workAreaEditorToolbarDom);
			toolbar_.setEnabled(true);
			goog.events.listen(toolbar_, goog.object.getValues(goog.ui.Component.EventType), thisWorkAreaEditorView_.handleToolbarEvent);

			clickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.CLICK, thisWorkAreaEditorView_.clickHandler);
			mouseDownHandler_ = goog.events.listen(mainPane_, goog.events.EventType.MOUSEDOWN, thisWorkAreaEditorView_.mouseDownHandler);
			doublClickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.DBLCLICK, thisWorkAreaEditorView_.doubleClickHandler);

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
				'className':     codeshelf.domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(vertexFilterCmd, thisWorkAreaEditorView_.websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_FILTER_RESP), true);

			// Create the filter to listen to all aisle updates for this facility.
			var aisleFilterData = {
				'className':     codeshelf.domainobjects.aisle.classname,
				'propertyNames': ['DomainId', 'PosX', 'PosY'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var aisleFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, aisleFilterData);
			websession_.sendCommand(aisleFilterCmd, thisWorkAreaEditorView_.websocketCmdCallbackAisle(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		exit: function() {
			google.maps.event.removeListener(clickHandler_);
			google.maps.event.removeListener(doubleClickHandler_);
		},

		resize: function() {
			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);
			thisWorkAreaEditorView_.draw();
		},

		clickHandler: function(event) {

		},

		mouseDownHandler: function(event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), event.offsetX, event.offsetY)) {
				alert("Select a starting point inside the facility bounds.");
			} else {
				var dragTarget = goog.dom.createDom('div', { 'style': 'display:none;' });
				dragger_ = new goog.fx.Dragger(dragTarget);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.START, thisWorkAreaEditorView_.draggerStart);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.DRAG, thisWorkAreaEditorView_.draggerDrag);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.BEFOREDRAG, thisWorkAreaEditorView_.draggerBefore);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.END, thisWorkAreaEditorView_.draggerEnd);
				dragger_.startDrag(event);
				var stroke = new goog.graphics.Stroke(1, 'black');
				var fill = new goog.graphics.SolidFill('red', 0.2);
				startDragPoint_ = { 'x': event.offsetX, y: event.offsetY };
				currentRect_ = new goog.math.Rect(startDragPoint_.x, startDragPoint_.y, 0, 0);
				currentDrawRect_ = graphics_.drawRect(startDragPoint_.x, startDragPoint_.y, 0, 0, stroke, fill);
			}
		},

		doubleClickHandler: function(event) {

		},

		draggerStart: function(event) {
			event.dispose();
		},

		draggerBefore: function(event) {
			event.dispose();
		},

		draggerDrag: function(event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), startDragPoint_.x + event.target.deltaX, startDragPoint_.y + event.target.deltaY)) {
				// Dont' do anything, the last drag point was inside the facility bounds.
			} else {
				currentRect_.width = event.target.deltaX;
				currentRect_.height = event.target.deltaY;
				currentDrawRect_.setSize(event.target.deltaX, event.target.deltaY);
			}
			event.dispose();
		},

		draggerEnd: function(event) {
			var tool = toolbarSelectionModel_.getSelectedItem();
			switch (tool.getId()) {
				case 'aisle-tool':
					thisWorkAreaEditorView_.createAisle();
					break;
			}
			event.dispose();
			dragger_.dispose();
		},

		createAisle: function() {
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
						var xOriginMeters = startDragPoint_.x / drawRatio_;
						var yOriginMeters = startDragPoint_.y / drawRatio_;

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
							'className':    codeshelf.domainobjects.facility.classname,
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
						websession_.sendCommand(createAisleCmd, thisWorkAreaEditorView_.websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ), true);
					}
				}
			)
			;
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

		convertGpsToPoints: function() {

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
					var coord = thisWorkAreaEditorView_.convertLatLongToXY(lastVertex.PosY, lastVertex.PosX, vertex.PosY, vertex.PosX);
					points[i] = {};
					points[i].x = points[i - 1].x + coord.x;
					points[i].y = points[i - 1].y + coord.y;

					// Figure out the angle between point 1 and 2.
					var polar = thisWorkAreaEditorView_.convertCartesianToPolar(points[0], points[1]);
					rotateFacilityByDeg_ = 0 - polar.angle;
				}

			}
			return points;
		},

		rotatePoint: function(aroundPoint, point, a) {
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
		},

		rotatePoints: function(points, mostNegPoint) {
			for (var i = 0; i < Object.size(points); i++) {
				var point = points[i];
				if (i > 0) {
					thisWorkAreaEditorView_.rotatePoint(points[0], point, rotateFacilityByDeg_);
				}
				if (point.x < mostNegPoint.x) {
					mostNegPoint.x = point.x;
				}
				if (point.y < mostNegPoint.y) {
					mostNegPoint.y = point.y;
				}
			}
		},

		translatePoints: function(points, mostNegPoint, mostPosPoint) {
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
		},

		scalePoints: function(points, mostPosPoint, bufferPoint) {
			for (var i = 0; i < Object.size(points); i++) {
				var point = points[i];
				// Scale it to 80% of the draw area.
				drawRatio_ = Math.min((graphics_.getPixelSize().width - bufferPoint.x * 2) / mostPosPoint.x, (graphics_.getPixelSize().height - bufferPoint.y) / mostPosPoint.y);

				point.x *= drawRatio_;
				point.y *= drawRatio_;
			}
			mostPosPoint.x *= drawRatio_;
			mostPosPoint.y *= drawRatio_;
		},

		mirrorYPoints: function(points, mostPosPoint, bufferPoint) {
			for (var i = 0; i < Object.size(points); i++) {
				var point = points[i];
				// Mirror Y since the zero scale is upside down in DOM.
				point.y = graphics_.getPixelSize().height - point.y - (graphics_.getPixelSize().height - mostPosPoint.y);

				// Remove half of the buffer at the end to slide the image into the middle of the draw area.
				point.x += (bufferPoint.x / 2);
				point.y += (bufferPoint.y / 2);
			}
		},

		computeFacilityPath: function() {
			var path = new goog.graphics.Path();

			var mostNegPoint = { x: 0, y: 0 };
			var mostPosPoint = { x: 0, y: 0 };
			var bufferPoint = { x: 10, y: 10 };
			if ((Object.size(vertices_) === Object.size(vertices_)) && (Object.size(vertices_) > 1)) {
				mostNegPoint = { x: 0, y: 0};
				var points = thisWorkAreaEditorView_.convertGpsToPoints();
				thisWorkAreaEditorView_.rotatePoints(points, mostNegPoint);
				thisWorkAreaEditorView_.translatePoints(points, mostNegPoint, mostPosPoint);
				thisWorkAreaEditorView_.scalePoints(points, mostPosPoint, bufferPoint);
				thisWorkAreaEditorView_.mirrorYPoints(points, mostPosPoint, bufferPoint);
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
		},

		computeAislePath: function(aisleData) {
			var path = new goog.graphics.Path();

			if (Object.size(aisleData.vertices) > 0) {
				var start = {};
				for (var i = 0; i < Object.size(aisleData.vertices); i++) {
					var vertex = aisleData.vertices[i];
					var point = thisWorkAreaEditorView_.convertAisleVertexToPoint(aisleData.aisle, vertex);
					if (i === 0) {
						path.moveTo(point.x, point.y);
						start.x = point.x;
						start.y = point.y;
					} else {
						path.lineTo(point.x, point.y);
					}
				}
				path.lineTo(start.x, start.y);
			}

			return path;
		},

		convertAisleVertexToPoint: function(aisle, vertex) {
			var point = {};
			point.x = (vertex.PosX + aisle.PosX) * drawRatio_;
			point.y = (vertex.PosY + aisle.PosY) * drawRatio_;
			return point;
		},

		drawPath: function(path, stroke, fill) {
			graphics_.drawPath(path, stroke, fill);
		},

		startDraw: function() {
			graphics_.clear();
		},

		endDraw: function() {

		},

		draw: function() {

			thisWorkAreaEditorView_.startDraw();

			// Draw the facility path.
			facilityPath_ = thisWorkAreaEditorView_.computeFacilityPath();
			var stroke = new goog.graphics.Stroke(1.5, 'grey');
			var fill = new goog.graphics.SolidFill('white');
			thisWorkAreaEditorView_.drawPath(facilityPath_, stroke, fill);

			// Draw the aisles
			for (var aisleKey in aisles_) {
				if (aisles_.hasOwnProperty(aisleKey)) {
					var aisleData = aisles_[aisleKey];

					var aislePath = thisWorkAreaEditorView_.computeAislePath(aisleData);
					var stroke = new goog.graphics.Stroke(1, 'black');
					var fill = new goog.graphics.SolidFill('green', 0.4);
					thisWorkAreaEditorView_.drawPath(aislePath, stroke, fill);
				}
			}

//			stroke = new goog.graphics.Stroke(4, 'black');
//			var fill = new goog.graphics.SolidFill('black');
//			path.forEachSegment(function(segment, args) {
//				if (segment === goog.graphics.Path.Segment.LINETO) {
//					for (var argNum = 0; argNum < Object.size(args); argNum += 4) {
//						var pointA = { x: args[argNum], y: args[argNum + 1]}
//						var pointB = { x: args[argNum + 2], y: args[argNum + 3]}
//						var arrowPath = goog.graphics.paths.createArrow(pointA, pointB, 10, 10);
//						thisWorkAreaEditorView_.drawPath(arrowPath, stroke, fill);
//					}
//				}
//			});

			thisWorkAreaEditorView_.endDraw();
		},

		handleUpdateFacilityVertexCmd: function(lat, lon, facilityVertex) {
			vertices_[facilityVertex['DrawOrder']] = facilityVertex;
			thisWorkAreaEditorView_.draw();
		},

		handleDeleteFacilityVertexCmd: function(lat, lon, facilityVertex) {
			vertices_.splice(facilityVertex['DrawOrder'], 1);
			thisWorkAreaEditorView_.draw();
		},

		handleUpdateAisleCmd: function(aisle) {
			if (aisles_[aisle['persistentId']] === undefined) {
				aisleData = {};
				aisleData['aisle'] = aisle;
				aisleData['aisleView'] = codeshelf.aisleview(websession_, aisle);
				aisles_[aisle['persistentId']] = aisleData;

				// Create the filter to listen to all vertex updates for this facility.
				var vertexFilterData = {
					'className':     codeshelf.domainobjects.vertex.classname,
					'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder', 'ParentPersistentId'],
					'filterClause':  'parentLocation.persistentId = :theId',
					'filterParams':  [
						{ 'name': "theId", 'value': aisle['persistentId']}
					]
				}

				var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
				websession_.sendCommand(vertexFilterCmd, thisWorkAreaEditorView_.websocketCmdCallbackAisle(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
			}
			thisWorkAreaEditorView_.draw();
		},

		handleDeleteAisleCmd: function(aisle) {
			if (aisles_[aisle['persistentId']] !== undefined) {
				aisles_.splice(aisle['persistentId'], 1);
			}
			thisWorkAreaEditorView_.draw();
		},

		handleUpdateAisleVertexCmd: function(aisleVertex) {
			var aislePersistentId = aisleVertex.ParentPersistentId;
			if (aisles_[aislePersistentId] !== undefined) {
				aisleData = aisles_[aislePersistentId];
				if (aisleData.vertices === undefined) {
					aisleData.vertices = [];
				}
				aisleData.vertices[aisleVertex.DrawOrder] = aisleVertex;
			}
			thisWorkAreaEditorView_.draw();
		},

		handleDeleteAisleVertexCmd: function(aisleVertex) {

		},

		websocketCmdCallbackFacility: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command.d.hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command.t == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command.d.r.length; i++) {
								var object = command.d.r[i];

								if (object['className'] === codeshelf.domainobjects.vertex.classname) {
									// Vertex updates.
									if (object['op'] === 'cr') {
										thisWorkAreaEditorView_.handleUpdateFacilityVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'up') {
										thisWorkAreaEditorView_.handleUpdateFacilityVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'dl') {
										thisWorkAreaEditorView_.handleDeleteFacilityVertexCmd(object['PosY'], object['PosX'], object);
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
		},

		websocketCmdCallbackAisle: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command.d.hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command.t == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command.d.r.length; i++) {
								var object = command.d.r[i];

								if (object['className'] === codeshelf.domainobjects.aisle.classname) {
									// Aisle updates
									if (object['op'] === 'cr') {
										thisWorkAreaEditorView_.handleUpdateAisleCmd(object);
									} else if (object['op'] === 'up') {
										thisWorkAreaEditorView_.handleUpdateAisleCmd(object);
									} else if (object['op'] === 'dl') {
										thisWorkAreaEditorView_.handleDeleteAisleCmd(object);
									}
								} else if (object['className'] === codeshelf.domainobjects.vertex.classname) {
									// VAisle ertex updates.
									if (object['op'] === 'cr') {
										thisWorkAreaEditorView_.handleUpdateAisleVertexCmd(object);
									} else if (object['op'] === 'up') {
										thisWorkAreaEditorView_.handleUpdateAisleVertexCmd(object);
									} else if (object['op'] === 'dl') {
										thisWorkAreaEditorView_.handleDeleteAisleVertexCmd(object);
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
