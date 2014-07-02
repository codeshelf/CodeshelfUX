/*******************************************************************************
 *  CodeshelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *  author jon ranstrom 2014.05.19
 *******************************************************************************/
goog.provide('codeshelf.sessionGlobals');
goog.require('goog.dom');
goog.require('goog.math.Size');


// global (sort of singleton) called the "module pattern"
codeshelf.sessionGlobals = (function() {
	// psuedo private
	var facility;
	var websession;
	// GoodEggs reliably has order groups. How?
	// Acculogistics does not have order groups.
	var hasOrderGroups;

	return {
	// public methods
	setFacility: function(inFacility){
		facility = inFacility;
	},

	getFacility: function(){
		return facility;
	},
	setWebsession: function(inWebsession){
		websession = inWebsession;
	},

	getWebsession: function(){
		return websession;
	},

	// hasOrderGroups is start of functional permissions and configuration
	getHasOrderGroups: function(){
		return hasOrderGroups;
	},
	setHasOrderGroups: function(inHasOrderGroups){
		hasOrderGroups = inHasOrderGroups;
	},


		// For window launching
	// Perhaps not "session" globals, but global functions anyway. A place to avoid cloning
	getWindowDragLimit: function() {
		// we want the right and bottom limits large as the GCT window knows to scroll there.
		// As for left, zero is ok. For top, we want the navbar width
		var theRectLimit = new goog.math.Rect(0, 70, 10000, 10000);
		return theRectLimit;
	},

	getDomNodeForNextWindow: function() {
		// The right thing to do is find the top window, and available size of the browser.
		// Offset right and down of top window, unless too far compared to browser.
		// If no window up yet, then set to a default place
		// The top window has z index = 1. Others are zero

		var windows = goog.dom.getElementsByClass("window");
		var theTopWindow = null;
		// for/in loops will iterate over keys in the ancestor prototype chain as well, so generally don't
		var l = windows.length;
		for (var i = 0; i < l; i++) {
			var aWindow = windows[i];
			if (aWindow.style.zIndex === "1")
				theTopWindow = aWindow;
		}

		if (theTopWindow) {
			return theTopWindow;
		}
		else {
			return null;
		}
	}



};
})();

