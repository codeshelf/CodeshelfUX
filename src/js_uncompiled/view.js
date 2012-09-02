/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: view.js,v 1.6 2012/09/02 23:57:04 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.view');
goog.require('codeshelf.window');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');
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

	var mainPaneElement_;
	var contentPaneElement_;

	var toolbar_;
	var toolbarSelectionModel_;

	var mouseClickHandler_;
	var mouseMoveHandler_;

	var options_ = {
		handleSelection: false,
		toolbarTools:    undefined
	}

	/**
	 * Initialize the view.
	 */
	viewId_ = goog.events.getUniqueId('view');

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


	/**
	 * The view parent object.
	 * @type {Object}
	 */
	self = {

		setupView: function(mainPaneElement) {

			mainPaneElement_ = mainPaneElement;

			self.doSetupView();

			if (options_.handleSelection) {
				$(mainPaneElement).dragToSelect({
					selectables: 'div.selectable',
					onHide:      function() {
						//alert($('.workAreaEditorPane path.selected').length + ' selected');
					}
				});
			}

			if (options_.toolbarTools !== undefined) {
				setupToolbar(options.toolbarTools);
			}
		},

		setParentView: function(parentView) {
			parentView_ = parentView;
		},

		getParentView: function() {
			return parentView_
		},

		setMainPaneElement: function(mainPaneElement) {
			mainPaneElement_ = mainPaneElement;
		},

		getMainPaneElement: function() {
			return mainPaneElement_
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
		}
	}

	return self;
}