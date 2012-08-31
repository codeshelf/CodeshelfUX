/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: view.js,v 1.3 2012/08/31 00:48:34 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.view');
goog.require('codeshelf.window');
goog.require('goog.async.Delay');

/**
 * The parent behavior for all views.  (The views extend this object in order to play with the view system.)
 * @return {Object}
 */
codeshelf.view = function() {

	var thisView_;

	var viewId_;
	var viewDiv_;
	var subViews_ = {};
	var anchorPoint_;
	var pixelsPerMeter_;
	var graphic_;
	var isInvalidated_ = false;

	/**
	 * Initialize the view.
	 */
	(function initView() {
		viewId_ = goog.events.getUniqueId('view');
	})();

	thisView_ = {

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
				thisView_.doDraw();
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
		invalidate: function() {
			if (!isInvalidated_) {
				isInvalidated_ = true;
				var delay = new goog.async.Delay(thisView_.drawView, 0);
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
			subViews_[view.getViewId()] = view;
			thisView_.invalidate();
		},

		/**
		 * Remove a subview from this view.
		 * @param {codeshelf.view} view The view we're deleting.
		 */
		removeSubview: function(view) {
			delete subViews_[view.getViewId()];
			thisView_.invalidate();
		},

		/**
		 * Remove all of the subviews from this view.
		 */
		clearSubviews: function() {
			subViews_ = {};
			thisView_.invalidate();
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

	return thisView_;
}