/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: view.js,v 1.9 2012/11/08 03:35:11 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.view');
goog.require('codeshelf.window');
goog.require('codeshelf.websession');
goog.require('codeshelf.templates');

goog.require('extern.jquery.dragToSelect');
goog.require('soy');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');

/**
 * The parent behavior for all views.  (The views extend this object in order to play with the view system.)
 * @return {Object} The view.
 */
codeshelf.view = function(options) {

	var self;

	var viewId_;
	var parentView_;
	var subViews_ = {};
	var pixelsPerMeter_;
	var isInvalidated_ = false;
	var uniqueIdFunc_ = goog.events.getUniqueId;

	var mainPaneElement_;

	var toolbar_;
	var toolbarSelectionModel_;

	var mouseDownHandler_;
	var mouseClickHandler_;
	var mouseDoubleClickHandler_;
	var dragger_;

	var options_ = {
		doHandleSelection: false,
		doDragSelect:      false,
		toolbarTools:      undefined
	};

	/**
	 * Initialize the view.
	 */
	viewId_ = uniqueIdFunc_('view');

	if (typeof options == 'object') {
		options_ = $.extend(options_, options);
	}

	/**
	 * Setup the view's toolbar.
	 */
	function setupToolbar(toolbarTools) {
		// Locate the toolbar in pane provided by the view's template.
		var toolbarPane = mainPaneElement_.getElementsByClassName('toolbarPane')[0];
		var toolbarElement = soy.renderAsElement(codeshelf.templates.toolbar);

		// Build up the toobar buttons.
		for (var obj in toolbarTools) {
			if (toolbarTools.hasOwnProperty(obj)) {
				tool = toolbarTools[obj];

				var toolElement = soy.renderAsElement(codeshelf.templates.toolbarTool, {id: tool['id'], title: tool['title'], icon: tool['icon']});
				toolbarElement.appendChild(toolElement);
				toolbarElement.appendChild(goog.dom.createElement('hr'));
			}
		}

		goog.dom.appendChild(toolbarPane, toolbarElement);
		toolbar_ = new goog.ui.Toolbar();
		toolbar_.decorate(toolbarElement);
		toolbar_.setEnabled(true);
		goog.events.listen(toolbar_, goog.object.getValues(goog.ui.Component.EventType), handleToolbarEvent);


		// Have the alignment buttons be controlled by a selection model.
		toolbarSelectionModel_ = new goog.ui.SelectionModel();
		toolbarSelectionModel_.setSelectionHandler(function(button, select) {
			if (button) {
				button.setChecked(select);
			}
		});

		goog.array.forEach(toolbarTools,
			function(tool) {
				var button = toolbar_.getChild(tool['id']);
				// Let the selection model control the button's checked state.
				button.setAutoStates(goog.ui.Component.State.CHECKED, false);
				toolbarSelectionModel_.addItem(button);
				goog.events.listen(button, goog.ui.Component.EventType.ACTION,
					function(event) {
						toolbarSelectionModel_.setSelectedItem(event.target);
						event.dispose();
					});
			});

		// Select the zero-tool by default.
		toolbarSelectionModel_.setSelectedIndex(0);
	}

	/**
	 * Handle the user's click on the toolbar.
	 * @param e
	 */
	function handleToolbarEvent(e) {
		var a = 2;
	}


	function mouseClickHandler(event) {
		event.dispose();
	}

	function mouseDoubleClickHandler(event) {
		event.dispose();
	}

	function mouseDownHandler(event) {

		// Check if we should AND can drag a selection rectangle.
		if ((options_.doDragSelect) && (self.canDragSelect) && (self.canDragSelect(event))) {
			var dragTarget = goog.dom.createDom('div', { 'style': 'display:none;' });
			dragger_ = new goog.fx.Dragger(dragTarget);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.START, draggerStart);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.DRAG, draggerDrag);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.BEFOREDRAG, draggerBefore);
			goog.events.listen(dragger_, goog.fx.Dragger.EventType.END, draggerEnd);
			dragger_.startDrag(event);
		}
	}

	function draggerStart(event) {
		if (self.doDraggerStart !== undefined) {
			self.doDraggerStart(event);
		}
		event.dispose();
	}

	function draggerBefore(event) {
		if (self.doDraggerBefore !== undefined) {
			self.doDraggerBefore(event);
		}
		event.dispose();
	}

	function draggerDrag(event) {
		if (self.doDraggerDrag !== undefined) {
			self.doDraggerDrag(event);
		}
		event.dispose();
	}

	function draggerEnd(event) {
		if (self.doDraggerEnd !== undefined) {
			self.doDraggerEnd(event);
		}
		event.dispose();
		dragger_.dispose();
	}


	/**
	 * The view parent object.
	 * @type {Object}
	 */
	self = {

		setupView: function(mainPaneElement) {

			mainPaneElement_ = mainPaneElement;

			self.doSetupView();

			if (options_.doHandleSelection) {
//				$(mainPaneElement).dragToSelect({
//					selectables: 'div.selectable',
//					onHide:      function() {
//						//alert($('.workAreaEditorPane path.selected').length + ' selected');
//					}
//				});
			}

			if (options_.toolbarTools !== undefined) {
				setupToolbar(options.toolbarTools);
			}

			mouseClickHandler_ = goog.events.listen(self.getContentElement(), goog.events.EventType.CLICK, mouseClickHandler);
			mouseDownHandler_ = goog.events.listen(self.getContentElement(), goog.events.EventType.MOUSEDOWN, mouseDownHandler);
			mousedoublClickHandler_ = goog.events.listen(self.getContentElement(), goog.events.EventType.DBLCLICK, mouseDoubleClickHandler);

			goog.events.listen(mainPaneElement_, goog.events.EventType.MOUSEOVER,
				function(e) {
					mainPaneElement_.onselectstart = function() {
						return false;
					};
					mainPaneElement_.onsmousedown = function() {
						return false;
					};
				});

			goog.events.listen(mainPaneElement_, goog.events.EventType.MOUSEOUT,
				function(event) {
					mainPaneElement_.onselectstart = null;
					mainPaneElement_.onmousedown = null;
				});

		},

		/*
		Do not implement close(), as this will break our psuedo-inheritance pattern.
		close: function() {
			var theLogger = goog.debug.Logger.getLogger('view.js');
			theLogger.info("Called this close");
		},
		*/


		setParentView: function(parentView) {
			parentView_ = parentView;
		},

		getParentView: function() {
			return parentView_;
		},

		setMainPaneElement: function(mainPaneElement) {
			mainPaneElement_ = mainPaneElement;
		},

		getMainPaneElement: function() {
			return mainPaneElement_;
		},

		getContentElement: function() {
			return (self.doGetContentElement !== undefined) ? self.doGetContentElement() : mainPaneElement_;
		},

		/**
		 * Get the view's unique ID.
		 * @return {String}
		 */
		getViewId: function() {
			return viewId_;
		},

		/**
		 * Draw the view (if invalidated in an earlier operation).
		 */
		drawView: function() {
			if (isInvalidated_) {
				self.doDraw();
				for (var i in subViews_) {
					if (subViews_.hasOwnProperty(i)) {
						var subView = subViews_[i];
						subView.drawView();
					}
				}
				isInvalidated_ = false;
			}
		},

		/**
		 * Invalidate the view.
		 * (A fast operation where all acumulated invalidates result in a single draw evenet at the end.)
		 */
		resize: function() {
			self.doResize();
			for (var i in subViews_) {
				if (subViews_.hasOwnProperty(i)) {
					var subView = subViews_[i];
					subView.doResize();
				}
			}
		},

		/**
		 * Invalidate the view.
		 * (A fast operation where all acumulated invalidates result in a single draw evenet at the end.)
		 */
		invalidate: function() {
			if (!isInvalidated_) {
				isInvalidated_ = true;
				var delay = new goog.async.Delay(self.drawView, 0);
				delay.start();
				for (var i in subViews_) {
					if (subViews_.hasOwnProperty(i)) {
						var subView = subViews_[i];
						subView.invalidate();
					}
				}
			}
		},

		/**
		 * Add a subview to this view.
		 * @param {codeshelf.view} view The view we're adding.
		 */
		addSubview: function(view) {
			view.setParentView(self);
			subViews_[view.getViewId()] = view;
			self.invalidate();
		},

		/**
		 * Remove a subview from this view.
		 * @param {codeshelf.view} view The view we're deleting.
		 */
		removeSubview: function(view) {
			view.setParentView(undefined);
			delete subViews_[view.getViewId()];
			self.invalidate();
		},

		/**
		 * Remove all of the subviews from this view.
		 */
		clearSubviews: function() {
			for (var i in subViews_) {
				if (subViews_.hasOwnProperty(i)) {
					var subView = subViews_[i];
					subView.removeSubview(subView);
				}
			}
			self.invalidate();
		},

		/**
		 * Set the number of pixels per meter at the current zoom rate.
		 * @param {Number} pixelsPerMeter The number of pixels that represents one meter at this zoom level.
		 */
		setPixelsPerMeter: function(pixelsPerMeter) {
			pixelsPerMeter_ = pixelsPerMeter;

			// Set it for all of the subviews too.
			for (var i in subViews_) {
				if (subViews_.hasOwnProperty(i)) {
					var subView = subViews_[i];
					subView.setPixelsPerMeter(pixelsPerMeter);
				}
			}
		},

		/**
		 * Set the number of pixels per meter at the current zoom rate.
		 * @return {Number} The number of pixels that represents one meter at this zoom level.
		 */
		getPixelsPerMeter: function() {
			return pixelsPerMeter_;
		},

		getToolbarTool: function() {
			if (toolbarSelectionModel_ !== undefined) {
				return toolbarSelectionModel_.getSelectedItem();
			}
		}
	};

	return self;
};
