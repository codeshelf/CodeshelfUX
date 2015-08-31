/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file gtinlistview.js author Andrew R. Huff
 */
goog.provide('codeshelf.gtinlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

codeshelf.gtinlistview = function(websession, facility, partialQuery) {
	var viewName = "Items by GTIN";
	if (partialQuery) {
		var	itemFilter = "gtinsByFacilityAndPartialQuery";
		var itemFilterParams = [
			{ 'name': 'facilityId', 'value': facility['persistentId']},
			{ 'name': 'partialQuery', 'value': '%' + partialQuery + '%'}
		];
		viewName += ": " + partialQuery;
	} else {
		var	itemFilter = "gtinsByFacility";
		var itemFilterParams = [
			{ 'name': 'facilityId', 'value': facility['persistentId']}
		];
	}
	return codeshelf.buildGtinListView(websession, facility, itemFilter, itemFilterParams, viewName);

};

/**
 * The active item locations for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.buildGtinListView = function(websession, facility, itemFilter, itemFilterParams, viewName) {

	var websession_ = websession;
	var viewName_ = viewName;
	var facility_ = facility;
	var logger_  = goog.debug.Logger.getLogger("Gtin List View");

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'gtinUi')
				return true;
			else if (inProperty['id'] ===  'itemDescription')
				return true;
			else if (inProperty['id'] ===  'itemMasterId')
				return true;
			else if (inProperty['id'] ===  'uomMasterId')
				return true;
			else if (inProperty['id'] ===  'gtinLocations')
				return true;
			else
				return false;
		},

		'getViewName': function() {
			return viewName_;
		},

		'getViewTypeName': function() {
			return 'GTIN List View';
		},

		deleteGtin: function(gtin) {
			gtinDescription = "Delete GTIN: " + [gtin['domainId']] + " for SKU: " + [gtin['itemMasterId']] + "?"
			codeshelf.simpleDlogService.showModalDialog("Confirm", gtinDescription, {})
				.then(function() {
					websession_.callServiceMethod("UiUpdateService", "deleleGtin", [gtin['persistentId']]);
				});
		}

	};

	var contextDefs = [
		{
			"label" : "Items For GTIN",
			"permission": "inventory:view",
			"action": function(gtin) {
				codeshelf.windowLauncher.loadItemsListViewForGtin(gtin['domainId'], gtin['itemMasterPersistentId'],gtin['uomMasterPersistentId']);
			}
		},
		{
			"label": "Delete GTIN",
			"permission": "gtin:edit",
			"action": self.deleteGtin
		}
	];

	var actions = [
		/*
		{
		"id" : "lightLed",
		"title": "Light Item",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-barcode"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightItem', [facility_['persistentId'],
																		item["persistentId"]
			]).then(function(response) {
				logger_.info("Sent light for item:  " + item["persistentId"]);
			});
		}
		
	}*/];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Gtin']['className'], "linkProperty": 'parent', "filter" : itemFilter, "filterParams" : itemFilterParams, "properties": domainobjects['Gtin']['properties'], "contextMenuDefs": contextDefs, "actions" : actions };

	var viewOptions = {
		//'editable':  websession_.getAuthz().hasPermission("item:edit"),
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Gtin'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
