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

	/* not called, but this dialog is the better example of link dialog */
	function testDialog(event) {
		if ($(event.target).data("option") == "test_dialog") {

			// demonstration for using new customDialogService and partial html
			var adhocDialogOptions = {}
				adhocDialogOptions['cancelButtonText']= "Cancel";
				adhocDialogOptions['actionButtonText']= "OK";
				adhocDialogOptions['passedInUrl']= "partials/test-dialog.html";
				/* no callback this dialog
				adhocDialogOptions['callback']= function () {
					var theLogger = goog.debug.Logger.getLogger('test adhoc dialog');
					theLogger.info("Clicked the ok button");
				}
				*/

			// would be nice if this worked
			//angular.module('codeshelfApp').service('adhocDialogService')['showModalDialog']({}, adhocDialogOptions);
			var injector = angular.injector(['ng', 'codeshelfApp']);

			injector.invoke(['adhocDialogService', function(adhocDialogService){
				adhocDialogService['showModalDialog']({}, adhocDialogOptions);
			}]);

		}
	}


	var self = {

		getViewName: function() {
			return 'Work Areas';
		}
	};

	var pathFilter = 'parent.persistentId = :theId';
	var pathFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Path']['className'], "linkProperty": 'parent', "filter" : pathFilter, "filterParams" : pathFilterParams, "properties": domainobjects['Path']['properties'] };
	hierarchyMap[1] = { "className": domainobjects['WorkArea']['className'], "linkProperty": 'parent', "filter" : undefined, "filterParams" : undefined, "properties": domainobjects['WorkArea']['properties'] };
	hierarchyMap[2] = { "className": domainobjects['WorkInstruction']['className'], "linkProperty": 'parent', "filter" : undefined, "filterParams" : undefined, "properties": domainobjects['WorkInstruction']['properties'] };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': 0
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Path'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
