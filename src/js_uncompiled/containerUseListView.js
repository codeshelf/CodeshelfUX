/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *
 *******************************************************************************/
/*
file containerUseListView.js author jon ranstrom
 */
goog.provide('codeshelf.containeruselistview');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

containerusecontextmenuscope = {
	'containeruse': null
};

function clearContainerUseContextMenuScope(){
	containerusecontextmenuscope['containeruse'] = null;
}

function doSomethingWithContainerUse() {
	// What will we do?  Most likely, something like
	// 1) lights on for all slots where the item in the container is
	// 2) Maybe a list of all item/item details for items in this container
	var theLogger = goog.debug.Logger.getLogger('ContainerUse view');
	var aString = containerusecontextmenuscope['containeruse']['domainId'];
	theLogger.info("will do something with container use: " + aString);

	clearContainerUseContextMenuScope();
}
goog.exportSymbol('doSomethingWithContainerUse', doSomethingWithContainerUse);

/**
 * The active container uses for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.containeruselistview = function(websession, facility, inChe) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor
	var che_ = inChe;

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
			if (inProperty['id'] ===  'cheName')
				return true;
			else if (inProperty['id'] ===  'orderName')
				return true;
			else if (inProperty['id'] ===  'containerName')
				return true;
			else
				return false;
		},

		getViewName: function() {
			returnStr = "Containers";
			if (che_ != null){
				returnStr = returnStr + " on " + che_['domainId'];
			}
			return returnStr;
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
				containerusecontextmenuscope['containeruse'] = item;
				line = $('<li><a href="javascript:doSomethingWithContainerUse()">ContainerUse test</a></li>').appendTo(contextMenu_).data("option", "use_action");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};

	// If che_ is null, then all active container uses for this facility. If che passed in, then only container uses on that CHE.
	var containerUseFilter;
	var containerUseFilterParams;

	if (null === che_) {
		// containerUse parent goes containerUse->container>facility
		containerUseFilter = "parent.parent.persistentId = :theId and active = true";

		containerUseFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];
	}
	else {
		// containerUse has currentChe field. Need a metafield?
		var containerUseFilter = "current_che_persistentid = :theId  and active = true";

		var containerUseFilterParams = [
			{ 'name': 'theId', 'value': che_['persistentId']}
		];
	}


	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['ContainerUse']['className'], linkProperty: 'parent', filter : containerUseFilter, filterParams : containerUseFilterParams, properties: domainobjects['ContainerUse']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['ContainerUse'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
