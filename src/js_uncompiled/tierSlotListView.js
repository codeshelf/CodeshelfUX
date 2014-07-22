/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file tierSlotListView.js author jon ranstrom
 */
goog.provide('codeshelf.tierslotlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.tierslotlistview = function(websession, facility, inTier) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor
	var tier_ = inTier;

	var contextMenu_;

	var self = {
		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'fullDomainId')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'Slots in Tier ' + tier_['tierSortName'];
		}
	};
	// tier parent goes bay->aisle>facility
	var tierSlotFilter = 'parent.persistentId = :theId';

	var tierSlotFilterParams = [
		{ 'name': 'theId', 'value': tier_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Slot']['className'], "linkProperty": 'parent', "filter" : tierSlotFilter, "filterParams" : tierSlotFilterParams, "properties": domainobjects['Slot']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Slot'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
