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

/**
 * The active container uses for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.workinstructionlistview = function(websession, facility, inChe, inItemMasterId, inOrder) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor
	var che_ = inChe;
	var itemMasterId_ = inItemMasterId;
	var order_ = inOrder;

	var contextMenu_;

	var self = {

		// somewhat variable default fields depending on what sort of list this is
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'description')
				return true;
			else if (inProperty['id'] ===  'containerId')
				return true;
			else if (inProperty['id'] ===  'pickInstruction')
				return true;
			else if (inProperty['id'] ===  'statusEnum')
				return true;
			else if (inProperty['id'] ===  'planQuantity')
				return true;
			else if (inProperty['id'] ===  'uomMasterId')
				return true;
			else if (inProperty['id'] ===  'groupAndSortCode')
				return goog.string.isEmpty(itemMasterId_) // mostly completed WIs in item WI list. Sort code is irrelevant
			else if (inProperty['id'] ===  'assignedCheName')
				return (che_ === null); //list title has the CHE if a CHE wi list
			else if (inProperty['id'] ===  'completeTimeForUi')
				return (!goog.string.isEmpty(itemMasterId_)); //might want this for CHE wi list also
			else
				return false;
			// need to add che once we have the meta field
		},

		getViewName: function() {
			var returnStr = "Work Instructions";
			if (che_ != null){
				returnStr = returnStr + " for " + che_['domainId'];
			}
			if (!goog.string.isEmpty(itemMasterId_)){
				returnStr = returnStr + " for item" ; // don't have the item description or sku here.
				// The persistent ID is useless. Will be obvious in the view anyway
			}
			return returnStr;
		},

		setupContextMenu: function() {
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
				}
			];

			var filteredContextDefs = goog.array.filter(contextDefs, function(contextDef) {
				var permissionNeeded = contextDef["permission"];
				return websession_.getAuthz().hasPermission(permissionNeeded);
			});
			contextMenu_ = new codeshelf.ContextMenu(filteredContextDefs);
			contextMenu_.setupContextMenu();
		},

		doContextMenu: function(event, item, column) {
			contextMenu_.doContextMenu(event, item, column);
		},

		closeContextMenu: function(item) {
			contextMenu_.closeContextMenu(item);
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

	var workInstructionFilter;
	var workInstructionFilterParams;

	if (null != che_) {
		// all work instructions for this che, including complete. But only active orders. (Not checking active details)
		workInstructionFilter = "assignedChe = :theId and statusEnum != 'COMPLETE' and parent.parent.active = true";

		// Experiments
		// Does not work:  "assignedChePersistentid = :theId";      // seems like it could work, and would if there were a text field
																	// assignedChePersistentid that would persist as assigned_che_persistentid

		// Does work PREFERRED:  "assignedChe = :theId";            // the work instruction java field name is assignedChe
		// Does work:  "assigned_che_persistentid = :theId";        // the database field is assigned_che_persistentid for field assignedChe


		workInstructionFilterParams = [
			{ 'name': 'theId', 'value': che_['persistentId']}
		];

	}
	else if (!goog.string.isEmpty(itemMasterId_)) {
		// all work instructions for this item, including complete.
		workInstructionFilter = "itemMaster = :theId";

		workInstructionFilterParams = [
			{ 'name': 'theId', 'value': itemMasterId_}
		];

	}
	else { // all uncompleted work instructions this facility. Include REVERT though
		// work instuction parentage goes workInstruction->orderDetail->orderHeader->facility
		workInstructionFilter = "parent.parent.parent.persistentId = :theId and statusEnum != 'COMPLETE' and parent.parent.active = true";

		workInstructionFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];	}


	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['WorkInstruction']['className'], "linkProperty": 'parent', "filter" : workInstructionFilter, "filterParams" : workInstructionFilterParams, "properties": domainobjects['WorkInstruction']['properties'] };

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
