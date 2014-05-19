/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file aislesListView.js author jon ranstrom
 */
goog.provide('codeshelf.aisleslistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

aislecontextmenuscope = {
	'aisle': null
};

function clearAisleContextMenuScope(){
	aislecontextmenuscope['aisle'] = null;
}
function associatePathSegment() {
	var theLogger = goog.debug.Logger.getLogger('aisles view');
	var theAisle = aislecontextmenuscope['aisle'];
	if (theAisle) {
		var aisleString = theAisle['domainId'];
		var segString = "no segment selected";
		var aPathSegment = codeshelf.objectUpdater.getFirstObjectInSelectionList();
		// this this really a pathSegment? Not a great test.
		if (aPathSegment && aPathSegment.hasOwnProperty('segmentOrder'))
			segString = aPathSegment['persistentId'];
		else
			aPathSegment = null; // setting to null if it was a reference to something else

		if (aPathSegment) { // we think aisle must be good to get here from the popup menu item
			// we want java-side names for class and field name here.
			// This one may not work, as location as a pointer to pathSegment, and not a key value
			theLogger.info("associate aisle " + aisleString + " to segment " + segString);

			codeshelf.objectUpdater.updateOne(theAisle, 'Aisle', 'pathSegId', aPathSegment['persistentId']);
		}
	}
	else{
		theLogger.error("null aisle. How? ");

	}

	clearAisleContextMenuScope();
}
goog.exportSymbol('associatePathSegment', associatePathSegment); // Silly that this is needed even in same file.

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
		shouldAddThisColumn: function(inProperty){
			// only fields in domainObjects for aisle will be asked for. We want to exclude persistent Id
			if (inProperty['id'] ===  'persistentId')
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
				line = $('<li><a href="javascript:associatePathSegment()">Associate Path Segment</li>').appendTo(contextMenu_).data("option", "associate_");
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

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Aisle'], hierarchyMap, 0);
	jQuery.extend(view, self);
	self = view;

	return view;
};
