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
goog.require('goog.string');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


codeshelf.itemListViewForSku = function(websession, facility, sku) {
	// item parent goes itme->itemMaster>facility
	var	itemFilter = "parent.parent.persistentId = :theId and active = true and parent.domainId = :domainId";
	var itemFilterParams = [
			{ 'name': 'theId', 'value': facility['persistentId']},
			{ 'name': 'domainId', 'value': sku}
		];

	return codeshelf.buildItemListView(websession, facility, itemFilter, itemFilterParams, "Item Locations For SKU: " + sku);
};


codeshelf.itemListViewForTier = function(websession, facility, tier) {
	// item parent goes itme->itemMaster>facility
	var	itemFilter = "parent.parent.persistentId = :theId and active = true and storedLocation.persistentId = :theLocationId";
	var itemFilterParams = [
			{ 'name': 'theId', 'value': facility['persistentId']},
			{ 'name': 'theLocationId', 'value': tier['persistentId']}
		];

	return codeshelf.buildItemListView(websession, facility, itemFilter, itemFilterParams, "Item Locations For Tier: " + codeshelf.toLocationDescription(tier));
};

codeshelf.itemlistview = function(websession, facility) {
	// item parent goes itme->itemMaster>facility
	var	itemFilter = "parent.parent.persistentId = :theId and active = true";
	var itemFilterParams = [
			{ 'name': 'theId', 'value': facility['persistentId']}
		];
	return codeshelf.buildItemListView(websession, facility, itemFilter, itemFilterParams, "Item Locations");

};

/**
 * The active item locations for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.buildItemListView = function(websession, facility, itemFilter, itemFilterParams, viewName) {

	var websession_ = websession;
	var viewName_ = viewName;
	var facility_ = facility;
	var logger_  = goog.debug.Logger.getLogger("Item List View");

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
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return viewName_;
		}
	};

	var contextDefs = [
		{
			"label" : "Item Locations For SKU",
			"permission": "inventory:view",
			"action": function(item) {
				codeshelf.windowLauncher.loadItemsListViewForSku(item['itemMasterId']);
			}
		},
		{
			"label" : "Delete item location",
			"permission": "item:edit",
			"action": function(item) {
				codeshelf.simpleDlogService.showModalDialog("Confirm", "Delete the item location?", {})
					.then(function() {
						websession_.remove(item);
					});
			}
		}

	];

	var actions = [{
		"id" : "lightLed",
		"title": "Light Led",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-barcode"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightItem', [facility_['persistentId'],
																		item["persistentId"]
			]).then(function(response) {
				logger_.info("Sent light for item:  " + item["persistentId"]);
			});
		}
	}];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Item']['className'], "linkProperty": 'parent', "filter" : itemFilter, "filterParams" : itemFilterParams, "properties": domainobjects['Item']['properties'], "contextMenuDefs": contextDefs, "actions" : actions };

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

codeshelf.openItemEditDialog = function(facility, sku, description, uom, itemLocations) {
	var data = {
		"facility": facility,
		"item" : {'sku': sku, 'description': description, 'uom': uom, 'itemLocations': itemLocations}
	};
	var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/change-item.html", "ItemController as controller", data);
	modalInstance.result.then(function(){

	});
};

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.ItemController = function($scope, $modalInstance, data){
	goog.object.extend($scope, data);
	this.scope_ = $scope;
	this.scope_['response'] = {};
	this.modalInstance_ = $modalInstance;
};

/**
 * @export
 */
codeshelfApp.ItemController.prototype.ok = function(){
	var scope = this.scope_;
	var modalInstance = this.modalInstance_;
	var item = scope['item'];
	var facility = this.scope_['facility'];
	var methodArgs = [
		{ 'name': 'itemId', 'value': item['sku'], 'classType': 'java.lang.String'},
		{ 'name': 'locationAlias', 'value': item['locationAlias'], 'classType': 'java.lang.String'},
		{ 'name': 'cmFromLeft', 'value': item['cmFromLeft'], 'classType': 'java.lang.String'},
		{ 'name': 'quantity', 'value': "0", 'classType': 'java.lang.String'},
		{ 'name': 'uom', 'value': item['uom'], 'classType':  'java.lang.String'}
	];
	codeshelf.objectUpdater.callMethod(facility, 'Facility', 'upsertItem', methodArgs).then(function(response) {
		modalInstance.close();
	})
	.fail(function(response) {
		scope.$apply(function() {
			scope['response'] = response;
		});

	});
};

/**
 * @export
 */
codeshelfApp.ItemController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('ItemController', ['$scope', '$modalInstance', 'data', codeshelfApp.ItemController]);
