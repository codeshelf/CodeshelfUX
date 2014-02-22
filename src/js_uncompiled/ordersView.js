/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ordersView.js,v 1.10 2013/05/26 21:52:20 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.ordersview');
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
 * The current orders for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The orders view.
 */
codeshelf.ordersview = function(websession, facility) {

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

	function workSequenceComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA.workSequence < orderHeaderB.workSequence) {
			return -1;
		} else if (orderHeaderA.workSequence > orderHeaderB.workSequence) {
			return 1;
		} else {
			return dueDateComparer(orderHeaderA, orderHeaderB);
		}
	}

	function dueDateComparer(orderHeaderA, orderHeaderB) {
		dateA = new Date(orderHeaderA.dueDate);
		dateB = new Date(orderHeaderB.dueDate);
		if (dateA < dateB) {
			return -1;
		} else if (dateA > dateB) {
			return 1;
		} else {
			return orderIdComparer(orderHeaderA, orderHeaderB);
		}
	}

	function orderIdComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA.orderId < orderHeaderB.orderId) {
			return -1;
		} else if (orderHeaderA.orderId > orderHeaderB.orderId) {
			return 1;
		} else {
			// Punt to make the left one randomly lower.
			return -1;
		}
	}


	var self = {

		getViewName: function() {
			return 'Orders';
		},

		setupContextMenu: function() {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
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

	var orderGroupFilter = "parent.persistentId = :theId";
	var orderGroupFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var orderHeaderFilter = "statusEnum <> 'COMPLETE'";

	var orderDetailFilter = "statusEnum <> 'COMPLETE'";

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['OrderGroup']['className'], linkProperty: 'parent', filter: orderGroupFilter, filterParams: orderGroupFilterParams, properties: domainobjects['OrderGroup']['properties'], comparer: undefined };
	hierarchyMap[1] = { className: domainobjects['OrderHeader']['className'], linkProperty: 'orderGroup', filter: orderHeaderFilter, filterParams: undefined, properties: domainobjects['OrderHeader']['properties'], comparer: workSequenceComparer };
	hierarchyMap[2] = { className: domainobjects['OrderDetail']['className'], linkProperty: 'parent', filter: orderDetailFilter, filterParams: undefined, properties: domainobjects['OrderDetail']['properties'], comparer: undefined };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['OrderGroup'], hierarchyMap, 1);
	jQuery.extend(view, self);
	self = view;

	return view;
};
