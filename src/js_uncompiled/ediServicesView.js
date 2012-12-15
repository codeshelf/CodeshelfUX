/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ediServicesView.js,v 1.9 2012/12/15 02:25:43 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.ediservicesview');
goog.require('codeshelf.aisleview');
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
 * The current state of edi files for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The edi view.
 */
codeshelf.ediservicesview = function(websession, facility) {

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

	var hierarchyMap = [];
//	hierarchyMap[0] = domainobjects['Facility']['className'];
	hierarchyMap[0] = domainobjects['DropboxService']['className'];
	hierarchyMap[1] = domainobjects['EdiDocumentLocator']['className'];

	var filter = 'parent.persistentId = :theId';
	var filterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['DropboxService'], filter, filterParams, hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
