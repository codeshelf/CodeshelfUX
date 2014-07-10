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
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

checontextmenuscope = {
	'che': null
};

function clearCheContextMenuScope(){
	checontextmenuscope['che'] = null;
}

function editChe() {
	var che = checontextmenuscope['che'];
	var data = {
		'che': che
	};

	var theLogger = goog.debug.Logger.getLogger('CHE view');
	theLogger.info("about to call dialog for selected CHE: " + che['domainId']);


	// See codeshelfApp.CheController defined below. And then referenced in angular.module
	var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-che.html", "CheNgController as controller", data);

	promise.result.then(function(){
		clearCheContextMenuScope();

	});
}
goog.exportSymbol('editChe', editChe);

var websession_ = null;

function testOnlySetUpChe() {
	var che = checontextmenuscope['che'];
	if (che === null)
		return;

	cheDomainId = che['domainId'];
	var theLogger = goog.debug.Logger.getLogger('CHE view');
	theLogger.info("about do a fake setup cart for CHE: " + cheDomainId);

	var methodArgs = [
		{ 'name': 'inCheDomainId', 'value': cheDomainId, 'classType': 'java.lang.String'}
	];

	codeshelf.objectUpdater.callMethod(facility_, 'Facility', 'fakeSetUpChe', methodArgs);

	clearCheContextMenuScope();
}
goog.exportSymbol('testOnlySetUpChe', testOnlySetUpChe);

function cheWorkInstructions() {
	var che = checontextmenuscope['che'];
	if (che === null)
		return;
	if (che) {
		var wiListView = codeshelf.workinstructionlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che, null, null);
		var wiListWindow = codeshelf.window(wiListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
		wiListWindow.open();
	}
	clearCheContextMenuScope();
}
goog.exportSymbol('cheWorkInstructions', cheWorkInstructions);

function cheContainers() {
	var che = checontextmenuscope['che'];
	if (che === null)
		return;
	if (che) {
		var useListView = codeshelf.containeruselistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), che);
		var useListWindow = codeshelf.window(useListView, codeshelf.sessionGlobals.getDomNodeForNextWindow(), codeshelf.sessionGlobals.getWindowDragLimit());
		useListWindow.open();
	}
	clearCheContextMenuScope();
}
goog.exportSymbol('cheContainers', cheContainers);

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.cheslistview = function(websession, facility) {

	var websession_ = websession;
	facility_ = facility; // defined above so it available to testOnlySetUpChe

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
			else if (inProperty['id'] ===  'deviceGuidStr')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'CHE List View';
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
				checontextmenuscope['che'] = item;
				line = $('<li><a href="javascript:cheWorkInstructions()">Work Instructions</a></li>').appendTo(contextMenu_).data("option", "work_instructions");
				line = $('<li><a href="javascript:cheContainers()">Containers</a></li>').appendTo(contextMenu_).data("option", "containers");
				line = $('<li><a href="javascript:editChe()">Edit CHE</a></li>').appendTo(contextMenu_).data("option", "change_description");
				line = $('<li><a href="javascript:testOnlySetUpChe()">TESTING ONLY--Simulate cart set up</a></li>').appendTo(contextMenu_).data("option", "fake_setup");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		},

		openContextMenu: function(item) {

		}
	};
	// che parent is codeshelf_network, whose parent is the facility
	var cheFilter = 'parent.parent.persistentId = :theId';

	var cheFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Che']['className'], linkProperty: 'parent', filter : cheFilter, filterParams : cheFilterParams, properties: domainobjects['Che']['properties']	};

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Che'], hierarchyMap, -1);
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

// check not-null, and not empty. Does not check for only white space.
function isEmptyString(str) {
	return (!str || 0 === str.length);
}

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
