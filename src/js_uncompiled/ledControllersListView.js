/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file ledControllersListView.js author jon ranstrom
 */
goog.provide('codeshelf.ledcontrollerslistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

ledcontrollercontextmenuscope = {
	'ledcontroller': null
};

function clearLedControllerContextMenuScope(){
	ledcontrollercontextmenuscope['ledcontroller'] = null;
}
function selectLedController() {
	var theLogger = goog.debug.Logger.getLogger('LED Controllers view');
	var aString = ledcontrollercontextmenuscope['ledcontroller']['domainId'];
	// var aString = "unknown pathsegment";
	theLogger.info("selected led controller: " + aString);
	codeshelf.objectUpdater.setObjectInSelectionList(ledcontrollercontextmenuscope['ledcontroller']);
	clearLedControllerContextMenuScope();
}
goog.exportSymbol('selectLedController', selectLedController);

/**
 * The aisles for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The aisles list view.
 */
codeshelf.ledcontrollerslistview = function(websession, facility) {

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
			else if (inProperty['id'] ===  'deviceGuid')
				return false;
			else
				return true;
		},

		getViewName: function() {
			return 'LED Controllers List View';
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
				ledcontrollercontextmenuscope['ledcontroller'] = item;
				line = $('<li><a href="javascript:selectLedController()">Cache selected LED Controller</a></li>').appendTo(contextMenu_).data("option", "cache_selected");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};
	// ledController parent is codeshelf_network, whose parent is the facility
	// normal case will not work
	var ledControllerFilter = 'parent.persistentId = :theId';

	// alternate1 does not work
	// var ledControllerFilter = 'parent.persistentId.parent.persistent_id = :theId';

	// alternate2 does not work
	// var ledControllerFilter = 'parent.persistentId.parent_persistent_id = :theId';

	// alternate3 does not work
	// var ledControllerFilter = 'parent.parent.persistent_id = :theId';

	var ledControllerFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['LedController']['className'], linkProperty: 'parent', filter : ledControllerFilter, filterParams : ledControllerFilterParams, properties: domainobjects['LedController']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['LedController'], hierarchyMap, 0);
	jQuery.extend(view, self);
	self = view;

	return view;
};
