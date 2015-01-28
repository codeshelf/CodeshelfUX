/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file locationAliasesListView.js author jon ranstrom
 */
goog.provide('codeshelf.locationaliaseslistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


/**
 * The aisle controllers for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The LED Controllers list view.
 */
codeshelf.locationaliaseslistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

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
			// only fields in domainObjects for aisle will be asked for. We want to exclude persistent Id
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'updated')
				return false;
			else
				return true;
		},

		'getViewName': function() {
			return 'Location Aliases';
		}

	};

	// ledController parent is codeshelf_network, whose parent is the facility
	var locationAliasFilter = 'locationAliasesByFacility';

	var locationAliasFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['LocationAlias']['className'], "linkProperty": 'parent', "filter" : locationAliasFilter, "filterParams" : locationAliasFilterParams, "properties": domainobjects['LocationAlias']['properties']};

	var viewOptions = {
		'editable':  false,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['LocationAlias'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};

