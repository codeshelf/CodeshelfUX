/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file cheListView.js author jon ranstrom
 */
goog.provide('codeshelf.chelistview');
goog.require('codeshelf.controllers');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
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

function changeCheDescription() {
	var che = checontextmenuscope['che'];
	var data = {
		'che': che
	};

	var theLogger = goog.debug.Logger.getLogger('CHE view');
	theLogger.info("about to call dialog for selected CHE: " + che['domainId']);



	var promise = codeshelf.simpleDlogService.showCustomDialog("partials/change-che.html", "CheController as controller", data);

	promise.result.then(function(){
		clearCheContextMenuScope();

	});
}
goog.exportSymbol('changeCheDescription', changeCheDescription);

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

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.cheslistview = function(websession, facility) {

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
			else if (inProperty['id'] ===  'deviceGuid')
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
				line = $('<li><a href="javascript:changeCheDescription()">Change Che Description</a></li>').appendTo(contextMenu_).data("option", "change_description");
				line = $('<li><a href="javascript:testOnlySetUpChe()">TESTING ONLY--Set up CHE</a></li>').appendTo(contextMenu_).data("option", "fake_setup");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};
	// che parent is codeshelf_network, whose parent is the facility
	var cheFilter = 'parent.parent.persistentId = :theId';

	var cheFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Che']['className'], linkProperty: 'parent', filter : cheFilter, filterParams : cheFilterParams, properties: domainobjects['Che']['properties'] };

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
codeshelfApp.CheController = function($scope, $modalInstance, data){

	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['che'] = data['che'];
};

/**
 * @export
 */
codeshelfApp.CheController.prototype.ok = function(){
	var che = this.scope_['che'];
	var property = "description";
	codeshelf.objectUpdater.updateOne(che, "Che", property, che[property]);
	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.CheController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('CheController', ['$scope', '$modalInstance', 'data', codeshelfApp.CheController]);
