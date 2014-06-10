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
	'tier': null
};

function clearTierContextMenuScope(){
	tiercontextmenuscope['tier'] = null;
}

function setControllerForTier() {
	var theLogger = goog.debug.Logger.getLogger('Tier view');
	var tierName = tiercontextmenuscope['tier']['domainId'];
	theLogger.info("setting controller for selected Tier: " + aString);
	// What we really want here is dialog with pick list of controllers, picklist for channel, and picklist for choices.
	// Choices are this tier only, all matching tiers in this aisle, or all selected tiers (need improved list selection first).

	/*
	// For now, use what we have, "selection manager" selection of controller, and assume channel 1.
	var cntrlString = "no controller selected";
	var aController = codeshelf.objectUpdater.getFirstObjectInSelectionList();
	// this this really a controller? Not a great test.
	if (aController && aController.hasOwnProperty('deviceGuid'))
		cntrlString = aController['domainId'];
	else
		aController = null; // setting to null if it was a reference to something else

	if (aController) { // we think aisle must be good to get here from the popup menu item
		// we want java-side names for class and field name here.
		// This one may not work, as location as a pointer to pathSegment, and not a key value
		theLogger.info("set tier " + tierName + " to controller " + cntrlString);
		cntlrPersistId = aController['persistentId'];

		var methodArgs = [
			{ 'name': 'inControllerPersistentIDStr', 'value': cntlrPersistId, 'classType': 'java.lang.String'},
			{ 'name': 'inChannelStr', 'value': "1", 'classType': 'java.lang.String'},
			{ 'name': 'inTiersStr', 'value': "", 'classType':  'java.lang.String'}
		];

		codeshelf.objectUpdater.callMethod(tiercontextmenuscope['tier'], 'Tier', 'setControllerChannel', methodArgs);
	}

	*/

	clearTierContextMenuScope();
}
goog.exportSymbol('setControllerForTier', doSomethingWithTier);

function doLaunchTierSlotList() {
	// Not great. Want to use window launcher to open this window,
	// and to have the benefit of getDomNodeForNextWindow, dragLimit.
	// But requires codeshelf.windowLauncher introduces a cycle
	aTier = tiercontextmenuscope['tier'];
	var tierSlotListView = codeshelf.tierslotlistview(codeshelf.sessionGlobals.getWebsession(), codeshelf.sessionGlobals.getFacility(), aTier);
	// var tierSlotListWindow = codeshelf.window(tierSlotListView, getDomNodeForNextWindow(), getWindowDragLimit());
	var theRectLimit = new goog.math.Rect(0,0,10000,10000);
	var tierSlotListWindow = codeshelf.window(tierSlotListView, null, theRectLimit);
	tierSlotListWindow.open();

	clearTierContextMenuScope();
}
goog.exportSymbol('doLaunchTierSlotList', doLaunchTierSlotList);

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.tierlistview = function(websession, facility, aisle) {

	var websession_ = websession;
	var facility_ = facility;
	// If aisle is null, then all tiers for all aisle in this facility. If aisle passed in, then only tiers in this aisle.
	var aisle_ = aisle;

	var contextMenu_;


	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function (command) {
				/* appears to never be called
				 var theLogger = goog.debug.Logger.getLogger('aislesListView');
				 theLogger.info("callback exec called"); */
			}
		};

		return callback;
	}

	var self = {

		// following psuedo-inheritance
		'shouldAddThisColumn': function (inProperty) {
			if (inProperty['id'] === 'persistentId')
				return false;
			else if (inProperty['id'] === 'domainId')
				return false;
			else if (inProperty['id'] === 'ledChannel')
				return false;
			else if (inProperty['id'] === 'pickFaceEndPosX')
				return false;
			else if (inProperty['id'] === 'pickFaceEndPosY')
				return false;
			else if (inProperty['id'] === 'anchorPosX')
				return false;
			else if (inProperty['id'] === 'anchorPosY')
				return false;
			else
				return true;
		},

		getViewName: function () {
			return 'Tiers List';
		},

		setupContextMenu: function () {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function (event) {
				$(this).fadeOut(5)
			});
		},

		doContextMenu: function (event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();
			// contextMenu_.bind("click", item, handleAisleContext);

			var line;
			if (view.getItemLevel(item) === 0) {
				tiercontextmenuscope['tier'] = item;
				// This needs to be conditional. Does this session have permission to set controller?
				line = $('<li><a href="javascript:setControllerForTier()">Set controller for tier</a></li>').appendTo(contextMenu_).data("option", "tier_cntlr");

				line = $('<li><a href="javascript:doLaunchTierSlotList()">Slots for this tier</a></li>').appendTo(contextMenu_).data("option", "slots_list");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};

	// If aisle is null, then all tiers for all aisle in this facility. If aisle passed in, then only tiers in this aisle.

	// tier parent goes bay->aisle>facility
	var tierFilter = 'parent.parent.parent.persistentId = :theId';

	var tierFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	/*
	var tierFilter;
	var tierFilterParams;

	if (null === aisle_) {
		// tier parent goes bay->aisle>facility
		tierFilter = 'parent.parent.parent.persistentId = :theId';

		tierFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];
	}
	else {
		tierFilter = 'parent.parent.persistentId = :theId';

		tierFilterParams = [
			{ 'name': 'theId', 'value': aisle_['persistentId']}
		];
	}
	*/

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['Tier']['className'], linkProperty: 'parent', filter : tierFilter, filterParams : tierFilterParams, properties: domainobjects['Tier']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Tier'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
