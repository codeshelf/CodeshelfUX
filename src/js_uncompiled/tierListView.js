/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file tierListView.js author jon ranstrom
 */
goog.provide('codeshelf.tierlistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

tiercontextmenuscope = {
	'tier': null
};

function clearTierContextMenuScope(){
	tiercontextmenuscope['tier'] = null;
}

function doSomethingWithTier() {
	var theLogger = goog.debug.Logger.getLogger('Tier view');
	var aString = tiercontextmenuscope['tier']['domainId'];
	theLogger.info("change description for selected Tier: " + aString);

	clearTierContextMenuScope();
}
goog.exportSymbol('doSomethingWithTier', doSomethingWithTier);

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.tierlistview = function(websession, facility) {

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
			else if (inProperty['id'] ===  'ledChannel')
				return false;
			else if (inProperty['id'] ===  'persistentId')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'Tiers List';
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
				tiercontextmenuscope['tier'] = item;
				line = $('<li><a href="javascript:doSomethingWithTier()">Just a tier test</a></li>').appendTo(contextMenu_).data("option", "tier_update");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};
	// tier parent goes bay->aisle>facility
	var tierFilter = 'parent.parent.parent.persistentId = :theId';

	var tierFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Tier']['className'], linkProperty: 'parent', filter : tierFilter, filterParams : tierFilterParams, properties: domainobjects['Tier']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Tier'], hierarchyMap, 0);
	jQuery.extend(view, self);
	self = view;

	return view;
};
