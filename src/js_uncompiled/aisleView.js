/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: aisleView.js,v 1.5 2012/08/06 16:43:53 jeffw Exp $
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

codeshelf.aisleview = function(websession, aisle, drawRatio, graphics) {

	var websession_ = websession;
	var drawRatio_ = drawRatio;
	var aisle_ = aisle;
	var mainPane_;
	var graphics_ = graphics;
	var bays_ = [];

	var thisAisleView_ = {

		setupView: function(contentElement) {

			mainPane_ = soy.renderAsElement(codeshelf.templates.aisleView);
			goog.dom.appendChild(contentElement, mainPane_);
			mainPane_.style.left = contentElement.style.left;
			mainPane_.style.top = contentElement.style.top;

			// Compute the dimensions of the aisle outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the aisle outline and put it into the draw canavs.

			//graphics_ = goog.graphics.createGraphics(mainPane_.clientWidth, mainPane_.clientHeight);
//			graphics_.render(mainPane_);


			// Create the filter to listen to all bay updates for this aisle.
			var data = {
				'className':     codeshelf.domainobjects.bay.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'PosZ'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': aisle_['persistentId']}
				]
			};

			var bayFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(bayFilterCmd, thisAisleView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		open: function() {
		},

		close: function() {

		},

		exit: function() {

		},

		resize: function() {
			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);
			thisAisleView_.draw();
		},

		drawPath: function(path, stroke, fill) {
			graphics_.drawPath(path, stroke, fill);
		},

		startDraw: function() {
			graphics_.clear();
		},

		endDraw: function() {

		},

		draw: function(bay) {
//			thisAisleView_.startDraw();

			// Draw the bays
//			for (var bayKey in bays_) {
			if (bay !== undefined) {
				bayKey = bay['persistentId'];
				if (bays_.hasOwnProperty(bayKey)) {
					var bayData = bays_[bayKey];

					// If this is the lowest bay, and there are at least four vertices then draw the bay.
					if ((bayData['bay'].PosZ === 0) && (Object.size(bayData.vertices) >= 4)) {
						var bayPath = thisAisleView_.computeBayPath(bayData);
						var stroke = new goog.graphics.Stroke(0.5, 'black');
						var fill = new goog.graphics.SolidFill('white', 0.2);
						thisAisleView_.drawPath(bayPath, stroke, fill);
					}
				}
			}

//			thisAisleView_.endDraw();
		},

		computeBayPath: function(bayData) {
			var path = new goog.graphics.Path();

			if (Object.size(bayData.vertices) > 0) {
				var start = {};
				for (var i = 0; i < Object.size(bayData.vertices); i++) {
					var vertex = bayData.vertices[i];
					var point = thisAisleView_.convertBayVertexToPoint(bayData.bay, bayData['bayElement'], vertex);
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

		convertBayVertexToPoint: function(bay, bayElement, vertex) {
			var point = {};
			point.x = parseInt(bayElement.style.left) + (vertex.PosX * drawRatio_);
			point.y = parseInt(bayElement.style.top) + (vertex.PosY * drawRatio_);
			return point;
		},

		handleUpdateBayCmd: function(bay) {
			if (bays_[bay['persistentId']] === undefined) {
				// Create and populate the bay's data record.
				bayData = {};
				bayData['bay'] = bay;

				bayData['bayElement'] = soy.renderAsElement(codeshelf.templates.bayView);
				goog.dom.appendChild(mainPane_, bayData['bayElement']);
				bayData['bayElement'].style.left = (parseInt(mainPane_.style.left) + (bay.PosX * drawRatio_)) + 'px';
				bayData['bayElement'].style.top = (parseInt(mainPane_.style.top) + (bay.PosY * drawRatio_)) + 'px';

				bays_[bay['persistentId']] = bayData;

				// Create the filter to listen to all vertex updates for this facility.
				var vertexFilterData = {
					'className':     codeshelf.domainobjects.vertex.classname,
					'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder', 'ParentPersistentId'],
					'filterClause':  'parentLocation.persistentId = :theId',
					'filterParams':  [
						{ 'name': "theId", 'value': bay['persistentId']}
					]
				}

				var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
				websession_.sendCommand(vertexFilterCmd, thisAisleView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
			}
			thisAisleView_.draw(bay);
		},

		handleDeleteBayCmd: function(bay) {
			if (bays_[bay['persistentId']] !== undefined) {
				bays_.splice(bay['persistentId'], 1);
			}
			thisAisleView_.draw(bay);
		},

		handleUpdateBayVertexCmd: function(bayVertex) {
			var bayPersistentId = bayVertex.ParentPersistentId;
			if (bays_[bayPersistentId] !== undefined) {
				bayData = bays_[bayPersistentId];
				if (bayData.vertices === undefined) {
					bayData.vertices = [];
				}
				bayData.vertices[bayVertex.DrawOrder] = bayVertex;
				thisAisleView_.draw(bayData['bay']);
			}
		},

		handleDeleteBayVertexCmd: function(bayVertex) {

		},

		websocketCmdCallback: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command['d'].hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command['d']['r'].length; i++) {
								var object = command['d']['r'][i];

								if (object['className'] === codeshelf.domainobjects.bay.classname) {
									// Bay updates
									if (object['op'] === 'cr') {
										thisAisleView_.handleUpdateBayCmd(object);
									} else if (object['op'] === 'up') {
										thisAisleView_.handleUpdateBayCmd(object);
									} else if (object['op'] === 'dl') {
										thisAisleView_.handleDeleteBayCmd(object);
									}
								} else if (object['className'] === codeshelf.domainobjects.vertex.classname) {
									// Vertex updates.
									if (object['op'] === 'cr') {
										thisAisleView_.handleUpdateBayVertexCmd(object);
									} else if (object['op'] === 'up') {
										thisAisleView_.handleUpdateBayVertexCmd(object);
									} else if (object['op'] === 'dl') {
										thisAisleView_.handleDeleteBayVertexCmd(object);
									}
								}

							}
						} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
						} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
						} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
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
