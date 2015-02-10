/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file workInstructionListView.js author jon ranstrom
 */
goog.provide('codeshelf.workinstructionlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('codeshelf.dateformat');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

codeshelf.defaultWiColumnsWithSort = [
	'groupAndSortCode',
	'description',
	'containerId',
	'pickInstructionUi',
	'status',
	'planQuantity',
	'uomMasterId'
];
codeshelf.defaultWiColumnsNoSort = [
	'completed',
	'description',
	'containerId',
	'pickInstructionUi',
	'status',
	'planQuantity',
	'uomMasterId'
];


/*
7 variations of work instruction list view. How many default formats do we want?
Sort is very relevant for CHE run. Not so much otherwise.
Complete time is usually relevant.
Is CHE needed? Might be in the views that do not come from CHE list.

See getViewSubType() below. "1" corresponds to defaultWiColumnsWithSort, and "2" to defaultWiColumnsNoSort.
It would be ok for different cookie types to share a common default, but for now they match up.
*/


// This is the main CHE run history
codeshelf.workinstructionByCheAndAssignedTimestamp = function(websession, facility, inChe, assignedTimestamp) {
	var viewNameSuffix = "for " + inChe['domainId'] + " and time: " + codeshelf.conciseDateTimeFormat(assignedTimestamp);

	// all work instructions for this che, and the given assigned time but only active orders. (Not checking active details)
	var workInstructionFilter = "workInstructionByCheAndAssignedTime";

	var workInstructionFilterParams = [
		{ 'name': 'cheId', 'value': inChe['persistentId']},
		{ 'name': 'assignedTimestamp', 'value': assignedTimestamp, 'type': 'java.sql.Timestamp'}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsWithSort, workInstructionFilter, workInstructionFilterParams);

};

codeshelf.workinstructionByCheAndDay = function(websession, facility, inChe, assignedTimestamp) {
	var viewNameSuffix = "for " + inChe['domainId'] + " on: " + codeshelf.conciseDateFormat(assignedTimestamp);

	// all work instructions for this che, and the given assigned time but only active orders. (Not checking active details)
	var workInstructionFilter = "workInstructionByCheAndDay";

	var workInstructionFilterParams = [
		{ 'name': 'cheId', 'value': inChe['persistentId']},
		{ 'name': 'assignedTimestamp', 'value': assignedTimestamp, 'type': 'java.sql.Timestamp'}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);

};

codeshelf.workinstructionByCheAll = function(websession, facility, inChe) {
	var viewNameSuffix = "for " + inChe['domainId'];

	// all work instructions for this che, and the given assigned time but only active orders. (Not checking active details)
	var workInstructionFilter = "workInstructionByCheAll";

	var workInstructionFilterParams = [
		{ 'name': 'cheId', 'value': inChe['persistentId']}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);

};


codeshelf.workinstructionsByItemMaster = function(websession, facility, inItemMasterId) {
	var viewNameSuffix = "for item";

	// all work instructions for this item, including complete.
	var workInstructionFilter = "workInstructionBySku";

	var	workInstructionFilterParams = [
		{ 'name': 'sku', 'value': inItemMasterId}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);
};

codeshelf.workinstructionsByOrderDetail = function(websession, facility, inDetailPersistentId) {
	var viewNameSuffix = "for Order Detail";

	// all work instructions for this item, including complete.
	var workInstructionFilter = "workInstructionsByDetail";

	var	workInstructionFilterParams = [
		{ 'name': 'orderDetail', 'value': inDetailPersistentId}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);
};

codeshelf.workinstructionsByOrderHeader = function(websession, facility, inHeaderPersistentId) {
	var viewNameSuffix = "for Order";

	// all work instructions for this item, including complete.
	var workInstructionFilter = "workInstructionsByHeader";

	var	workInstructionFilterParams = [
		{ 'name': 'orderHeader', 'value': inHeaderPersistentId}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);
};


codeshelf.workinstructionsAll = function(websession, facility) {
	// all uncompleted work instructions this facility. Include REVERT though
	// through V4 parentage goes workInstruction->orderDetail->orderHeader->facility
	// from V5 work instruction parent is facility.
	var	workInstructionFilter = "workInstructionsByFacility";

	var workInstructionFilterParams = [
		{ 'name': 'facilityId', 'value': facility['persistentId']}
	];
	return codeshelf.workinstructionlistview(websession, facility, "", codeshelf.defaultWiColumnsNoSort, workInstructionFilter, workInstructionFilterParams);
};

/**
 * The active container uses for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.workinstructionlistview = function(websession, facility, viewNameSuffix, defaultColumns, workInstructionFilter, workInstructionFilterParams) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor

	// kludgy. 7 kinds of work instructions views. Primarily distiguishable by the viewNameSuffix. How many different cookies for the 7 views?
	function getViewSubType() {
		if (viewNameSuffix.indexOf("and time: ") > -1 )
			return "1";
		else
			return "2";
	};

	var self = {

		// somewhat variable default fields depending on what sort of list this is
		'shouldAddThisColumn': function(inProperty){
			return goog.array.contains(defaultColumns, inProperty['id']);
		},

		'getViewName': function() {
			var returnStr = "Work Instructions " + viewNameSuffix;
			return returnStr;
		},

		'getViewTypeName': function() {
			var returnStr = "Work Instructions" + getViewSubType();
			return returnStr;
		},

		doFakeCompleteWorkInstruction: function(item, inUpdateKind) {
			var wi = item;
			var methodArgs = [item['persistentId'], inUpdateKind];
			websession_.callServiceMethod("WorkService", 'fakeCompleteWi', methodArgs);
		},

		completeWorkInstruction: function(item) {
			self.doFakeCompleteWorkInstruction(item, 'COMPLETE');
		},

		shortWorkInstruction: function(item) {
			self.doFakeCompleteWorkInstruction(item, 'SHORT');
		}
	};

	var contextDefs = [
		{
			"label": "TESTING ONLY-Complete",
			"permission": "workinstructions:simulate",
			"action": function(itemContext) {
				self.completeWorkInstruction(itemContext);
			}
		},
		{
			"label": "TESTING ONLY-Short",
			"permission": "workinstructions:simulate",
			"action": function(itemContext) {
				self.shortWorkInstruction(itemContext);
			}
		},
		{
			"label" : "Item Locations For SKU",
			"permission": "inventory:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadItemsListViewForSku(itemContext['itemMasterId']);
			}
		}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['WorkInstruction']['className'], "linkProperty": 'parent', "filter" : workInstructionFilter, "filterParams" : workInstructionFilterParams, "properties": domainobjects['WorkInstruction']['properties'], "contextMenuDefs" : contextDefs };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['WorkInstruction'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
