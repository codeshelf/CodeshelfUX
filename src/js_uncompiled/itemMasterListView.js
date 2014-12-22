/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file itemMasterListView.js author jon ranstrom
 */
goog.provide('codeshelf.itemmasterlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The active 4inventory items for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.itemmasterlistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'itemLocations')
				return true;
			else if (inProperty['id'] ===  'description')
				return true;
			else if (inProperty['id'] ===  'domainId')
				return true;
			else
				return false;
		},

		'getViewName': function() {
			var returnStr = "Item Masters (SKUs)";
			return returnStr;
		},

		doLaunchWorkInstructionList: function(item) {
			var masterPersistentId = item.persistentId;
			var wiListView = codeshelf.workinstructionsByItemMaster(codeshelf.sessionGlobals.getWebsession(),codeshelf.sessionGlobals.getFacility(), masterPersistentId);
			var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
			wiListWindow.open();
		}
	};

	var contextDefs = [
		{
			"label" : "Work Instructions For SKU",
			"permission": "workInstruction:view",
			"action": function(itemMaster) {
				self.doLaunchWorkInstructionList(itemMaster);
			}
		},
		{
			"label" : "Item Locations For SKU",
			"permission": "inventory:view",
			"action": function(itemMaster) {
				codeshelf.windowLauncher.loadItemsListViewForSku(itemMaster['domainId']);
			}
		},
		{
			"label" : "Edit Item Location",
			"permission": "item:edit",
			"action": function(itemMaster) {
				codeshelf.openItemEditDialog(facility_, itemMaster['domainId'], itemMaster['description'], null, itemMaster['itemLocations']);
			}
		}

	];

	// item parent goes item->itemMaster>facility
	var itemMasterFilter = "allActiveByParent";

	var itemMasterFilterParams = [
			{ 'name': 'parentId', 'value': facility_['persistentId']}
		];


	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['ItemMaster']['className'], "linkProperty": 'parent', "filter" : itemMasterFilter, "filterParams" : itemMasterFilterParams, "properties": domainobjects['ItemMaster']['properties'], "contextMenuDefs" : contextDefs };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};

	var view = codeshelf.hierarchylistview(websession_, domainobjects['ItemMaster'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
