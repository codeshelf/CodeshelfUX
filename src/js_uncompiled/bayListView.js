/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file bayListView.js author jon ranstrom
 */
goog.provide('codeshelf.baylistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The bays for this facility. Or a the bays for one aisle later
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.baylistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;


	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {
				/* appears to never be called
				var theLogger = goog.debug.Logger.getLogger('aislesListView');
				theLogger.info("callback exec called"); */
			}
		};

		return callback;
	}

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'domainId')
				return false;
			else if (inProperty['id'] ===  'pickFaceEndPosX')
				return false;
			else if (inProperty['id'] ===  'pickFaceEndPosY')
				return false;
			else if (inProperty['id'] ===  'anchorPosX')
				return false;
			else if (inProperty['id'] ===  'anchorPosY')
				return false;
			else if (inProperty['id'] ===  'nominalLocationId')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'Bays List';
		}
	};
	// tier parent goes bay->aisle>facility
	var bayFilter = 'parent.parent.persistentId = :theId';

	var bayFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Bay']['className'], "linkProperty": 'parent', "filter" : bayFilter, "filterParams" : bayFilterParams, "properties": domainobjects['Bay']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Bay'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
