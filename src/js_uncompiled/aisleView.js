/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: aisleView.js,v 1.25 2013/05/03 06:06:51 jeffw Exp $
 ******************************************************************************/

goog.provide('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.templates');
goog.require('domainobjects');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.graphics');
goog.require('goog.graphics.paths');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.style');
goog.require('raphael');

/**
 * The AisleView object
 *
 * @param {codeshelf.websession} websession The websession for this view.
 * @param {Object} aisle The aisle object for this aisle.
 * @return {Object}
 */
codeshelf.aisleview = function(websession, aisle) {

	var websession_ = websession;
	var aisle_ = aisle;
	var graphics_;
	var bays_ = [];

	/**
	 * The private AisleView functions.
	 *
	 * @type {Object}
	 * @private
	 */

	function drawPath(path, stroke, fill) {
		graphics_.drawPath(path, stroke, fill);
	}

	function startDraw() {
		graphics_.clear();
	}

	function endDraw() {

	}

	/**
	 * Compute the path for a bay.
	 *
	 * @param {Object} bayData The bay for which we need the path.
	 * @return {goog.graphics.Path}
	 */
	function computeBayPath(bayData) {
		var path = new goog.graphics.Path();

		if (Object.size(bayData.vertices) > 0) {
			var start = {};
			var width = 0;
			var height = 0;
			for (var i = 0; i < Object.size(bayData.vertices); i++) {
				var vertex = bayData.vertices[i];
				var point = convertBayVertexToPoint(bayData['bayElement'], vertex);
				if (i === 0) {
					path.moveTo(point.x, point.y);
					start.x = point.x;
					start.y = point.y;
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
			bayData['bayElement'].style.width = width + 'px';
			bayData['bayElement'].style.height = height + 'px';
		}

		return path;
	}

	/**
	 * Convert a Bay's vertex into a point in graphics space (pixels).
	 *
	 * @param {Element} bayElement The HTML element to which the point will be relative.
	 * @param {Object} vertex The vertex for which we need a point.
	 * @return {Object}
	 */
	function convertBayVertexToPoint(bayElement, vertex) {
		var point = {};
		point.x = parseInt(bayElement.style.left, 10) + (vertex['posX'] * self.getPixelsPerMeter());
		point.y = parseInt(bayElement.style.top, 10) + (vertex['posY'] * self.getPixelsPerMeter());
		return point;
	}

	/**
	 * Handle any bay update commands that arrive over the websocket for this aisle.
	 *
	 * @param {Object} bay The updated bay.
	 */
	function handleUpdateBayCmd(bay) {
		if (bays_[bay['persistentId']] === undefined) {
			// Create and populate the bay's data record.
			var bayData = {};
			bayData['bay'] = bay;

			bayData['bayElement'] = soy.renderAsElement(codeshelf.templates.bayView, {
				id: bay['domainId']
			});
			goog.dom.appendChild(self.getMainPaneElement(), bayData['bayElement']);
			bayData['bayElement'].style.left = (parseInt(self.getMainPaneElement().style.left, 10) + (bay['anchorPosX'] * self.getPixelsPerMeter()))
				+ 'px';
			bayData['bayElement'].style.top = (parseInt(self.getMainPaneElement().style.top, 10) + (bay['anchorPosY'] * self
				.getPixelsPerMeter()))
				+ 'px';

			bays_[bay['persistentId']] = bayData;

			var className = domainobjects['Vertex']['className'];
			var propertyNames = [ 'domainId', 'posType', 'posX', 'posY', 'drawOrder', 'parentPersistentId' ];
			var clause = "allByParent";
			var params = [{ 'name':  'parentId','value': bay['persistentId']}];
			var vertexFilterCmd =  websession_.createRegisterFilterRequest(className,propertyNames,clause,params);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		}
		self.invalidate(bay);
	}

	/**
	 * Handle any bay delete commands that arrive over the websocket for this aisle.
	 *
	 * @param {Object} bay The deleted bay.
	 */
	function handleDeleteBayCmd(bay) {
		if (bays_[bay['persistentId']] !== undefined) {
			bays_.splice(bay['persistentId'], 1);
		}
		self.invalidate(bay);
	}

	/**
	 * Handle any bay vertex update commands that arrive over the websocket for this aisle.
	 *
	 * @param {Object}  bayVertex   The updated bay vertex.
	 */
	function handleUpdateBayVertexCmd(bayVertex) {
		var bayPersistentId = bayVertex['parentPersistentId'];
		if (bays_[bayPersistentId] !== undefined) {
			bayData = bays_[bayPersistentId];
			if (bayData.vertices === undefined) {
				bayData.vertices = [];
			}
			bayData.vertices[bayVertex['drawOrder']] = bayVertex;
			self.invalidate(bayData['bay']);
		}
	}

	/**
	 * Handle any bay vertex delete commands that arrive over the websocket for this aisle.
	 *
	 * @param {Object} bayVertex The deleted bay vertex.
	 */
	function handleDeleteBayVertexCmd(bayVertex) {

	}

	/**
	 * The callback to use for any commands we send to the remote server.
	 *
	 * @return {Object}
	 */
	function websocketCmdCallback(expectedResponseType) {
		var callback = {
			exec: function(type,command) {
				if (type == kWebSessionCommandType.OBJECT_FILTER_RESP) {
					for (var i = 0; i < command['results'].length; i++) {
						var object = command['results'][i];

						if (object['className'] === domainobjects['Bay']['className']) {
							// Bay updates
							if (object['op'] === 'cre') {
								handleUpdateBayCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdateBayCmd(object);
							} else if (object['op'] === 'dl') {
								handleDeleteBayCmd(object);
							}
						} else if (object['className'] === domainobjects['Vertex']['className']) {
							// Vertex updates.
							if (object['op'] === 'cre') {
								handleUpdateBayVertexCmd(object);
							} else if (object['op'] === 'upd') {
								handleUpdateBayVertexCmd(object);
							} else if (object['op'] === 'dl') {
								handleDeleteBayVertexCmd(object);
							}
						}
					}
				} else if (type == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
				} else if (type == kWebSessionCommandType.OBJECT_DELETE_RESP) {
				}
			}
		};

		return callback;
	}

	/**
	 * The public AisleView functions.
	 *
	 * @type {Object}
	 * @private
	 */
	var self = {

			/**
			 * Setup the view
			 */
			doSetupView: function() {

				// Compute the dimensions of the aisle outline, and create a
				// bounding rectangle for it.
				// Create a draw canvas for the bounding rect.
				// Compute the path for the aisle outline and put it into the draw
				// canavs.

				graphics_ = goog.graphics.createGraphics(self.getMainPaneElement().clientWidth, self.getMainPaneElement().clientHeight);
				graphics_.render(self.getMainPaneElement());

				var className = domainobjects['Bay']['className'];
				var propertyNames = [ 'domainId', 'anchorPosType', 'anchorPosX', 'anchorPosY', 'anchorPosZ' ];
				var clause = 'baysByZeroPosition';
				var params =  [{'name':  'parentId','value': aisle_['persistentId']}];
				var bayFilterCmd =  websession_.createRegisterFilterRequest(className,propertyNames,clause,params);
				websession_.sendCommand(bayFilterCmd, websocketCmdCallback(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
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
				//graphics_.setSize(self.getMainPaneElement().clientWidth, self.getMainPaneElement().clientHeight);
				self.invalidate();
			},

			doDraw: function(bay) {
				startDraw();

				// Draw the bays
				for (var bayKey in bays_) {
					if (bays_.hasOwnProperty(bayKey)) {
						var bayData = bays_[bayKey];

						bayData['bayElement'].style.left = (/* parseInt(self.getMainPaneElement().style.left) + */(bayData['bay']['anchorPosX'] * self
							.getPixelsPerMeter()))
							+ 'px';
						bayData['bayElement'].style.top = (/* parseInt(self.getMainPaneElement().style.top) + */(bayData['bay']['anchorPosY'] * self
							.getPixelsPerMeter()))
							+ 'px';

						// If this is the lowest bay, and there are at least four
						// vertices then draw the bay.
						if ((bayData['bay']['anchorPosZ'] === 0) && (Object.size(bayData.vertices) >= 4)) {
							var bayPath = computeBayPath(bayData);
							var stroke = new goog.graphics.Stroke(0.5, 'black');
							var fill = new goog.graphics.SolidFill('white', 0.2);
							drawPath(bayPath, stroke, fill);
						}
					}
				}

				if (self.getMainPaneElement().clientHeight < 13) {
					// If it gets smaller than 13 then SVG has weird orgin problems that cause it to draw in the wrong place.
					graphics_.setSize(self.getMainPaneElement().clientWidth, 13);
				} else {
					graphics_.setSize(self.getMainPaneElement().clientWidth, self.getMainPaneElement().clientHeight);
				}

				endDraw();
			}
		}
		;

// We want this view to extend the root/parent view, but we want to return
// this view.
	var view = codeshelf.view();
	jQuery.extend(view, self);
	self = view;

	return self;
}
;
