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
	var logger_  = goog.debug.Logger.getLogger("Tier Slot List View");

	var self = {
		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'firstLedNumAlongPath')
				return true;
			else if (inProperty['id'] ===  'lastLedNumAlongPath')
				return true;
			else if (inProperty['id'] ===  'primaryAliasId')
				return true;
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else if (inProperty['id'] ===  'domainId')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return 'Slots in Tier ' + codeshelf.toLocationDescription(inTier);
		}
	};

	var contextDefs = [
		{
			"label" : "Item Locations  For Slot",
			"permission": "inventory:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadItemsListView(itemContext);
			}
		}
	];

	var actions = [{
		"id" : "lightLed",
		"title": "Light Led",
		"width" : 10,
		"iconClass" : "glyphicon-flash",
		"handler" : function(event, args, item) {
			var locationId = item["nominalLocationId"];
			websession_.callServiceMethod("LightService", 'lightOneLocation', ["RED",
																		   facility_['persistentId'],
																		   locationId
			]).then(function(response) {
				logger_.info("Sent light for location:  " + locationId);
			});
		}
	}];

	// tier parent goes bay->aisle>facility
	var tierSlotFilter = 'parent.persistentId = :theId and active = true';

	var tierSlotFilterParams = [
		{ 'name': 'theId', 'value': tier_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Slot']['className'], "linkProperty": 'parent', "filter" : tierSlotFilter, "filterParams" : tierSlotFilterParams, "properties": domainobjects['Slot']['properties'], "contextMenuDefs": contextDefs, "actions" : actions };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Slot'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
