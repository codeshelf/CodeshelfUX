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

function doSomethingWithItemMaster() {
}

/**
 * The active inventory items for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.itemmasterlistview = function(websession, facility) {

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
			if (inProperty['id'] ===  'itemLocations')
				return true;
			else if (inProperty['id'] ===  'description')
				return true;
			else if (inProperty['id'] ===  'domainId')
				return true;
			else
				return false;
		},

		getViewName: function() {
			var returnStr = "Item Masters (SKUs)";
			return returnStr;
		},

		setupContextMenu: function() {
			var contextDefs = [
				{
					"label" : "Work Instructions for this Item</a>",
					"permission": "workInstruction:view",
					"action": function(itemContext) {
						self.doLaunchWorkInstructionList(itemContext);
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
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();

			if (view.getItemLevel(item) === 0) {
				contextMenu_.doContextMenu(event, item, column);
			}
		},

		closeContextMenu: function(item) {
			contextMenu_.closeContextMenu(item);
		},

		doLaunchWorkInstructionList: function(item) {
			var masterPersistentId = item.persistentId;
			var wiListView = codeshelf.workinstructionlistview(codeshelf.sessionGlobals.getWebsession(),codeshelf.sessionGlobals.getFacility(), null, masterPersistentId, null);
			var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
			wiListWindow.open();
		}

	};

	// If che_ is null, then all active container uses for this facility. If che passed in, then only container uses on that CHE.
	var itemMasterFilter;
	var itemMasterFilterParams;

	// item parent goes itme->itemMaster>facility
	itemMasterFilter = "parent.persistentId = :theId and active = true";

	itemMasterFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];


	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['ItemMaster']['className'], "linkProperty": 'parent', "filter" : itemMasterFilter, "filterParams" : itemMasterFilterParams, "properties": domainobjects['ItemMaster']['properties'] };

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
