/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *  configurationview.js  author jon ranstrom
 *******************************************************************************/

goog.provide('codeshelf.domainobjectpropertiesview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');
goog.require('adhocDialogService');

/**
 * The current orders for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The orders view.
 */
codeshelf.domainobjectpropertiesview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function (type,command) {
				if (type == kWebSessionCommandType.OBJECT_METHOD_RESP) {
					var url = command['results'];
					window.open(url, '_blank');
					window.focus();
				}
			}
		};

		return callback;
	}

	var self = {

		// view of "DomainObjectProperty", flattened to include fields from DomainObjectDefaultProperty
		'getViewName': function () {
				return 'Configuration Parameters';
		},

		// New objectPropererties mechanism. This is not a generic mechanism.
		// Somewhat goofy, but this returns the string form of the facility persistentId.
		'doObjectProperitiesRequest': function () {
			return facility_['persistentId'];
		},


		openConfigurationEditDialog:  function(domainobjectproperty){
			var data = {
				'domainobjectproperty': domainobjectproperty
			};

			// See codeshelfApp.ConfigNgController defined below. And then referenced in angular.module
			var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-config.html", "ConfigNgController as controller", data);

			promise.result.then(function(){

			});
		},

		// following psuedo-inheritance pattern
		'shouldAddThisColumn': function (inProperty) {
			// exclude these fields. (Includ qty, UOM, container ID, order ID, SKU, Description.
			// A combination of fields from each of 3 levels.
			if (inProperty['id'] === 'persistentId')
				return false;
			else
				return true;
		}
	};


	var configurationContextDefs = [
	];

	configurationContextDefs.push(
		{
			"label" : "Edit Configuration",
			"permission": "configuration:edit",
			"action": function(domainobjectproperty) {
				codeshelf.openConfigurationEditDialog(domainobjectproperty['description'], domainobjectproperty['name'], domainobjectproperty['value']);
			}
		}
	);

	var configurationFilter = "configurationByFacility";
	var configurationFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
	];

	var configurationHierarchyMapDef = { "className": domainobjects['DomainObjectProperty']['className'], "linkProperty": 'parent', "filter": configurationFilter, "filterParams": configurationFilterParams, "properties": domainobjects['DomainObjectProperty']['properties'], "comparer": undefined , "contextMenuDefs": configurationContextDefs};

	var hierarchyMap = [];
	var view = null;


	hierarchyMap[0] = configurationHierarchyMapDef;
	var viewOptions = {
		'editable':  false,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	view = codeshelf.hierarchylistview(websession_, domainobjects['DomainObjectProperty'], hierarchyMap, viewOptions);


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
codeshelfApp.ConfigNgController = function($scope, $modalInstance, websession, data){

	// tweaking separate fields
	// first has html/angular scope matching js field.
	$scope['domainobjectproperty']['description'] = data['domainobjectproperty']['description'];
	$scope['domainobjectproperty']['name'] = data['domainobjectproperty']['name'];
	$scope['domainobjectproperty']['value'] = data['domainobjectproperty']['value'];


};

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.ConfigNgController = function($scope, $modalInstance, websession, data){
	goog.object.extend($scope, data);
	this.scope_ = $scope;
	this.scope_['response'] = {};
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
};

/**
 * @export
 */
codeshelfApp.ConfigNgController.prototype.ok = function(){
	var scope = this.scope_;
	var modalInstance = this.modalInstance_;
	var domainobjectproperty = scope['domainobjectproperty'];
	var facility = this.scope_['facility'];

	this.websession_.callServiceMethod("PropertyService", 'changePropertyValue', domainobjectproperty['name'], domainobjectproperty['value']).then(function(response) {
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
codeshelfApp.ConfigNgController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};

angular.module('codeshelfApp').controller('ConfigNgController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.ConfigNgController]);

