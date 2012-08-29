/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: view.js,v 1.2 2012/08/29 06:23:58 jeffw Exp $
 *******************************************************************************/
goog.provide('codeshelf.view');
goog.require('codeshelf.window');
goog.require('goog.async.Delay');

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
		},

		getViewId: function() {
			return viewId_;
		},

		drawView: function() {
			if (isInvalidated_) {
				thisView_.doDraw();
				for (var i = 0; i < subViews_.length; i++) {
					var subView = subViews_[i];
					subView.drawView();
				}
				isInvalidated_ = false;
			}
		},

		invalidate: function() {
			if (!isInvalidated_) {
				isInvalidated_ = true;
				var delay = new goog.async.Delay(thisView_.drawView, 0);
				delay.start();
			}
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
		}
	}

	return thisView_;
}