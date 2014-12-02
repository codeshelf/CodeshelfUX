/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file workInstructionListView.js author jon ranstrom
 */
goog.provide('codeshelf.workinstructionlistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

codeshelf.defaultWorkInstructionColumns = [
 'description',
 'containerId',
 'pickInstructionUi',
 'status',
 'planQuantity',
 'uomMasterId'
];

codeshelf.workinstructionsByCheAndAssignedTimestamp = function(websession, facility, inChe, assignedTimestamp) {
	var viewNameSuffix = "for " + inChe['domainId'] + " and time: " + codeshelf.timeUnitAwareFormat(assignedTimestamp);
	var defaultColumns  = goog.array.concat(codeshelf.defaultWorkInstructionColumns, 'assignedCheName', 'groupAndSortCode');

	// all work instructions for this che, and the given assigned time but only active orders. (Not checking active details)
	var workInstructionFilter = "workInstructionByCheAndAssignedTime";

	var workInstructionFilterParams = [
		{ 'name': 'cheId', 'value': inChe['persistentId']},
		{ 'name': 'assignedTimestamp', 'value': assignedTimestamp, 'type': 'java.sql.Timestamp'}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, defaultColumns, workInstructionFilter, workInstructionFilterParams);

};


codeshelf.workinstructionsByItemMaster = function(websession, facility, inItemMasterId) {
	var viewNameSuffix = "for item";
	var defaultColumns  = goog.array.concat(codeshelf.defaultWorkInstructionColumns, 'groupAndSortCode', 'completeTimeForUi');

	// all work instructions for this item, including complete.
	var workInstructionFilter = "workInstructionBySku";

	var	workInstructionFilterParams = [
		{ 'name': 'sku', 'value': inItemMasterId}
	];

	return codeshelf.workinstructionlistview(websession, facility, viewNameSuffix, defaultColumns, workInstructionFilter, workInstructionFilterParams);
};

codeshelf.workinstructionsAll = function(websession, facility) {
	// all uncompleted work instructions this facility. Include REVERT though
	// through V4 parentage goes workInstruction->orderDetail->orderHeader->facility
	// from V5 work instruction parent is facility.
	var	workInstructionFilter = "workInstructionsByFacility";

	var workInstructionFilterParams = [
		{ 'name': 'facilityId', 'value': facility['persistentId']}
	];
	return codeshelf.workinstructionlistview(websession, facility, "", codeshelf.defaultWorkInstructionColumns, workInstructionFilter, workInstructionFilterParams);
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

	var self = {

		// somewhat variable default fields depending on what sort of list this is
		'shouldAddThisColumn': function(inProperty){
			return goog.array.contains(defaultColumns, inProperty['id']);
		},

		getViewName: function() {
			var returnStr = "Work Instructions " + viewNameSuffix;
			return returnStr;
		},

		doFakeCompleteWorkInstruction: function(item, inUpdateKind) {
			var wi = item;
			var methodArgs = [
				{ 'name': 'inCompleteStr', 'value': inUpdateKind, 'classType': 'java.lang.String'}
			];
			codeshelf.objectUpdater.callMethod(wi, 'WorkInstruction', 'fakeCompleteWi', methodArgs);
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
