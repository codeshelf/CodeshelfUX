/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file bayListView.js author jon ranstrom
 */
goog.provide('codeshelf.baylistview');
goog.require('codeshelf.simpleDlogService');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The bays for this facility. Or a the bays for one aisle later
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.baylistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;
	var logger_  = goog.debug.Logger.getLogger("BayList View");

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
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'baySortName')
				return true;
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else if (inProperty['id'] ===  'nominalLocationId')
				return true;
			else
				return false;
		},

		'getViewName': function() {
			return 'Bays List';
		},


		setPosconForBay: function(item) {
			var theLogger = goog.debug.Logger.getLogger('Bay view');
			var theBay = item;
			if (theBay === null){
				theLogger.info("null bay in context menu choice"); //why?
			}
			var bayName = theBay['domainId'];
			theLogger.info("setting controller for selected bay: " + bayName);

			var bayPosconIndex = theBay.posconIndex;

			var data = {
				"bay" : theBay,
				"poscon": {"index" : bayPosconIndex}
			};
			var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/set-poscons-bay.html", "BayController as controller", data);
			modalInstance.result.then(function(){

			});
		}
	};

	var contextDefs = [
		{
			"label" : "Item Locations For Bay",
			"permission": "inventory:view",
			"action": function(itemContext) {
				codeshelf.windowLauncher.loadItemsListView(itemContext);
			}
		},
		{
			"label" : "Assign Single Poscon for Bay",
			"permission": "bay:edit",
			"action": function(itemContext) {
				self.setPosconForBay(itemContext);
			}
		}


	];

	var actions = [{
		"id" : "lightLocation",
		"title": "Light Location",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-download-alt"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightLocation', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent lightChildLocations for location:  " + item["domainId"]);
			});
		}}
		,{
		"id" : "lightItems",
		"title": "Light Items",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-barcode"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightInventory', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent lightInventory for location:  " + item["domainId"]);
			});
		}}
	];

	// tier parent goes bay->aisle>facility
	var bayFilter = 'baysByFacility';

	var bayFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Bay']['className'], "linkProperty": 'parent', "filter" : bayFilter, "filterParams" : bayFilterParams, "properties": domainobjects['Bay']['properties'], "contextMenuDefs" : contextDefs, "actions": actions };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Bay'], hierarchyMap, viewOptions);
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
codeshelfApp.BayController = function($scope, $modalInstance, websession, data, ledcontrollers){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
	$scope['bay'] = data['bay'];
	$scope['poscon'] = data['poscon'];

	ledcontrollers.getLedControllers().then(function(ledControllers) {
		$scope['ledControllers'] = ledControllers;
	});
};


/**
 * @export
 */
codeshelfApp.BayController.prototype.ok = function(){

	var bay = this.scope_['bay'];
	var bayName = bay['domainId'];
	var indexStr = this.scope_['poscon']['index'];
	var controllerDomainId = bay['ledControllerId'];

	var controllers = this.scope_['ledControllers'];
	var controller = controllers.filter(function(c){
		return c['domainId'] == controllerDomainId;
	}).shift();

	if (controller) {
		var cntlrPersistId = controller['persistentId'];


		var methodArgs = [
			{'name': 'inControllerPersistentIDStr', 'value': cntlrPersistId, 'classType': 'java.lang.String'},
			{'name': 'inIndexStr', 'value': indexStr, 'classType': 'java.lang.String'}
		];

		this.websession_.callMethod(bay, 'Bay', 'setPosconAssignment', methodArgs);
		this.modalInstance_.close();
	}
};

/**
 * @export
 */
codeshelfApp.BayController.prototype.resetBayPoscon = function(){

	var bay = this.scope_['bay'];
	var bayName = bay['domainId'];

	var methodArgs = [
	];

	this.websession_.callMethod(bay, 'Bay', 'clearPosconAssignment', methodArgs);
	this.modalInstance_.close();
};


/**
 * @export
 */
codeshelfApp.BayController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('BayController', ['$scope', '$modalInstance', 'websession', 'data', 'ledcontrollers', codeshelfApp.BayController]);
