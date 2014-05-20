/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *  author jon ranstrom 2014.05.19
 *******************************************************************************/
goog.provide('codeshelf.sessionGlobals');


// global (sort of singleton) called the "module pattern"
codeshelf.sessionGlobals = (function() {
	// psuedo private
	var facility;
	var websession;

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
	}


};
})();

