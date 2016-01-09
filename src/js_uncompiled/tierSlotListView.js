/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file tierSlotListView.js author jon ranstrom
 */
goog.provide('codeshelf.tierslotlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.tierslotlistview = function(websession, facility, inTier) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor
	var tier_ = inTier;
	var logger_  = goog.debug.Logger.getLogger("Tier Slot List View");

	var self = {
		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'firstLedNumAlongPath')
				return true;
			else if (inProperty['id'] ===  'lastLedNumAlongPath')
				return true;
			else if (inProperty['id'] ===  'primaryAliasId')
				return true;
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else if (inProperty['id'] ===  'nominalLocationId')
				return true;
			else if (inProperty['id'] ===  'posconIndex')
				return true;
			else
				return false;
		},

		'getViewName': function() {
			if (tier_ == null)
				return 'All Slots';
			else
				return 'Slots in Tier ' + codeshelf.toLocationDescription(inTier);
		},

		'getViewTypeName': function() {
			return 'Slots List';
		},
		
		adjustSlotLeds: function(slot) {
            var data = {
                'slot': slot
            };

            logger_.info("about to call dialog to edit Slot LEDs: " + slot['domainId']);


            // See codeshelfApp.SlotLEDController defined below. And then referenced in angular.module
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-slot-leds.html", "SlotLEDController as controller", data);
		}
	};

	var contextDefs = [
		{
			"label" : "Item Locations For Slot",
			"permission": "inventory:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadItemsListView(itemContext);
			}
		},
		{
			"label" : "Adjust Slot LEDs",
			"permission": "slot:edit",
			"action": function(itemContext) {
				self.adjustSlotLeds(itemContext);
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

	// tier parent goes bay->aisle>facility
	var tierSlotFilter = 'allActiveByParent';
	if (tier_ === null)
		tierSlotFilter = 'slotsByFacility';

	var tierSlotFilterParams = [];
	if (tier_ !== null)
		tierSlotFilterParams = [
			{ 'name': 'parentId', 'value': tier_['persistentId']}
		];
	else
		tierSlotFilterParams = [
			{ 'name': 'facilityId', 'value': facility_['persistentId']}
		];


	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Slot']['className'], "linkProperty": 'parent', "filter" : tierSlotFilter, "filterParams" : tierSlotFilterParams, "properties": domainobjects['Slot']['properties'], "contextMenuDefs": contextDefs, "actions" : actions };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Slot'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};

codeshelfApp.SlotLEDController = function($scope, $modalInstance, websession, data){
	this.scope_ = $scope;
    this.modalInstance_ = $modalInstance;
    this.websession_ = websession;
    $scope['slot'] = data['slot']
    $scope['slot']['firstLed'] = data['slot']['firstLedNumAlongPath'];
    $scope['slot']['lastLed'] = data['slot']['lastLedNumAlongPath'];    
};


/**
 * @export
 */
codeshelfApp.SlotLEDController.prototype.ok = function(){
    var slot = this.scope_['slot'];
	var methodArgs = [
		{ 'name': 'firstLed', 'value': slot['firstLed'] + "", 'classType': 'java.lang.String'},
		{ 'name': 'lastLed',  'value': slot['lastLed'] + "",  'classType': 'java.lang.String'}
	];
    var self = this;
    this.websession_.callMethod(slot, 'Slot', 'setSlotLeds', methodArgs)
        .then(function(response) {
            self.close();
        }, function(error) {
            self.scope_['slotLedForm'] = {"messages":[error["statusMessage"]]};
            self.scope_.$apply();
            console.error(error);
        });
};

codeshelfApp.SlotLEDController.prototype.close = function(){
	this.modalInstance_.close();
}

angular.module('codeshelfApp').controller('SlotLEDController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.SlotLEDController]);