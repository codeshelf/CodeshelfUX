/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: aisleView.js,v 1.10 2012/09/01 18:49:56 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('domainobjects');
goog.require('codeshelf.templates');
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

/**
 * The AisleView object
 * @param {codeshelf.websession} websession The websession for this view.
 * @param {Object} aisle The aisle object for this aisle.
 * @param {goog.graphics.AbstractGraphics} graphics The graphics context where we can draw.
 * @return {Object}
 */
codeshelf.aisleview = function(websession, aisle) {

	var websession_ = websession;
	var aisle_ = aisle;
	var mainPane_;
	var graphics_;
	var bays_ = [];

	/**
	 * The private AisleView object.
	 * @type {Object}
	 * @private
	 */
	var thisAisleView_ = {

		/**
		 * Setup the view
		 * @param {Element} contentElement The element where we can place all of the view content.
		 */
		setupView: function(contentElement) {

			mainPane_ = contentElement;

			// Compute the dimensions of the aisle outline, and create a bounding rectangle for it.
			// Create a draw canvas for the bounding rect.
			// Compute the path for the aisle outline and put it into the draw canavs.

			graphics_ = goog.graphics.createGraphics(mainPane_.clientWidth, mainPane_.clientHeight);
			graphics_.render(mainPane_);


			// Create the filter to listen to all bay updates for this aisle.
			var data = {
				'className':     domainobjects.bay.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'PosZ'],
				'filterClause':  'parentLocation.persistentId = :theId AND posZ = 0',
				'filterParams':  [
					{ 'name': "theId", 'value': aisle_['persistentId']}
				]
			};

			var bayFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, data);
			websession_.sendCommand(bayFilterCmd, thisAisleView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},


		/**
		 * Open the view.
		 */
		open: function() {

		},

		/**
		 * Close the view.
		 */
		close: function() {

		},

		/**
		 * Called just before we close the view.
		 */
		exit: function() {

		},

		/**
		 * Call after we've resized the underlying parent view or window.
		 */
		doResize: function() {
			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);
			thisAisleView_.invalidate();
		},

		drawPath: function(path, stroke, fill) {
			graphics_.drawPath(path, stroke, fill);
		},

		startDraw: function() {
			graphics_.clear();
		},

		endDraw: function() {

		},

		doDraw: function(bay) {
			thisAisleView_.startDraw();

			// Draw the bays
			for (var bayKey in bays_) {
				if (bays_.hasOwnProperty(bayKey)) {
					var bayData = bays_[bayKey];

					bayData['bayElement'].style.left = (/* parseInt(mainPane_.style.left) + */ (bayData['bay']['PosX'] * thisAisleView_.getPixelsPerMeter())) + 'px';
					bayData['bayElement'].style.top = (/* parseInt(mainPane_.style.top) + */ (bayData['bay']['PosY'] * thisAisleView_.getPixelsPerMeter())) + 'px';

					// If this is the lowest bay, and there are at least four vertices then draw the bay.
					if ((bayData['bay'].PosZ === 0) && (Object.size(bayData.vertices) >= 4)) {
						var bayPath = thisAisleView_.computeBayPath(bayData);
						var stroke = new goog.graphics.Stroke(0.5, 'black');
						var fill = new goog.graphics.SolidFill('white', 0.2);
						thisAisleView_.drawPath(bayPath, stroke, fill);
					}
				}
			}

			graphics_.setSize(mainPane_.clientWidth, mainPane_.clientHeight);

			thisAisleView_.endDraw();
		},

		/**
		 * Compute the path for a bay.
		 * @param {Object} bayData The bay for which we need the path.
		 * @return {goog.graphics.Path}
		 */
		computeBayPath: function(bayData) {
			var path = new goog.graphics.Path();

			if (Object.size(bayData.vertices) > 0) {
				var start = {};
				for (var i = 0; i < Object.size(bayData.vertices); i++) {
					var vertex = bayData.vertices[i];
					var point = thisAisleView_.convertBayVertexToPoint(bayData['bayElement'], vertex);
					if (i === 0) {
						path.moveTo(point.x, point.y);
						start.x = point.x;
						start.y = point.y;
					} else {
						path.lineTo(point.x, point.y);
						var width = parseInt(bayData['bayElement'].style.width);
						if ((isNaN(width)) || (width < (Math.abs(start.x - point.x)))) {
							bayData['bayElement'].style.width = (Math.abs(start.x - point.x)) + 'px';
						}
						var height = parseInt(bayData['bayElement'].style.height);
						if ((isNaN(height)) || (height < (Math.abs(start.y - point.y)))) {
							bayData['bayElement'].style.height = (Math.abs(start.y - point.y)) + 'px';
						}
					}
				}
				path.lineTo(start.x, start.y);
			}

			return path;
		},

		/**
		 * Convert a Bay's vertex into a point in graphics space (pixels).
		 * @param {Element} bayElement The HTML element to which the point will be relative.
		 * @param {Object} vertex The vertex for which we need a point.
		 * @return {Object}
		 */
		convertBayVertexToPoint: function(bayElement, vertex) {
			var point = {};
			point.x = parseInt(bayElement.style.left) + (vertex.PosX * thisAisleView_.getPixelsPerMeter());
			point.y = parseInt(bayElement.style.top) + (vertex.PosY * thisAisleView_.getPixelsPerMeter());
			return point;
		},

		/**
		 * Handle any bay update commands that arrive over the websocket for this aisle.
		 * @param {Object} bay The updated bay.
		 */
		handleUpdateBayCmd: function(bay) {
			if (bays_[bay['persistentId']] === undefined) {
				// Create and populate the bay's data record.
				var bayData = {};
				bayData['bay'] = bay;

				bayData['bayElement'] = soy.renderAsElement(codeshelf.templates.bayView, {id: bay['DomainId']});
				goog.dom.appendChild(mainPane_, bayData['bayElement']);
				bayData['bayElement'].style.left = (parseInt(mainPane_.style.left) + (bay['PosX'] * thisAisleView_.getPixelsPerMeter())) + 'px';
				bayData['bayElement'].style.top = (parseInt(mainPane_.style.top) + (bay['PosY'] * thisAisleView_.getPixelsPerMeter())) + 'px';

				bays_[bay['persistentId']] = bayData;

				// Create the filter to listen to all vertex updates for this facility.
				var vertexFilterData = {
					'className':     domainobjects.vertex.classname,
					'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder', 'ParentPersistentId'],
					'filterClause':  'parentLocation.persistentId = :theId',
					'filterParams':  [
						{ 'name': "theId", 'value': bay['persistentId']}
					]
				}

				var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
				websession_.sendCommand(vertexFilterCmd, thisAisleView_.websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
			}
			thisAisleView_.invalidate(bay);
		},

		/**
		 * Handle any bay delete commands that arrive over the websocket for this aisle.
		 * @param {Object} bay The deleted bay.
		 */
		handleDeleteBayCmd: function(bay) {
			if (bays_[bay['persistentId']] !== undefined) {
				bays_.splice(bay['persistentId'], 1);
			}
			thisAisleView_.invalidate(bay);
		},

		/**
		 * Handle any bay vertex update commands that arrive over the websocket for this aisle.
		 * @param {Object} bayvertex The updated bay vertex.
		 */
		handleUpdateBayVertexCmd: function(bayVertex) {
			var bayPersistentId = bayVertex.ParentPersistentId;
			if (bays_[bayPersistentId] !== undefined) {
				bayData = bays_[bayPersistentId];
				if (bayData.vertices === undefined) {
					bayData.vertices = [];
				}
				bayData.vertices[bayVertex.DrawOrder] = bayVertex;
				thisAisleView_.invalidate(bayData['bay']);
			}
		},

		/**
		 * Handle any bay vertex delete commands that arrive over the websocket for this aisle.
		 * @param {Object} bayvertex The deleted bay vertex.
		 */
		handleDeleteBayVertexCmd: function(bayVertex) {

		},

		/**
		 * The callback to use for any commands we send to the remote server.
		 * @return {Object}
		 */
		websocketCmdCallback: function(expectedResponseType) {
			var callback = {
				exec:                    function(command) {
					if (!command['d'].hasOwnProperty('r')) {
						alert('response has no result');
					} else {
						if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
							for (var i = 0; i < command['d']['r'].length; i++) {
								var object = command['d']['r'][i];

								if (object['className'] === domainobjects.bay.classname) {
									// Bay updates
									if (object['op'] === 'cr') {
										thisAisleView_.handleUpdateBayCmd(object);
									} else if (object['op'] === 'up') {
										thisAisleView_.handleUpdateBayCmd(object);
									} else if (object['op'] === 'dl') {
										thisAisleView_.handleDeleteBayCmd(object);
									}
								} else if (object['className'] === domainobjects.vertex.classname) {
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
				}
			}

			return callback;
		}
	}

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view();
	jQuery.extend(view, thisAisleView_);
	thisAisleView_ = view;

	return thisAisleView_;
}