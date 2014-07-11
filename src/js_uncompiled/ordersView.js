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

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');
goog.require('adhocDialogService');

/**
 * The current orders for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The orders view.
 */
codeshelf.ordersview = function(websession, facility, inOutboundOrders) {

	var websession_ = websession;
	var facility_ = facility;
	var outboundOrders_ = inOutboundOrders;

	var contextMenu_;


	function websocketCmdCallbackFacility() {
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
		dateA = new Date(orderHeaderA.readableDueDate);
		dateB = new Date(orderHeaderB.readableDueDate);
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

		getViewName: function () {
			if (outboundOrders_)
				return 'Outbound Orders';
			else
				return 'Cross Batch Orders';
		},

		setupContextMenu: function () {
			/*
			 contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			 contextMenu_.bind('mouseleave', function(event) {
			 $(this).fadeOut(5)
			 });
			 */
		},

		doContextMenu: function (event, item, column) {
			/*
			 if (event && event.stopPropagation)
			 event.stopPropagation();

			 event.preventDefault();
			 contextMenu_.empty();
			 // contextMenu_.bind("click", item, sendPathDelete);

			 var line;
			 // this is a two-level view

			 contextMenu_
			 .css('top', event.pageY - 10)
			 .css('left', event.pageX - 10)
			 .fadeIn(5);
			 */
		},


		// following psuedo-inheritance pattern
		'shouldAddThisColumn': function (inProperty) {
			// exclude these fields. (Includ qty, UOM, container ID, order ID, SKU, Description.
			// A combination of fields from each of 3 levels.
			if (inProperty['id'] === 'persistentId')
				return false;
			else if (inProperty['id'] === 'fullDomainId')
				return false;
			else if (inProperty['id'] === 'readableOrderDate')
				return false;
			else if (inProperty['id'] === 'readableDueDate')
				return false;
			else if (inProperty['id'] === 'shipmentId')
				return false;
			else if (inProperty['id'] === 'customerId')
				return false;
			else if (inProperty['id'] === 'workSequence')
				return false;
			else if (inProperty['id'] === 'orderDetailId')
				return false;
			else if (inProperty['id'] === 'statusEnum')
				return false;
			else if (inProperty['id'] === 'active')
				return false;
			else
				return true;
		}

	};

	// used if codeshelf.sessionGlobals.getHasOrderGroups()
	var orderGroupFilter = "parent.persistentId = :theId  and active = true ";
	var orderGroupFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];


	var orderHeaderFilter = "";

	// Rather complicated. 4 significantly different view types
	if (codeshelf.sessionGlobals.getHasOrderGroups()) {
		if (outboundOrders_)
			orderHeaderFilter = "statusEnum <> 'COMPLETE' and active = true and orderTypeEnum = 'OUTBOUND' ";
		else
			orderHeaderFilter = "statusEnum <> 'COMPLETE' and active = true and orderTypeEnum = 'CROSS' ";
	}
	else {
		if (outboundOrders_)
			orderHeaderFilter = "parent.persistentId = :theId and statusEnum <> 'COMPLETE' and active = true and orderTypeEnum = 'OUTBOUND' ";
		else
			orderHeaderFilter = "parent.persistentId = :theId and statusEnum <> 'COMPLETE' and active = true and orderTypeEnum = 'CROSS' ";
	}

	// This is only used if NOT getHasOrderGroups(). See below. undefined used for orderGroups as there is no parameter to substitute.
	// Probably would be good to parameterize much more: orderTypeEnum in particular.
	var orderHeaderFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var orderDetailFilter = "statusEnum <> 'COMPLETE'";

	var hierarchyMap = [];
	var view = null;
	if (codeshelf.sessionGlobals.getHasOrderGroups()) {
		// GoodEggs reliably has order groups. So deliver a 3-level view.
		hierarchyMap[0] = { className: domainobjects['OrderGroup']['className'], linkProperty: 'parent', filter: orderGroupFilter, filterParams: orderGroupFilterParams, properties: domainobjects['OrderGroup']['properties'], comparer: undefined };
		hierarchyMap[1] = { className: domainobjects['OrderHeader']['className'], linkProperty: 'orderGroup', filter: orderHeaderFilter, filterParams: undefined, properties: domainobjects['OrderHeader']['properties'], comparer: workSequenceComparer };
		hierarchyMap[2] = { className: domainobjects['OrderDetail']['className'], linkProperty: 'parent', filter: orderDetailFilter, filterParams: undefined, properties: domainobjects['OrderDetail']['properties'], comparer: undefined };

		view = codeshelf.hierarchylistview(websession_, domainobjects['OrderGroup'], hierarchyMap, 1);
	} else {
		// Accu-Logistics and many sites have no group at all, or are missing many. Just ignore and do the order headers.
		hierarchyMap[0] = { className: domainobjects['OrderHeader']['className'], linkProperty: 'parent', filter: orderHeaderFilter, filterParams: orderHeaderFilterParams, properties: domainobjects['OrderHeader']['properties'], comparer: workSequenceComparer };
		hierarchyMap[1] = { className: domainobjects['OrderDetail']['className'], linkProperty: 'parent', filter: orderDetailFilter, filterParams: undefined, properties: domainobjects['OrderDetail']['properties'], comparer: undefined };

		view = codeshelf.hierarchylistview(websession_, domainobjects['OrderHeader'], hierarchyMap, 1);
	}

	jQuery.extend(view, self);
	self = view;

	return view;
};
