/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *
 *******************************************************************************/
/*
file workInstructionListView.js author jon ranstrom
 */
goog.provide('codeshelf.workinstructionlistview');
goog.require('codeshelf.objectUpdater');
goog.require('codeshelf.hierarchylistview');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

workinstructioncontextmenuscope = {
	'workinstruction': null
};

function clearWorkInstructionContextMenuScope(){
	workinstructioncontextmenuscope['workinstruction'] = null;
}

function doFakeCompleteWorkInstruction(inUpdateKind) {
	wi = workinstructioncontextmenuscope['workinstruction'];
	var methodArgs = [
		{ 'name': 'inCompleteStr', 'value': inUpdateKind, 'classType': 'java.lang.String'}
	];
	codeshelf.objectUpdater.callMethod(wi, 'WorkInstruction', 'fakeCompleteWi', methodArgs);
	clearWorkInstructionContextMenuScope();
}

function completeWorkInstruction() {
	doFakeCompleteWorkInstruction('COMPLETE');
}
goog.exportSymbol('completeWorkInstruction', completeWorkInstruction);

function shortWorkInstruction() {
	doFakeCompleteWorkInstruction('SHORT');
}
goog.exportSymbol('shortWorkInstruction', shortWorkInstruction);

/**
 * The active container uses for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The container use list view.
 */
codeshelf.workinstructionlistview = function(websession, facility, inChe, inGroup, inOrder) {

	var websession_ = websession;
	var facility_ = facility; // not used here, but the ancestor view wants facility in the constructor
	var che_ = inChe;
	var group_ = inGroup;
	var order_ = inOrder;

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
			if (inProperty['id'] ===  'description')
				return true;
			else if (inProperty['id'] ===  'containerId')
				return true;
			else if (inProperty['id'] ===  'pickInstruction')
				return true;
			else if (inProperty['id'] ===  'statusEnum')
				return true;
			else if (inProperty['id'] ===  'groupAndSortCode')
				return true;
			else if (inProperty['id'] ===  'planQuantity')
				return true;
			else if (inProperty['id'] ===  'assignedCheName')
				return true;
			else
				return false;
			// need to add che once we have the meta field
		},

		getViewName: function() {
			returnStr = "Work Instructions";
			if (che_ != null){
				returnStr = returnStr + " for " + che_['domainId'];
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
				workinstructioncontextmenuscope['workinstruction'] = item;
				line = $('<li><a href="javascript:completeWorkInstruction()">TESTING ONLY-Complete</a></li>').appendTo(contextMenu_).data("option", "wi_complete");
				line = $('<li><a href="javascript:shortWorkInstruction()">TESTING ONLY-Short</a></li>').appendTo(contextMenu_).data("option", "wi_short");
			}

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}

	};

	var workInstructionFilter;
	var workInstructionFilterParams;

	if (null != che_) {
		// all work instructions for this che, including complete. But only active orders. (Not checking active details)
		workInstructionFilter = "assignedChe = :theId and statusEnum != 'COMPLETE' and parent.parent.active = true";

		// Experiments
		// Does not work:  "assignedChePersistentid = :theId";      // seems like it could work, and would if there were a text field
																	// assignedChePersistentid that would persist as assigned_che_persistentid

		// Does work PREFERRED:  "assignedChe = :theId";            // the work instruction java field name is assignedChe
		// Does work:  "assigned_che_persistentid = :theId";        // the database field is assigned_che_persistentid for field assignedChe


		workInstructionFilterParams = [
			{ 'name': 'theId', 'value': che_['persistentId']}
		];

	}
	else { // all uncompleted work instructions this facility. Include REVERT though
		// work instuction parentage goes workInstruction->orderDetail->orderHeader->facility
		workInstructionFilter = "parent.parent.parent.persistentId = :theId and statusEnum != 'COMPLETE' and parent.parent.active = true";

		workInstructionFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];	}


	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['WorkInstruction']['className'], linkProperty: 'parent', filter : workInstructionFilter, filterParams : workInstructionFilterParams, properties: domainobjects['WorkInstruction']['properties'] };

	// -1 for non-dragable. Single level view with normal sort rules
	var view = codeshelf.hierarchylistview(websession_, domainobjects['WorkInstruction'], hierarchyMap, -1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
