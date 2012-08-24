/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: view.js,v 1.1 2012/08/24 22:55:47 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.view');
goog.require('codeshelf.window');

/**
 * Object representing a new incoming message event.
 *
 * @param {string} message The raw message coming from the view.
 * @extends {goog.events.Event}
 * @constructor
 */
codeshelf.view.InvalidateEvent = function(event) {
	goog.base(this, codeshelf.view.EventType.INVALIDATE);
};
goog.inherits(codeshelf.view.InvalidateEvent, goog.events.Event);


/**
 * The events fired by the view.
 * @enum {string} The event types for the view.
 */
codeshelf.view.EventType = {

	/**
	 * Fired after an invalidate function call..
	 */
	INVALIDATE: goog.events.getUniqueId('opened')
};


codeshelf.view = function() {

	var thisView_;

	var viewId_;
	var viewDiv_;
	var subViews_ = {};
	var anchorPoint_;
	var graphic_;
	var isInvalidated_ = false;

	thisView_ = {

		initView: function() {
			viewId_ = goog.events.getUniqueId('view');

			var viewEventHandler = new goog.events.EventHandler();
			viewEventHandler.listen(thisView_, codeshelf.view.EventType.INVALIDATE, thisView_.postInvalidateEvent);
		},

		getViewId: function() {
			return viewId_;
		},

		drawView: function() {
			if (isInvalidated_) {
				view_.doDraw();
				for (var i = 0; i < subViews_.length; i++) {
					var subView = subViews_[i];
					subView.drawView();
				}
				isInvalidated_ = false;
			}
		},

		invalidate: function() {
			isInvalidated_ = true;
		},

		addSubview: function(view) {
			subViews_[view.getViewId()] = view;
			thisView_.drawView();
		},

		removeSubview: function(view) {
			delete subViews_[view.getViewId()];
			thisView_.drawView();
		},

		clearSubviews: function() {
			subViews_ = {};
			thisView_.drawView();
		},

		postInvalidateEvent: function() {

		}
	}

	goog.inherits(thisView_, goog.events.EventTarget);

	return thisView_;
}