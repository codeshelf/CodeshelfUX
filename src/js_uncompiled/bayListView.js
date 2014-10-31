/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file bayListView.js author jon ranstrom
 */
goog.provide('codeshelf.baylistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The bays for this facility. Or a the bays for one aisle later
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.baylistview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;
	var logger_  = goog.debug.Logger.getLogger("BayList View");

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
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'baySortName')
				return true;
			else if (inProperty['id'] ===  'posAlongPathui')
				return true;
			else if (inProperty['id'] ===  'nominalLocationId')
				return true;
			else
				return false;
		},

		getViewName: function() {
			return 'Bays List';
		}
	};


	var actions = [{
		"id" : "lightLocation",
		"title": "Light Location",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-download-alt"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightLocation', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent lightChildLocations for location:  " + item["domainId"]);
			});
		}}
		,{
		"id" : "lightItems",
		"title": "Light Items",
		"width" : 10,
		"iconClass" : ["glyphicon-flash", "glyphicon-barcode"],
		"handler" : function(event, args, item) {
			websession_.callServiceMethod("LightService", 'lightInventory', [facility_["persistentId"],
																				  item["nominalLocationId"]]
			).then(function(response) {
				logger_.info("Sent lightInventory for location:  " + item["domainId"]);
			});
		}}
	];

	// tier parent goes bay->aisle>facility
	var bayFilter = 'parent.parent.persistentId = :theId and active = true';

	var bayFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['Bay']['className'], "linkProperty": 'parent', "filter" : bayFilter, "filterParams" : bayFilterParams, "properties": domainobjects['Bay']['properties'], "actions": actions };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Bay'], hierarchyMap, viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};
