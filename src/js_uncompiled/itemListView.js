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

function doSomethingWithItem() {
	// What will we do?  Most likely, something like
	// 1) lights on for all slots where the item in the container is
	// 2) Maybe a list of all item/item details for items in this container
}

codeshelf.itemListViewForTier = function(websession, facility, tier) {
	// item parent goes itme->itemMaster>facility
	var	itemFilter = "parent.parent.persistentId = :theId and active = true and storedLocation.persistentId = :theLocationId";
	var itemFilterParams = [
			{ 'name': 'theId', 'value': facility['persistentId']},
			{ 'name': 'theLocationId', 'value': tier['persistentId']}
		];

	return codeshelf.buildItemListView(websession, itemFilter, itemFilterParams, "Inventory for tier: " + codeshelf.toLocationDescription(tier));
};

codeshelf.itemlistview = function(websession, facility) {
	// item parent goes itme->itemMaster>facility
	var	itemFilter = "parent.parent.persistentId = :theId and active = true";
	var itemFilterParams = [
			{ 'name': 'theId', 'value': facility['persistentId']}
		];
	return codeshelf.buildItemListView(websession, itemFilter, itemFilterParams, "Inventory");

};

/**
 * The active inventory items for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.buildItemListView = function(websession, itemFilter, itemFilterParams, viewName) {

	var websession_ = websession;
	var viewName_ = viewName;

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
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return viewName_;
		}
	};

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
