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

		'getViewName': function() {
			return 'LED Controllers';
		},
		
        'getViewMenu': function() {
            return [
                {"label": 'Export CSV', "action": function() {self.generateCSV();} }
                ,{"label": 'Add Controller', "action": function() {self.addController({});}, "permission": "ledcontroller:edit" }
            ];
        },
        
        addController:  function(){
            var data = {
                'ledcontroller': {},
                'facility':facility,
                'mode': "add"
            };

            // See codeshelfApp.LedNgController defined below. And then referenced in angular.module
            var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-ledcontroller.html", "LedNgController as controller", data);

            promise.result.then(function(){

            });
        },
        

		changeLedControllerId: function(item) {
			var ledcontroller = item;
			var data = {
				'ledcontroller': ledcontroller,
				'mode': "edit"
			};

			// See codeshelfApp.LedNgController defined below. And then referenced in angular.module
			var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-ledcontroller.html", "LedNgController as controller", data);

			promise.result.then(function(){

			});
		},
		
       	deleteController: function(item) {
       
        	codeshelf.simpleDlogService.showModalDialog("Confirm", "Delete the controller?", {})
               	.then(function() {
					var methodArgs = [item['persistentId']];
					websession_.callServiceMethod('UiUpdateService', 'deleteController', methodArgs);
               	});
       	},
       
		posConSetup: function(item) {
   			if (item["deviceType"] == "Poscons"){
				codeshelf.simpleDlogService.showModalDialog("Confirm", "Reset and assign position controllers?", {})
	            	.then(function() {
						websession_.callServiceMethod("UiUpdateService", 'posConSetup', [item['persistentId'], false]);
	               	});   			
   			} else {
   				alert("Can not set up position controllers on " + item["deviceType"] + " devices")
   			}
       	},
       	
       	posConShowAddresses: function(item) {
   			if (item["deviceType"] == "Poscons"){
				websession_.callServiceMethod("UiUpdateService", 'posConShowAddresses', [item['persistentId'], false]);
   			} else {
   				alert("Can not show position controller addresses on " + item["deviceType"] + " devices")
   			}
       	}
       
	};

	var contextDefs = [
		{
			"label": "Edit LED Controller",
			"permission": "ledcontroller:edit",
			"action": function(itemContext) {
				self.changeLedControllerId(itemContext);
			}
		},
		{
			"label": "Delete LED Controller",
			"permission": "ledcontroller:edit",
			"action": function(itemContext) {
				self.deleteController(itemContext);
			}
		},
        {
            "label": "PosCon Setup",
            "permission": "ledcontroller:edit",
            "action": self.posConSetup
        },
        {
            "label": "PosCon Show Addresses",
            "permission": "ux:view",
            "action": self.posConShowAddresses
        }
	];

	// ledController parent is codeshelf_network, whose parent is the facility
	var ledControllerFilter = 'ledControllersByFacility';

	var ledControllerFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
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
codeshelfApp.LedNgController = function($scope, $modalInstance, websession, data){

	this.scope_ = $scope;
	
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
	$scope['mode'] = data["mode"];
	$scope['facility'] = data['facility'];
	$scope['ledcontroller'] = data['ledcontroller'];
	$scope['ledcontroller']['led_controller_id'] = data['ledcontroller']['deviceGuidStr'];
	var deviceType = data['ledcontroller']['deviceType'];	
	$scope['ledcontroller']['deviceType'] = (deviceType == undefined) ? "Lights" : deviceType;
};

/**
 * @export
 */
codeshelfApp.LedNgController.prototype.edit = function(){
	var ledcontroller = this.scope_['ledcontroller'];
	var jsControllerProperty = "led_controller_id"; // this matches the partial html
	var javaControllerProperty = "deviceGuid"; // Passed as the java field

	// check not-null, and not empty. Does not check for only white space.
	function thisIsEmptyString(str) {
		return (!str || 0 === str.length);
	}

	var methodArgs = [
		{ 'name': 'inNewControllerId', 'value': ledcontroller[jsControllerProperty], 'classType': 'java.lang.String'},
		{ 'name': 'inNewDeviceType', 'value': ledcontroller['deviceType'], 'classType': 'java.lang.String'}
	];

	this.websession_.callMethod(ledcontroller, 'LedController', 'updateFromUI', methodArgs);

	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.LedNgController.prototype.add = function(){
	var ledcontroller = this.scope_['ledcontroller'];
	var jsControllerProperty = "led_controller_id"; // this matches the partial html
	var facilityPersistentId = this.scope_['facility']['persistentId'];
	var methodArgs = [facilityPersistentId, ledcontroller[jsControllerProperty], ledcontroller['deviceType']];
	this.websession_.callServiceMethod('UiUpdateService', 'addController', methodArgs);
	this.modalInstance_.close();
};


/**
 * @export
 */
codeshelfApp.LedNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('LedNgController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.LedNgController]);
