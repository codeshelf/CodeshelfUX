/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file cheListView.js author jon ranstrom
 */
goog.provide('codeshelf.chelistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.contextmenu');
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
codeshelf.cheslistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility; // defined above so it available to testOnlySetUpChe

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
			if (inProperty['id'] ===  'domainId')
				return true;
			else if (inProperty['id'] ===  'activeContainers')
				return true;
			else if (inProperty['id'] ===  'description')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return 'CHE List View';
		},

		editChe:  function(che){
			var data = {
				'che': che
			};

			var theLogger = goog.debug.Logger.getLogger('CHE view');
			theLogger.info("about to call dialog for selected CHE: " + che['domainId']);


			// See codeshelfApp.CheController defined below. And then referenced in angular.module
			var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-che.html", "CheNgController as controller", data);

			promise.result.then(function(){

			});
		},
		cheContainers: function(che) {
			if (che === null)
				return;
			if (che) {
				var useListView = codeshelf.containeruselistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che);
				var useListWindow = codeshelf.window(useListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				useListWindow.open();
			}
		},
		cheWorkInstructions: function(che) {
			if (che === null)
				return;
			if (che) {
				var wiListView = codeshelf.workinstructionlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che, "", null);
				var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
				wiListWindow.open();
			}
		},
		testOnlySetUpChe: function(che) {
			if (che === null)
				return;

			var data = {
				'che': che
			};

			var cheDomainId = che['domainId'];
			var theLogger = goog.debug.Logger.getLogger('CHE view');
			theLogger.info("about do a fake GoodEggs setup for CHE: " + cheDomainId);

			// See codeshelfApp.CheController defined below. And then referenced in angular.module
			var promise = codeshelf.simpleDlogService.showCustomDialog("partials/setup-che.html", "SetupCheNgController as controller", data);

			promise.result.then(function(){
			});
		}

	};

	var contextDefs = [
		{
			"label": "Work Instructions",
			"permission": "workinstructions:view",
			"action": function(itemContext) {
				self.cheWorkInstructions(itemContext);
			}
		},
		{
			"label": "Containers",
			"permission": "containers:view",
			"action": function(itemContext) {
				self.cheContainers(itemContext);
			}
		},
		{
			"label": "Edit CHE",
			"permission": "che:edit",
			"action": function(itemContext) {
				self.editChe(itemContext);
			}
		},
		{
			"label": "TESTING ONLY--Simulate cart set up",
			"permission": "che:simulate",
			"action": function(itemContext) {
				self.testOnlySetUpChe(itemContext);
			}
		}

	];

	// che parent is codeshelf_network, whose parent is the facility
	var cheFilter = 'parent.parent.persistentId = :theId';

	var cheFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Che']['className'],
						"linkProperty": 'parent',
						"filter" : cheFilter,
						"filterParams" : cheFilterParams,
						"properties": domainobjects['Che']['properties'],
						"contextMenuDefs": contextDefs};

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};

	var view = codeshelf.hierarchylistview(websession_, domainobjects['Che'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;
	return view;
};

// check not-null, and not empty. Does not check for only white space.
function isEmptyString(str) {
	return (!str || 0 === str.length);
}

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.CheNgController = function($scope, $modalInstance, data){

	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['che'] = data['che'];

	// tweaking separate fields
	// first has html/angular scope matching js field.
	$scope['che']['description'] = data['che']['description'];
	// second could match. Just being different to practice for when we have to be different
	$scope['che']['domainid'] = data['che']['domainId'];
	$scope['che']['cntrlrid'] = data['che']['deviceGuidStr'];

};


/**
 * @export
 */
codeshelfApp.CheNgController.prototype.ok = function(){
	var che = this.scope_['che'];
	var descriptionProperty = "description";
	var jsDomainProperty = "domainid"; // this matches the partial html
	var javaDomainProperty = "domainId"; // Passed as the java field
	var jsControllerProperty = "cntrlrid"; // this matches the partial html
	var javaControllerProperty = "deviceGuid"; // Passed as the java field
	// "description is the name used here, and matches the java-side field name. This is a trivial update
	if (!isEmptyString(che[descriptionProperty]))
		codeshelf.objectUpdater.updateOne(che, "Che", descriptionProperty, che[descriptionProperty]);

	// This is a domainID change, which may cause trouble. If there is trouble, might need to change to
	// objectUpdater.callMethod() to do the change with all necessary cleanup
	if (!isEmptyString(che[jsDomainProperty]))
		codeshelf.objectUpdater.updateOne(che, "Che", javaDomainProperty, che[jsDomainProperty]);

	if (!isEmptyString(che[jsControllerProperty])) {
		var methodArgs = [
			{ 'name': 'inNewControllerId', 'value': che[jsControllerProperty], 'classType': 'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(che, 'Che', 'changeControllerId', methodArgs);
	}

	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.CheNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('CheNgController', ['$scope', '$modalInstance', 'data', codeshelfApp.CheNgController]);


//**************** Different dialog for simulating cart setup *****************

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.SetupCheNgController = function($scope, $modalInstance, data){

	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['che'] = data['che'];

	$scope['che']['containersOnChe'] = data['che']['containersOnChe'];
};


/**
 * @export
 */
codeshelfApp.SetupCheNgController.prototype.ok = function(){
	var che = this.scope_['che'];
	var containersProperty = "containersOnChe";

	if (!isEmptyString(che[containersProperty])) {
		var methodArgs = [
			{ 'name': 'inContainerIds', 'value': che[containersProperty], 'classType': 'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(che, 'Che', 'fakeSetupUpContainersOnChe', methodArgs);
	}

	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.SetupCheNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('SetupCheNgController', ['$scope', '$modalInstance', 'data', codeshelfApp.SetupCheNgController]);
