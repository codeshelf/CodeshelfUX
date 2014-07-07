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
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

var tiercontextmenuscope = {
	'tier': null
};

function clearTierContextMenuScope(){
	tiercontextmenuscope['tier'] = null;
}

function setControllerForTier(inAllTiers) {
	var theLogger = goog.debug.Logger.getLogger('Tier view');
	var theTier = tiercontextmenuscope['tier'];
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
		clearTierContextMenuScope();

	});
}

function setControllerForTierOnly() {
	setControllerForTier(false);
}
goog.exportSymbol('setControllerForTierOnly', setControllerForTierOnly);

function setControllerForTiersInAisle() {
	setControllerForTier(true);
}
goog.exportSymbol('setControllerForTiersInAisle', setControllerForTiersInAisle);

function doLaunchTierSlotList() {
	aTier = tiercontextmenuscope['tier'];
	var tierSlotListView = codeshelf.tierslotlistview(codeshelf.sessionGlobals.getWebsession(),codeshelf.sessionGlobals.getFacility(), aTier);
	var tierSlotListWindow = codeshelf.window(tierSlotListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
	tierSlotListWindow.open();

	clearTierContextMenuScope();
}
goog.exportSymbol('doLaunchTierSlotList', doLaunchTierSlotList);

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

	var contextMenu_;

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
			else if (inProperty['id'] === 'domainId')
				return false;
			else if (inProperty['id'] === 'ledChannel')
				return false;
			else if (inProperty['id'] === 'pickFaceEndPosX')
				return false;
			else if (inProperty['id'] === 'pickFaceEndPosY')
				return false;
			else if (inProperty['id'] === 'anchorPosX')
				return false;
			else if (inProperty['id'] === 'anchorPosY')
				return false;
			else if (inProperty['id'] ===  'fullDomainId')
				return false;
			else
				return true;
		},

		getViewName: function () {
			return 'Tiers List';
		},

		setupContextMenu: function () {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function (event) {
				$(this).fadeOut(5)
			});
		},

		doContextMenu: function (event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();
			// contextMenu_.bind("click", item, handleAisleContext);

			var line;
			if (view.getItemLevel(item) === 0) {
				tiercontextmenuscope['tier'] = item;
				// This needs to be conditional. Does this session have permission to set controller?
				line = $('<li><a href="javascript:setControllerForTierOnly()">Set controller this tier only</a></li>').appendTo(contextMenu_).data("option", "tier_cntlr");
				line = $('<li><a href="javascript:setControllerForTiersInAisle()">Set controller for tiers this aisle</a></li>').appendTo(contextMenu_).data("option", "tier_cntlr");

				line = $('<li><a href="javascript:doLaunchTierSlotList()">Slots for this tier</a></li>').appendTo(contextMenu_).data("option", "slots_list");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};

	// If aisle is null, then all tiers for all aisle in this facility. If aisle passed in, then only tiers in this aisle.
	// tier parent goes bay->aisle>facility
	var tierFilter;
	var tierFilterParams;

	if (null === aisle_) {
		// tier parent goes bay->aisle>facility
		tierFilter = 'parent.parent.parent.persistentId = :theId';

		tierFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];
	}
	else {
		tierFilter = 'parent.parent.persistentId = :theId';

		tierFilterParams = [
			{ 'name': 'theId', 'value': aisle_['persistentId']}
		];
	}


	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Tier']['className'], linkProperty: 'parent', filter : tierFilter, filterParams : tierFilterParams, properties: domainobjects['Tier']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Tier'], hierarchyMap, -1);
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
codeshelfApp.TierController = function($scope, $modalInstance, data, ledcontrollers){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['tierAisleValue'] = data['tierAisleValue'];
	$scope['tier'] = data['tier'];

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

		var channelStr = tier['ledChannel'];
		var methodArgs = [
			{ 'name': 'inControllerPersistentIDStr', 'value': cntlrPersistId, 'classType': 'java.lang.String'},
			{ 'name': 'inChannelStr', 'value': channelStr, 'classType': 'java.lang.String'},
			{ 'name': 'inTiersStr', 'value': tierAisleValue, 'classType':  'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(tier, 'Tier', 'setControllerChannel', methodArgs);
		this.modalInstance_.close();
	}


};

/**
 * @export
 */
codeshelfApp.TierController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('TierController', ['$scope', '$modalInstance', 'data', 'ledcontrollers', codeshelfApp.TierController]);
