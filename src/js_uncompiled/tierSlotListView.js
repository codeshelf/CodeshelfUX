/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file tierSlotListView.js author jon ranstrom
 */
goog.provide('codeshelf.tierslotlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

slotcontextmenuscope = {
	'slot': null
};

function clearSlotContextMenuScope(){
	slotcontextmenuscope['slot'] = null;
}

function doSomethingWithSlot() {
	var theLogger = goog.debug.Logger.getLogger('Slot view');
	var aString = slotcontextmenuscope['slot']['domainId'];
	theLogger.info("change description for selected Slot: " + aString);

	clearSlotContextMenuScope();
}
goog.exportSymbol('doSomethingWithSlot', doSomethingWithSlot);

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.tierslotlistview = function(websession, inTier) {

	var websession_ = websession;
	var tier_ = inTier;

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
			else
				return true;
		},

		getViewName: function() {
			return 'Slots in Tier ' + tier_['tierSortName'];
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
				slotcontextmenuscope['slot'] = item;
				line = $('<li><a href="javascript:doSomethingWithSlot()">Just a Slot test</a></li>').appendTo(contextMenu_).data("option", "slot_update");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};
	// tier parent goes bay->aisle>facility
	var tierSlotFilter = 'parent.persistentId = :theId';

	var tierSlotFilterParams = [
		{ 'name': 'theId', 'value': tier_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Slot']['className'], linkProperty: 'parent', filter : tierSlotFilter, filterParams : tierSlotFilterParams, properties: domainobjects['Slot']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Slot'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
