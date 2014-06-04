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
goog.require('codeshelf.tierslotlistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

tiercontextmenuscope = {
	'bay': null
};

function clearBayContextMenuScope(){
	baycontextmenuscope['bay'] = null;
}

function doSomethingWithBay() {
	var theLogger = goog.debug.Logger.getLogger('Bay view');
	var aString = tiercontextmenuscope['bay']['domainId'];
	theLogger.info("change description for selected bay: " + aString);

	clearTierContextMenuScope();
}
goog.exportSymbol('doSomethingWithBay', doSomethingWithBay);

/**
 * The bays for this facility. Or a the bays for one aisle later
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.baylistview = function(websession, facility) {

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
			if (inProperty['id'] ===  'persistentId')
				return false;
			else if (inProperty['id'] ===  'pickFaceEndPosX')
				return false;
			else if (inProperty['id'] ===  'pickFaceEndPosY')
				return false;
			else if (inProperty['id'] ===  'anchorPosX')
				return false;
			else if (inProperty['id'] ===  'anchorPosY')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'Bays List';
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
				baycontextmenuscope['bay'] = item;
				line = $('<li><a href="javascript:doSomethingWithBay()">Just a bay test</a></li>').appendTo(contextMenu_).data("option", "bay_update");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};
	// tier parent goes bay->aisle>facility
	var bayFilter = 'parent.parent.persistentId = :theId';

	var bayFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Bay']['className'], linkProperty: 'parent', filter : bayFilter, filterParams : bayFilterParams, properties: domainobjects['Bay']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Bay'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
