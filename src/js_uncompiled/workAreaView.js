/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: workAreaView.js,v 1.4 2013/01/02 08:40:35 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.workareaview');
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
 * The work areas for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The work queue view.
 */
codeshelf.workareaview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;

	function updateLink(event) {
		if ($(event.target).data("option") == "link") {
			var buttonSet = new goog.ui.Dialog.ButtonSet().
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.OK).
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);

			var dataEntryDialog = codeshelf.dataentrydialog('Link Dropbox', buttonSet);
			var dialogContentElement = soy.renderAsElement(codeshelf.templates.linkDropboxDialog);
			dataEntryDialog.setupDialog(dialogContentElement);
			dataEntryDialog.open(function(event, dialog) {
				                     if (event.key === goog.ui.Dialog.ButtonSet.DefaultButtons.OK.key) {

					                     // Call Facility.linkDropbox();
					                     var data = {
						                     'className':    domainobjects['Facility']['className'],
						                     'persistentId': 1,
						                     'methodName':   'linkDropbox',
						                     'methodArgs':   [
						                     ]
					                     };

					                     var linkDropboxCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
					                     websession_.sendCommand(linkDropboxCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ), true);
				                     }
			                     }
			);

		}
	}

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function(command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_METHOD_RESP) {
						var url = command['data']['results'];
						window.open(url, '_blank');
						window.focus();
					}
				}
			}
		};

		return callback;
	}

	var self = {

		getViewName: function() {
			return 'Work Areas';
		},

		setupContextMenu: function() {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);
			contextMenu_.bind('mouseleave', function(event) {
				$(this).fadeOut(5)
			});
			contextMenu_.bind("click", updateLink);
		},

		doContextMenu: function(event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();

			var line, input;
			line = $('<li>Link Dropbox</li>').appendTo(contextMenu_).data("option", "link");

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
	hierarchyMap[0] = { className: domainobjects['Path']['className'], linkProperty: 'parent', filter : pathFilter, filterParams : pathFilterParams };
	hierarchyMap[1] = { className: domainobjects['WorkArea']['className'], linkProperty: 'parent', filter : undefined, filterParams : undefined };
	hierarchyMap[2] = { className: domainobjects['WorkInstruction']['className'], linkProperty: 'parent', filter : undefined, filterParams : undefined };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['Path'], hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
