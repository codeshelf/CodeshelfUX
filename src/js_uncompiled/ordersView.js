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

	function websocketCmdCallbackFacility() {
		var callback = {
			exec: function (type,command) {
				if (type == kWebSessionCommandType.OBJECT_METHOD_RESP) {
					var url = command['results'];
					window.open(url, '_blank');
					window.focus();
				}
			}
		};

		return callback;
	}

	function workSequenceComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA["workSequence"] < orderHeaderB["workSequence"]) {
			return -1;
		} else if (orderHeaderA["workSequence"] > orderHeaderB["workSequence"]) {
			return 1;
		} else {
			return dueDateComparer(orderHeaderA, orderHeaderB);
		}
	}

	function dueDateComparer(orderHeaderA, orderHeaderB) {
		var dateA = new Date(orderHeaderA['readableDueDate']);
		var dateB = new Date(orderHeaderB['readableDueDate']);
		if (dateA < dateB) {
			return -1;
		} else if (dateA > dateB) {
			return 1;
		} else {
			return orderIdComparer(orderHeaderA, orderHeaderB);
		}
	}

	function orderIdComparer(orderHeaderA, orderHeaderB) {
		if (orderHeaderA['orderId'] < orderHeaderB['orderId']) {
			return -1;
		} else if (orderHeaderA['orderId'] > orderHeaderB['orderId']) {
			return 1;
		} else {
			return goog.string.caseInsensitiveCompare(orderHeaderA['persistentId'], orderHeaderB['persistentId']);
		}
	}

	function toSku(orderDetail) {
		return orderDetail['itemMasterId'];
	}

	var self = {

		getViewName: function () {
			if (outboundOrders_)
				return 'Outbound Orders';
			else
				return 'Cross Batch Orders';
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

	var orderDetailContextDefs = [
		{
			"label" : "Edit Item Location",
			"permission": "item:edit",
			"action": function(orderDetail) {
				codeshelf.openItemEditDialog(facility_, toSku(orderDetail), orderDetail['description'], orderDetail['uomMasterId'], orderDetail['itemLocations']);
			}
		},
		{
			"label" : "Inventory for this SKU",
			"permission": "inventory:view",
			"action": function(orderDetail) {
				codeshelf.windowLauncher.loadItemsListViewForSku(toSku(orderDetail));
			}
		}
	];

	var orderHeaderFilter = "";

	// Rather complicated. 4 significantly different view types
	if (facility_['hasMeaningfulOrderGroups']) {
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

	var orderDetailFilter = "statusEnum <> 'COMPLETE'";


	var orderDetailHierarchyMapDef = { "className": domainobjects['OrderDetail']['className'], "linkProperty": 'parent', "filter": orderDetailFilter, "filterParams": undefined, "properties": domainobjects['OrderDetail']['properties'], "comparer": undefined , "contextMenuDefs": orderDetailContextDefs};

	var hierarchyMap = [];
	var view = null;
	if (facility_['hasMeaningfulOrderGroups']) {
		var orderGroupFilter = "parent.persistentId = :theId  and active = true ";
		var orderGroupFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];

		// GoodEggs reliably has order groups. So deliver a 3-level view.
		hierarchyMap[0] = { "className": domainobjects['OrderGroup']['className'], "linkProperty": 'parent', "filter": orderGroupFilter, "filterParams": orderGroupFilterParams, "properties": domainobjects['OrderGroup']['properties'], "comparer": undefined };
		hierarchyMap[1] = { "className": domainobjects['OrderHeader']['className'], "linkProperty": 'orderGroup', "filter": orderHeaderFilter, "filterParams": undefined, "properties": domainobjects['OrderHeader']['properties'], "comparer": workSequenceComparer };
		hierarchyMap[2] = orderDetailHierarchyMapDef;

		var viewOptions = {
			'editable':  true,
			// -1 for non-dragable. Single level view with normal sort rules
			'draggableHierarchyLevel': 1
		};
		view = codeshelf.hierarchylistview(websession_, domainobjects['OrderGroup'], hierarchyMap,viewOptions);
	} else {
		// This is only used if NOT getHasOrderGroups(). See below. undefined used for orderGroups as there is no parameter to substitute.
		// Probably would be good to parameterize much more: orderTypeEnum in particular.
		var orderHeaderFilterParams = [
			{ 'name': 'theId', 'value': facility_['persistentId']}
		];

		// Accu-Logistics and many sites have no group at all, or are missing many. Just ignore and do the order headers.
		hierarchyMap[0] = { "className": domainobjects['OrderHeader']['className'], "linkProperty": 'parent', "filter": orderHeaderFilter, "filterParams": orderHeaderFilterParams, "properties": domainobjects['OrderHeader']['properties'], "comparer": workSequenceComparer };
		hierarchyMap[1] = orderDetailHierarchyMapDef;
		var viewOptions = {
			'editable':  true,
			// -1 for non-dragable. Single level view with normal sort rules
			'draggableHierarchyLevel': -1
		};
		view = codeshelf.hierarchylistview(websession_, domainobjects['OrderHeader'], hierarchyMap, viewOptions);
	}

	jQuery.extend(view, self);
	self = view;

	return view;
};
