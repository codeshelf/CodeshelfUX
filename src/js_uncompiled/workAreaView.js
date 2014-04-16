/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaView.js,v 1.6 2013/02/10 01:03:22 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');
goog.require('adhocDialogService');


/**
 * The work areas for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The work queue view.
 */
codeshelf.workareaview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;

	function testDialog(event) {
		if ($(event.target).data("option") == "testdialog") {

			// demonstration for using new customDialogService and partial html
			var adhocDialogOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'OK',
				passedInUrl: 'partials/test-dialog.html',
				callback: function () {
					var theLogger = goog.debug.Logger.getLogger('Codeshelf router');
					theLogger.info("Clicked the ok button");
				}
			}
			// would be nice if this worked
			//angular.module('codeshelfApp').service('adhocDialogService').showModalDialog({}, adhocDialogOptions);
			var injector = angular.injector(['ng', 'codeshelfApp']);

			injector.invoke(['adhocDialogService', function(adhocDialogService){
				adhocDialogService.showModalDialog({}, adhocDialogOptions);
			}]);

			// There was roll-your-own dialog before, as in ediServicesView.js
		}
	}


	var self = {

		getViewName: function() {
			return 'Work Areas';
		},

		setupContextMenu: function() {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function(event) {
				$(this).fadeOut(5)
			});
			contextMenu_.bind("click", testDialog);
		},

		doContextMenu: function(event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();

			var line, input;
			line = $('<li>Test Dialog</li>').appendTo(contextMenu_).data("option", "testdialog");

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}
	};

	var pathFilter = 'parent.persistentId = :theId';
	var pathFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Path']['className'], linkProperty: 'parent', filter : pathFilter, filterParams : pathFilterParams, properties: domainobjects['Path']['properties'] };
	hierarchyMap[1] = { className: domainobjects['WorkArea']['className'], linkProperty: 'parent', filter : undefined, filterParams : undefined, properties: domainobjects['WorkArea']['properties'] };
	hierarchyMap[2] = { className: domainobjects['WorkInstruction']['className'], linkProperty: 'parent', filter : undefined, filterParams : undefined, properties: domainobjects['WorkInstruction']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Path'], hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
