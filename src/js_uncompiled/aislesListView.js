/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file aislesListView.js author jon ranstrom
 */
goog.provide('codeshelf.aisleslistview');
goog.require('codeshelf.simpleDlogService');
goog.require('codeshelf.ledcontrollers.service');
goog.require('codeshelf.pathsegment.service');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');



var aislecontextmenuscope = {
	'aisle': null
};

function clearAisleContextMenuScope(){
	aislecontextmenuscope['aisle'] = null;
}

/**
 * Set LED Controller for an aisle
 */
function setControllerForAisle() {
	var theAisle = aislecontextmenuscope['aisle'];
	var data = {
		"aisle" : theAisle
	};
	var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/change-aisle-controller.html", "AisleLedController as controller", data);
	modalInstance.result.then(function(){
		clearAisleContextMenuScope();
	});
}
goog.exportSymbol('setControllerForAisle', setControllerForAisle); // Silly that this is needed even in same file.


function associatePathSegment() {
	var theAisle = aislecontextmenuscope['aisle'];
	if (theAisle) {
		var data = {
			"aisle" : theAisle
		};
		var modalInstance = codeshelf.simpleDlogService.showCustomDialog("partials/change-aisle-pathsegment.html", "AislePathSegmentsController as controller", data);
		modalInstance.result.then(function(){
			clearAisleContextMenuScope();
		});
	}
	else{
		theLogger.error("null aisle. How? ");

	}
}
goog.exportSymbol('associatePathSegment', associatePathSegment); // Silly that this is needed even in same file.

/**
 *
 */
function launchTiersForAisle() {
	var theLogger = goog.debug.Logger.getLogger('aisles view');
	var theAisle = aislecontextmenuscope['aisle'];
	if (theAisle) {
		var aisleString = theAisle['domainId'];
		var tierListView = codeshelf.tierlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), theAisle);
		var tierListWindow = codeshelf.window(tierListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
		tierListWindow.open();
	}
	else{
		theLogger.error("null aisle. How? ");
	}
	clearAisleContextMenuScope();
}
goog.exportSymbol('launchTiersForAisle', launchTiersForAisle); // needed even in same file.

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.aisleslistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;


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
			else if (inProperty['id'] ===  'fullDomainId')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'Aisles List View';
		},

		setupContextMenu: function() {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function(event) {
				$(this).fadeOut(5)
			});
		},

		doContextMenu: function(event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();
			// contextMenu_.bind("click", item, handleAisleContext);

			var line;
			if (view.getItemLevel(item) === 0) {
				aislecontextmenuscope['aisle'] = item;
				line = $('<li><a href="javascript:setControllerForAisle()">Set controller this aisle</a></li>').appendTo(contextMenu_).data("option", "tier_cntlr");
				line = $('<li><a href="javascript:associatePathSegment()">Associate Path Segment</li>').appendTo(contextMenu_).data("option", "associate_");
				line = $('<li><a href="javascript:launchTiersForAisle()">Tiers in this Aisle</li>').appendTo(contextMenu_).data("option", "launchtiers");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};

	var aisleFilter = 'parent.persistentId = :theId';
	var aisleFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Aisle']['className'], linkProperty: 'parent', filter : aisleFilter, filterParams : aisleFilterParams, properties: domainobjects['Aisle']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Aisle'], hierarchyMap, -1);
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
codeshelfApp.AislePathSegmentsController = function($scope, $modalInstance, data, pathsegmentservice){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['aisle'] = data['aisle'];

	pathsegmentservice.getPathSegments().then(function(pathSegments) {
		$scope['pathSegments'] = pathSegments;
	});
};

/**
 * @export
 */
codeshelfApp.AislePathSegmentsController.prototype.ok = function(){

	// we want java-side names for class and field name here.
	// This one may not work, as location as a pointer to pathSegment, and not a key value
	var aisle = this.scope_['aisle'];
	var aisleName = aisle['domainId'];
	var domainId = aisle['pathSegmentId'];

	var pathSegments = this.scope_['pathSegments'];
	var pathSegment = pathSegments.filter(function(c){
			return c['domainId'] == domainId;
		}).shift();
	if (pathSegment) {
		var pathSegmentPersistId = pathSegment['persistentId'];

		var methodArgs = [
			{ 'name': 'inPathSegmentPersistentIDStr', 'value': pathSegmentPersistId, 'classType': 'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(aisle, 'Aisle', 'associatePathSegment', methodArgs);
		this.modalInstance_.close();
	}
};

/**
 * @export
 */
codeshelfApp.AislePathSegmentsController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('AislePathSegmentsController', ['$scope', '$modalInstance', 'data', 'pathsegmentservice', codeshelfApp.AislePathSegmentsController]);



/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.AisleLedController = function($scope, $modalInstance, data, ledcontrollers){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['aisle'] = data['aisle'];

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
codeshelfApp.AisleLedController.prototype.ok = function(){

	// we want java-side names for class and field name here.
	// This one may not work, as location as a pointer to pathSegment, and not a key value
	var aisle = this.scope_['aisle'];
	var aisleName = aisle['domainId'];
	var controllerDomainId = aisle['ledControllerId'];

	var controllers = this.scope_['ledControllers'];
	var controller = controllers.filter(function(c){
			return c['domainId'] == controllerDomainId;
		}).shift();
	if (controller) {
		var cntlrPersistId = controller['persistentId'];

		var channelStr = aisle['ledChannel'];
		var methodArgs = [
			{ 'name': 'inControllerPersistentIDStr', 'value': cntlrPersistId, 'classType': 'java.lang.String'},
			{ 'name': 'inChannelStr', 'value': channelStr, 'classType': 'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(aisle, 'Aisle', 'setControllerChannel', methodArgs);
		this.modalInstance_.close();
	}
};

/**
 * @export
 */
codeshelfApp.AisleLedController.prototype.cancel = function(){
	this.modalInstance_['dismiss']();
};
angular.module('codeshelfApp').controller('AisleLedController', ['$scope', '$modalInstance', 'data', 'ledcontrollers', codeshelfApp.AisleLedController]);
