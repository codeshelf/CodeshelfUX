/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file pathsView.js author jon ranstrom
 */
goog.provide('codeshelf.pathsview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


/**
 * The paths for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The paths view.
 */
codeshelf.pathsview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {

			}
		};

		return callback;
	}

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function(inProperty){
			if (inProperty['id'] ===  'domainId')
				return true;
			else if (inProperty['id'] ===  'segmentOrder')
				return true;
			else if (inProperty['id'] ===  'associatedLocationCount')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return 'Paths';
		},

		sendPathDelete: function(item) {
			var theLogger = goog.debug.Logger.getLogger('Paths view');
			var aString = item['domainId'];
			theLogger.info("delete path2 " + aString);

			var thePath = item;
			var methodArgs = [
			];
			codeshelf.objectUpdater.callMethod(thePath, 'Path', 'deleteThisPath', methodArgs);
		}
	};

	var contextDefs = [
		{
			"label": "Delete Path",
			"permission": "path:edit",
			"action": function(itemContext) {
				self.sendPathDelete(itemContext);
			}
		}
	];


	var pathFilter = 'parent.persistentId = :theId';
	var pathFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Path']['className'], "linkProperty": 'parent', "filter" : pathFilter, "filterParams" : pathFilterParams, "properties": domainobjects['Path']['properties'], "contextMenuDefs" : contextDefs };
	hierarchyMap[1] = { "className": domainobjects['PathSegment']['className'], "linkProperty": 'parent', "filter" : undefined, "filterParams" : undefined, "properties": domainobjects['PathSegment']['properties'] };

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
