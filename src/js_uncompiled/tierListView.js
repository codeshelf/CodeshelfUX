/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file tierListView.js author jon ranstrom
 */
goog.provide('codeshelf.tierlistview');
goog.require('codeshelf.simpleDlogService');
goog.require('codeshelf.ledcontrollers.service');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.tierslotlistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The tiers for this facility or tiers for one aisle.
 *If aisle is null, then all tiers for all aisle in this facility. If aisle passed in, then only tiers in this aisle.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @param aisle May be null.
 * @return {Object} The tiers list view.
 */
codeshelf.tierlistview = function(websession, facility, aisle) {

	var websession_ = websession;
	var facility_ = facility;
	var aisle_ = aisle;
	var logger_  = goog.debug.Logger.getLogger("Tier List View");

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function (command) {
				/* appears to never be called
				 var theLogger = goog.debug.Logger.getLogger('aislesListView');
				 theLogger.info("callback exec called"); */
			}
		};

		return callback;
	}

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function (inProperty) {
			if (inProperty['id'] === 'persistentId')
				return false;
			else if (inProperty['id'] === 'tierSortName')
				return true;
			else if (inProperty['id'] === 'baySortName')
				return true;
			else if (inProperty['id'] === 'firstLedNumAlongPath')
				return true;
			else if (inProperty['id'] === 'lastLedNumAlongPath')
				return true;
			else if (inProperty['id'] === 'slotAliasRange')
				return true;
			else if (inProperty['id'] === 'posAlongPathui')
				return true;
			else
				return false;
		},

		'getViewName': function () {
			var viewName = 'Tiers List';
			if (aisle_) {
				viewName = 'Tiers for Aisle: ' + codeshelf.toLocationDescription(aisle_);
			}
			return viewName;
		},

		'getViewTypeName': function () {
			var viewName = 'Tiers List';
			return viewName;
		},

		setControllerForTier: function(item, inAllTiers) {
			var theLogger = goog.debug.Logger.getLogger('Tier view');
			var theTier = item;
			if (theTier === null){
				theLogger.info("null tier in context menu choice"); //why? saw this.
			}
			var tierName = theTier['domainId'];
			theLogger.info("setting controller for selected Tier: " + tierName);

			var tierAisleValue = "";
			if (inAllTiers === true){
				tierAisleValue = "aisle";
			}

			var data = {
				"tier" : theTier,
				"tierAisleValue" : tierAisleValue
			};
			var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/change-tier.html", "TierController as controller", data);
			modalInstance.result.then(function(){

			});
		},

		setPosconsForTier: function(tier, inAllTiers) {
			var theLogger = goog.debug.Logger.getLogger('Tier view');
			var theTier = tier;
			if (theTier === null){
				theLogger.info("null tier in context menu choice"); //why? saw this.
			}
			var tierName = theTier['domainId'];
			theLogger.info("setting controller for selected Tier: " + tierName);

			var tierAisleValue = "";
			if (inAllTiers === true){
				tierAisleValue = "aisle";
			}

			var data = {
				"tier" : theTier,
				"poscon": {"startIndex" : 1,
				           "reverse" : false}
			};
			var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/set-poscons-tier.html", "TierController as controller", data);
			modalInstance.result.then(function(){

			});
		},

		setControllerForTierOnly: function(item) {
			self.setControllerForTier(item, false);
		},

		setControllerForTiersInAisle: function(item) {
			self.setControllerForTier(item, true);
		}
	};

	// If aisle is null, then all tiers for all aisle in this facility. If aisle passed in, then only tiers in this aisle.
	// tier parent goes bay->aisle>facility
	var tierFilter;
	var tierFilterParams;

	if (null === aisle_) {
		// tier parent goes bay->aisle>facility
		tierFilter = 'tiersByFacility';

		tierFilterParams = [
			{ 'name': 'facilityId', 'value': facility_['persistentId']}
		];
	}
	else {
		tierFilter = 'tiersByAisle';

		tierFilterParams = [
			{ 'name': 'aisleId', 'value': aisle_['persistentId']}
		];
	}

	var contextDefs = [
		{
			"label" : "Set controller this tier only",
			"permission": "tier:edit",
			"action": function(itemContext) {
				self.setControllerForTierOnly(itemContext);
			}
		},
		{
			"label" : "Set controller for tiers this aisle",
			"permission": "tier:edit",
			"action": function(itemContext) {
				self.setControllerForTiersInAisle(itemContext);
			}
		},
		{
			"label" : "Slots For Tier",
			"permission": "slot:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadTierSlotListView(itemContext);
			}
		},
		{
			"label" : "Set Poscons",
			"permission": "slot:edit",
			"action": function(itemContext) {
				self.setPosconsForTier(itemContext);
			}
		},
		{
			"label" : "Item Locations For Tier",
			"permission": "inventory:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadItemsListView(itemContext);
			}
		}

	];

	var actions = [{
		"id" : "lightLocation",
		"title": "Light Location",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-download-alt"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightBehavior", 'lightLocation', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent light for location:  " + item["domainId"]);
			});
		}}
		,{
		"id" : "lightItems",
		"title": "Light Items",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-barcode"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightBehavior", 'lightInventory', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent lightInventory for location:  " + item["domainId"]);
			});
		}}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Tier']['className'], "linkProperty": 'parent', "filter" : tierFilter, "filterParams" : tierFilterParams, "properties": domainobjects['Tier']['properties'], "contextMenuDefs" : contextDefs, "actions": actions };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Tier'], hierarchyMap, viewOptions);
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
codeshelfApp.TierController = function($scope, $modalInstance, websession, data, ledcontrollers){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
	$scope['tierAisleValue'] = data['tierAisleValue'];
	$scope['tier'] = data['tier'];
	$scope['poscon'] = data['poscon'];

	var channelRange = [];
	for (var i = 1; i <= 8; i++) {
		channelRange.push(i);
	}

	ledcontrollers.getLedControllers().then(function(ledControllers) {
		$scope['ledControllers'] = ledControllers;
		$scope['channelRange'] = channelRange;
	});
};

/**
 * @export
 */
codeshelfApp.TierController.prototype.ok = function(){

	// we want java-side names for class and field name here.
	// This one may not work, as location as a pointer to pathSegment, and not a key value
	var tier = this.scope_['tier'];
	var tierName = tier['domainId'];
	var tierAisleValue = this.scope_["tierAisleValue"];
	var controllerDomainId = tier['ledControllerId'];

	var controllers = this.scope_['ledControllers'];
	var controller = controllers.filter(function(c){
			return c['domainId'] == controllerDomainId;
		}).shift();

	if (controller) {
		var cntlrPersistId = controller['persistentId'];

		var channelStr = String(tier ['ledChannel']);
		var methodArgs = [
			{ 'name': 'inControllerPersistentIDStr', 'value': cntlrPersistId, 'classType': 'java.lang.String'},
			{ 'name': 'inChannelStr', 'value': channelStr, 'classType': 'java.lang.String'},
			{ 'name': 'inTiersStr', 'value': tierAisleValue, 'classType':  'java.lang.String'}
		];

		this.websession_.callMethod(tier, 'Tier', 'setControllerChannel', methodArgs);
		this.modalInstance_.close();
	}
};

/**
 * @export
 */
codeshelfApp.TierController.prototype.setPoscons = function(){

	var tier = this.scope_['tier'];
	var tierName = tier['domainId'];
	var startIndex = this.scope_['poscon']['startIndex'];
	var reverse = this.scope_['poscon']['reverse'];

	var methodArgs = [
		{ 'name': 'startIndex', 'value': startIndex, 'classType': 'int'},
		{ 'name': 'reverse', 'value': reverse, 'classType': 'boolean'}
	];

	this.websession_.callMethod(tier, 'Tier', 'setPoscons', methodArgs);
	this.modalInstance_.close();

};

/**
 * @export
 */
codeshelfApp.TierController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('TierController', ['$scope', '$modalInstance', 'websession', 'data', 'ledcontrollers', codeshelfApp.TierController]);
