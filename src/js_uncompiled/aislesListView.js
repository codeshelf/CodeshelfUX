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
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

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

			}
		};

		return callback;
	}

	function getThisFacility(){
		var theFacility = facility_;
		return theFacility;
	}

	function editAisle(inAisle, inFacility) {
			var theLogger = goog.debug.Logger.getLogger('Aisles List View');
			var aString = inAisle['domainId'];
			theLogger.info("just logging: edit aisle " + aString);
	}

	function deleteAisle(inAisle, inFacility) {
		var theLogger = goog.debug.Logger.getLogger('Aisles List View');
		var aString = inAisle['domainId'];
		theLogger.info("just logging: delete aisle " + aString);
	}


	function handleAisleContext(event) {
		var thisFacility = getThisFacility();
		if ($(event.target).data("option") == "edit_aisle") {
			var theAisle = event['data'];
			editAisle(theAisle, thisFacility);

		} else if ($(event.target).data("option") == "delete_aisle") {
			var theAisle = event['data'];
			deleteAisle(theAisle, thisFacility);
		}
		// This makes the popup go away immediately after click.
		$(this).fadeOut(5);
		// Unfortunately, this still gets called multiple times for one click, and for different cells.
		// Probably the first click event works right, then subsequent click on popup element reregisters.

		// Popup does not work right. Should be able to right-click and without letting up, go onto item.
		// However, here we must release, the reclick to get the item;


	}

	var self = {

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
			contextMenu_.bind("click", item, handleAisleContext);

			var line;
			if (view.getItemLevel(item)=== 0)
				line = $('<li>Edit Aisle</li>').appendTo(contextMenu_).data("option", "edit_aisle");
			else
				line = $('<li>Cannot edit single bay</li>').appendTo(contextMenu_).data("option", "cannot_edit_bay");
			if (view.getItemLevel(item)=== 0)
				line = $('<li>Delete Aisle</li>').appendTo(contextMenu_).data("option", "delete_aisle");
			else
				line = $('<li>Cannot delete single bay</li>').appendTo(contextMenu_).data("option", "cannot_delete_bay");

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
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Aisle'], hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
