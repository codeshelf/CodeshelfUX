/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file ledControllersListView.js author jon ranstrom
 */
goog.provide('codeshelf.ledcontrollerslistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


/**
 * The aisle controllers for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The LED Controllers list view.
 */
codeshelf.ledcontrollerslistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

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
			// only fields in domainObjects for aisle will be asked for. We want to exclude persistent Id
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'deviceGuid')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'LED Controllers List View';
		},

		changeLedControllerId: function(item) {
			var ledcontroller = item;
			var data = {
				'ledcontroller': ledcontroller
			};

			var theLogger = goog.debug.Logger.getLogger('Led controller view');
			theLogger.info("change ID dialog for LED Controller: " + ledcontroller['domainId']);


			// See codeshelfApp.LedNgController defined below. And then referenced in angular.module
			var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-led-id.html", "LedNgController as controller", data);

			promise.result.then(function(){

			});
		}
	};

	var contextDefs = [
		{
			"label": "Change ID of LED Controller",
			"permission": "ledcontroller:edit",
			"action": function(itemContext) {
				self.changeLedControllerId(itemContext);
			}
		}
	];

	// ledController parent is codeshelf_network, whose parent is the facility
	// Luckily, ebeans can handle this form also.
	var ledControllerFilter = 'parent.parent.persistentId = :theId';

	var ledControllerFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['LedController']['className'], "linkProperty": 'parent', "filter" : ledControllerFilter, "filterParams" : ledControllerFilterParams, "properties": domainobjects['LedController']['properties'], "contextMenuDefs" : contextDefs };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['LedController'], hierarchyMap, viewOptions);
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
codeshelfApp.LedNgController = function($scope, $modalInstance, data){

	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['ledcontroller'] = data['ledcontroller'];

	$scope['ledcontroller']['led_controller_id'] = data['ledcontroller']['deviceGuidStr'];

};

/**
 * @export
 */
codeshelfApp.LedNgController.prototype.ok = function(){
	var ledcontroller = this.scope_['ledcontroller'];
	var jsControllerProperty = "led_controller_id"; // this matches the partial html
	var javaControllerProperty = "deviceGuid"; // Passed as the java field

	// check not-null, and not empty. Does not check for only white space.
	function thisIsEmptyString(str) {
		return (!str || 0 === str.length);
	}


	if (!thisIsEmptyString(ledcontroller[jsControllerProperty])) {
		var methodArgs = [
			{ 'name': 'inNewControllerId', 'value': ledcontroller[jsControllerProperty], 'classType': 'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(ledcontroller, 'LedController', 'changeLedControllerId', methodArgs);
	}

	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.LedNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('LedNgController', ['$scope', '$modalInstance', 'data', codeshelfApp.LedNgController]);
