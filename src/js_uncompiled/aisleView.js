/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: aisleView.js,v 1.1 2012/07/29 03:27:06 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.aisleview');
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
goog.require('raphael');

codeshelf.aisleview = function(websession, aisle) {

	var thisAisleView_;
	var websession_ = websession;
	var aisle_ = aisle;
	var mouseDownHandler_;
	var clickHandler_;
	var doubleClickHandler_;
	var dragger_;
	var startDragPoint_;
	var mainPane_;
	var graphics_;
	var vertices_ = [];
	var facilityPath_;
	var currentRect_;
	var currentDrawRect_;

	thisAisleView_ = {

		setupView: function(contentElement) {

			var aidleEditor = soy.renderAsElement(codeshelf.templates.aisleEditor);
			goog.dom.appendChild(contentElement, aidleEditor);

			mainPane_ = aidleEditor.getElementsByClassName('aisleEditorPane')[0];

			clickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.CLICK, thisAisleView_.clickHandler);
			mouseDownHandler_ = goog.events.listen(mainPane_, goog.events.EventType.MOUSEDOWN, thisAisleView_.mouseDownHandler);
			doublClickHandler_ = goog.events.listen(mainPane_, goog.events.EventType.DBLCLICK, thisAisleView_.doubleClickHandler);

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

			// Compute the dimensions of the aisle outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the aisle outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(mainPane_.clientWidth, mainPane_.clientHeight);
			graphics_.render(mainPane_);

		},

		open: function() {
			// Create the filter to listen to all vertex updates for this aisle.
			var data = {
				'className':     codeshelf.domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': aisle_['persistentId']}
				]
			}

			var setListViewFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(setListViewFilterCmd, thisAisleView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		exit: function() {
			google.maps.event.removeListener(clickHandler_);
			google.maps.event.removeListener(doubleClickHandler_);
		},

		resize: function() {
			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);
			thisAisleView_.draw();
		},

		clickHandler: function(event) {

		},

		mouseDownHandler: function(event) {
			if (!Raphael.isPointInsidePath(goog.graphics.SvgGraphics.getSvgPath(facilityPath_), event.offsetX, event.offsetY)) {
				alert("Select a starting point inside the aisle bounds.");
			} else {
				var dragTarget = goog.dom.createDom('div', { 'style': 'display:none;' });
				dragger_ = new goog.fx.Dragger(dragTarget);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.START, thisAisleView_.draggerStart);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.DRAG, thisAisleView_.draggerDrag);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.BEFOREDRAG, thisAisleView_.draggerBefore);
				goog.events.listen(dragger_, goog.fx.Dragger.EventType.END, thisAisleView_.draggerEnd);
				dragger_.startDrag(event);
				var stroke = new goog.graphics.Stroke(1, 'black');
				var fill = new goog.graphics.SolidFill('red');
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
				// Dont' do anything, the last drag point was inside the aisle bounds.
			} else {
				currentRect_.width = event.target.deltaX;
				currentRect_.height = event.target.deltaY;
				currentDrawRect_.setSize(event.target.deltaX, event.target.deltaY);
			}
			event.dispose();
		},

		draggerEnd: function(event) {
			event.dispose();
			dragger_.dispose();
		},

		computeFacilityPath: function(stroke) {
			var path = new goog.graphics.Path();

			var mostNegPoint = { x: 0, y: 0 };
			var mostPosPoint = { x: 0, y: 0 };
			var bufferPoint = { x: 10, y: 10 };
			if ((Object.size(vertices_) === Object.size(vertices_)) && (Object.size(vertices_) > 1)) {
				mostNegPoint = { x: 0, y: 0};
				var points = thisAisleView_.convertGpsToPoints();
				thisAisleView_.rotatePoints(points, mostNegPoint);
				thisAisleView_.translatePoints(points, mostNegPoint, mostPosPoint);
				thisAisleView_.scalePoints(points, mostPosPoint, bufferPoint);
				thisAisleView_.mirrorYPoints(points, mostPosPoint, bufferPoint);
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
			thisAisleView_.startDraw();
			facilityPath_ = thisAisleView_.computeFacilityPath();
			var stroke = new goog.graphics.Stroke(1.5, 'grey');
			var fill = new goog.graphics.SolidFill('white');
			thisAisleView_.drawPath(facilityPath_, stroke, fill);

//			stroke = new goog.graphics.Stroke(4, 'black');
//			var fill = new goog.graphics.SolidFill('black');
//			path.forEachSegment(function(segment, args) {
//				if (segment === goog.graphics.Path.Segment.LINETO) {
//					for (var argNum = 0; argNum < Object.size(args); argNum += 4) {
//						var pointA = { x: args[argNum], y: args[argNum + 1]}
//						var pointB = { x: args[argNum + 2], y: args[argNum + 3]}
//						var arrowPath = goog.graphics.paths.createArrow(pointA, pointB, 10, 10);
//						thisAisleView_.drawPath(arrowPath, stroke, fill);
//					}
//				}
//			});

			thisAisleView_.endDraw();
		},

		handleCreateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisAisleView_.draw();
		},

		handleUpdateVertexCmd: function(lat, lon, object) {
			vertices_[object.DrawOrder] = object;
			thisAisleView_.draw();
		},

		handleDeleteVertexCmd: function(lat, lon, object) {
			vertices_.splice(object.DrawOrder, 1);
			thisAisleView_.draw();
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
										thisAisleView_.handleCreateVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'up') {
										thisAisleView_.handleUpdateVertexCmd(object['PosY'], object['PosX'], object);
									} else if (object['op'] === 'dl') {
										thisAisleView_.handleDeleteVertexCmd(object['PosY'], object['PosX'], object);
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

	return thisAisleView_;
}
