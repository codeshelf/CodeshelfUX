/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ediServicesView.js,v 1.16 2013/04/07 21:33:00 jeffw Exp $
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
codeshelf.ediservicesview = function (websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;

	function linkAccount(event) {
		if ($(event.target).data("option") == "link") {
			var dropboxServiceId = $(event.target).data("dropboxServiceId");
			var buttonSet = new goog.ui.Dialog.ButtonSet().
				addButton({key: 'link', caption: 'Link'}, false, false).
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE, false, false).
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);

			var dataEntryDialog = codeshelf.dataentrydialog('Link Dropbox', buttonSet);
			var dialogContentElement = soy.renderAsElement(codeshelf.templates.linkDropboxDialog);
			dataEntryDialog.setupDialog(dialogContentElement);
			dataEntryDialog.createField('dbxCode', 'text');
			dataEntryDialog.open(function (event, dialog) {
					if (event.key === 'link') {
						// Call Facility.startLinkDropbox();
						var data = {
							'className': domainobjects['DropboxService']['className'],
							'persistentId': dropboxServiceId,
							'methodName': 'startLink',
							'methodArgs': [
							]
						};
						var startLinkDropboxCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
						websession_.sendCommand(startLinkDropboxCmd, startLinkCallback(), true);
						return false;
					} else if (event.key === goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE.key) {
						// Call Facility.finishLinkDropbox();
						var dbxCode = dialog.getFieldValue('dbxCode');
						var data = {
							'className': domainobjects['DropboxService']['className'],
							'persistentId': dropboxServiceId,
							'methodName': 'finishLink',
							'methodArgs': [
								{'name': 'code', 'value': dbxCode, 'classType': 'java.lang.String'}
							]
						};
						var finishLinkDropboxCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
						websession_.sendCommand(finishLinkDropboxCmd, finishLinkCallback(dataEntryDialog), true);
						return false;
					}
				}
			);

		}
	}

	function startLinkCallback() {
		var callback = {
			exec: function (command) {
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

	function finishLinkCallback(dataEntryDialog) {
		var callback = {
			exec: function (command) {
				if (!command['data'].hasOwnProperty('results')) {
					alert('response has no result');
				} else {
					if (command['type'] == kWebSessionCommandType.OBJECT_METHOD_RESP) {
						var result = command['data']['results'];
						if (result === true) {
							dataEntryDialog.close();
						}
					}
				}
			}
		};
		return callback;
	}

	var self = {

		getViewName: function () {
			return 'EDI Services';
		},

		setupContextMenu: function () {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function (event) {
				$(this).fadeOut(5)
			});
			contextMenu_.bind("click", linkAccount);
		},

		doContextMenu: function (event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();

			var line = $('<li>Link Dropbox</li>').appendTo(contextMenu_);
			line.data("option", "link");
			line.data("dropboxServiceId", item['persistentId'])

			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}
	};

	var serviceFilter = 'parent.persistentId = :theId';
	var serviceFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['DropboxService']['className'], linkProperty: 'parent', filter: serviceFilter, filterParams: serviceFilterParams, properties: domainobjects['DropboxService']['properties'] };
	hierarchyMap[1] = { className: domainobjects['EdiDocumentLocator']['className'], linkProperty: 'parent', filter: undefined, filterParams: undefined, properties: domainobjects['EdiDocumentLocator']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['DropboxService'], hierarchyMap);
	jQuery.extend(view, self);
	self = view;

	return view;
};
