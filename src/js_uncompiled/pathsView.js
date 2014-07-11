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

pathscontextmenuscope = {
	'path': null,
	'pathsegment': null
};

function clearContextMenuScope(){
	pathscontextmenuscope['path'] = null; // clear it now, just to be tidy.
	pathscontextmenuscope['pathsegment'] = null; // clear it now, just to be tidy.
}
function sendPathDelete() {
	var theLogger = goog.debug.Logger.getLogger('Paths view');
	var aString = pathscontextmenuscope['path']['domainId'];
	// var aString = "unknown path";
	theLogger.info("delete path2 " + aString);

	thePath = pathscontextmenuscope['path'];
	var methodArgs = [
	];
	codeshelf.objectUpdater.callMethod(thePath, 'Path', 'deleteThisPath', methodArgs);


	clearContextMenuScope();
}
goog.exportSymbol('sendPathDelete', sendPathDelete); // Silly that this is needed even in same file.


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
			// contextMenu_.bind("click", item, sendPathDelete);

			var line;
			// this is a two-level view

			if (view.getItemLevel(item) === 0) {
				pathscontextmenuscope['path'] = item;
				line = $('<li><a href="javascript:sendPathDelete()">Delete Path</a></li>').appendTo(contextMenu_).data("option", "delete_path");
			}

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
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Path'], hierarchyMap, 0);
	jQuery.extend(view, self);
	self = view;

	return view;
};
