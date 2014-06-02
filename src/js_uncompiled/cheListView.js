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
	var promise;
	var adhocDialogOptions = {}

	var theLogger = goog.debug.Logger.getLogger('CHE view');
	var aString = checontextmenuscope['che']['domainId'];
	theLogger.info("about to call dialog for selected CHE: " + aString);



	adhocDialogOptions['passedInUrl']= "partials/change-led-id.html";
	adhocDialogOptions['callback']= function () {
		var theLogger = goog.debug.Logger.getLogger('CHE view');
		var aString = checontextmenuscope['che']['domainId'];
		theLogger.info("change description for selected CHE: " + aString);
		// Paul: This is never called.
	}

	// would be nice if this worked
	//angular.module('codeshelfApp').service('adhocDialogService')['showModalDialog']({}, adhocDialogOptions);
	var injector = angular.injector(['ng', 'codeshelfApp']);

	injector.invoke(['adhocDialogService', function(adhocDialogService){
		promise = adhocDialogService['showModalDialog']({}, adhocDialogOptions);
	}]);

	if (promise != null) {
		promise.then(function onOk() {
			var theLogger = goog.debug.Logger.getLogger('CHE view');
			theLogger.info("ok clicked for change CHE description");
			// Paul: This is never called.
			// We need to get the input field contents. Perhaps we needed to bind it to a local/global

			// If we have th input contents, then we want to update the CHE description field. (Why bother?)
			// This should be simplest kind of update possible, with native field and no meta-field complexity.

		});
	}

	// Paul: as expected, this is called immediately as the dialog goes up. So, if we need the che, that would have
	// to be passed into scope somehow. clearCheContextMenuScope() is called.

	// Temporary test code. We cannot get the value from the dialog input. But we can hard code a silly thing.
	// That will test the backend for the simplest update. Since we are updating "description" field, we would like
	// the code to call setDescription();
	codeshelf.objectUpdater.updateOne(checontextmenuscope['che'], "Che", "description", "example description", "java.lang.String");

	clearCheContextMenuScope();
}
goog.exportSymbol('changeCheDescription', changeCheDescription);

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
