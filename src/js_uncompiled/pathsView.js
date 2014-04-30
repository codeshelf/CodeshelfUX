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
goog.require('extern.jquery');
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

	var contextMenu_;

	function sendPathDelete(event) {
		if ($(event.target).data("option") == "delete_path") {
			// Demonstrating correct right click use in list view.
			// Note the bind below. Passes the item, which becomes event.data
			// Important. event.data and thePath.domainId work uncompiled, but not compiled.
			var thePath = event['data'];

			var theLogger = goog.debug.Logger.getLogger('Paths view');
			var aString = thePath['domainId'];
			theLogger.info("just logging: delete path " + aString);

		}
	}

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {

			}
		};

		return callback;
	}

	var self = {

		getViewName: function() {
			return 'Paths';
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
			contextMenu_.bind("click", item, sendPathDelete);

			var line, input;
			// only level 0 click should delete path
			// if (this.getLevel(item)=== 0)
			if (view.getItemLevel(item)=== 0)
				line = $('<li>Delete Path</li>').appendTo(contextMenu_).data("option", "delete_path");
			else
				line = $('<li>Delete Path Segment</li>').appendTo(contextMenu_).data("option", "delete_path_segment");

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
	hierarchyMap[1] = { className: domainobjects['PathSegment']['className'], linkProperty: 'parent', filter : undefined, filterParams : undefined, properties: domainobjects['PathSegment']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Path'], hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
