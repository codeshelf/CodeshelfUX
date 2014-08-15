/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file itemListView.js author jon ranstrom
 */
goog.provide('codeshelf.itemlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

function doSomethingWithItem() {
	// What will we do?  Most likely, something like
	// 1) lights on for all slots where the item in the container is
	// 2) Maybe a list of all item/item details for items in this container
}

/**
 * The active inventory items for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.itemlistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor

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
			if (inProperty['id'] ===  'itemLocationAlias')
				return true;
			else if (inProperty['id'] ===  'itemDescription')
				return true;
			else if (inProperty['id'] ===  'itemMasterId')
				return true;
			else if (inProperty['id'] ===  'itemQuantityUom')
				return true;
			else if (inProperty['id'] ===  'itemCmFromLeft')
				return true;
			else
				return false;
		},

		getViewName: function() {
			var returnStr = "Inventory Items";
			return returnStr;
		}
	};

	// If che_ is null, then all active container uses for this facility. If che passed in, then only container uses on that CHE.
	var itemFilter;
	var itemFilterParams;

	// item parent goes itme->itemMaster>facility
	itemFilter = "parent.parent.persistentId = :theId and active = true";

	itemFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];


	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Item']['className'], "linkProperty": 'parent', "filter" : itemFilter, "filterParams" : itemFilterParams, "properties": domainobjects['Item']['properties'] };

	var viewOptions = {
		'editable':  websession_.getAuthz().hasPermission("item:edit"),
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Item'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
