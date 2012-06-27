/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaEditorView.js,v 1.20 2012/06/27 05:07:56 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaeditorview');
goog.require('codeshelf.templates');
goog.require('codeshelf.dataentrydialog');
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
	var currentRect_;

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
				var fill = new goog.graphics.SolidFill('red');
				startDragPoint_ = { 'x': event.offsetX, y: event.offsetY };
				currentRect_ = graphics_.drawRect(startDragPoint_.x, startDragPoint_.y, 0, 0, stroke, fill);
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
				currentRect_.setSize(event.target.deltaX, event.target.deltaY);
			}
			event.dispose();
		},

		draggerEnd: function(event) {
			var tool = toolbarSelectionModel_.getSelectedItem();
			switch (tool.getId()) {
				case 'aisle-tool':
					thisWorkAreaEditorView_.createAisle(currentRect_);
					break;
			}
			event.dispose();
			dragger_.dispose();
		},

		createAisle: function(rect) {
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
					graphics_.removeElement(rect);
					currentRect_.dispose();
				} else {
					var bayHeight = dialog.getFieldValue('bayHeight');
					var bayWidth = dialog.getFieldValue('bayWidth');
					var bayDepth = dialog.getFieldValue('bayDepth');
					var baysHigh = dialog.getFieldValue('baysHigh');
					var baysLong = dialog.getFieldValue('baysLong');
					var backToBack = dialog.getFieldValue('backToBack');
				}
			});
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
				var drawRatio = Math.min((graphics_.getPixelSize().width - bufferPoint.x * 2) / mostPosPoint.x, (graphics_.getPixelSize().height - bufferPoint.y) / mostPosPoint.y);

				point.x *= drawRatio;
				point.y *= drawRatio;
			}
			mostPosPoint.x *= drawRatio;
			mostPosPoint.y *= drawRatio;
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

		computeFacilityPath: function(stroke) {
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
			facilityPath_ = thisWorkAreaEditorView_.computeFacilityPath();
			var stroke = new goog.graphics.Stroke(1.5, 'grey');
			var fill = new goog.graphics.SolidFill('white');
			thisWorkAreaEditorView_.drawPath(facilityPath_, stroke, fill);

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

		handleCreateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.draw();
		},

		handleUpdateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisWorkAreaEditorView_.draw();
		},

		handleDeleteVertexCmd: function(lat, lon, object) {
			vertices_.splice(object.DrawOrder, 1);
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
