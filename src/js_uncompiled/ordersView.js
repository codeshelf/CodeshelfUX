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
codeshelf.ordersview = function(websession, facility, inOutboundOrders, partialOrderIdQuery) {

	var websession_ = websession;
	var facility_ = facility;
	var outboundOrders_ = inOutboundOrders;
    var partialOrderIdQuery_ = partialOrderIdQuery;

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

		'getViewName': function () {
			if (outboundOrders_)
				return 'Outbound Orders';
			else
				return 'Cross Batch Orders';
		},

        'getViewMenu': function() {
            return [
                {"label": 'Export CSV', "action": function() {self.generateCSV();} }
                ,{"label": 'Archive All Orders', "action": function() {self.archiveAllOrders(facility_);}, "permission": "order: edit" }
            ];
        },

        archiveAllOrders: function(facility) {
            var uuid = facility['persistentId'];
            codeshelf.simpleDlogService.showModalDialog("Confirm", "Archive all orders,ordergroups and orderdetails?", {})
                .then(function() {
                    websession_.callServiceMethod("OrderService", "archiveAllOrders", [uuid]).then();
                });


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
			else if (inProperty['id'] === 'willProduceWiUi')
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
			else if (inProperty['id'] === 'status')
				return true;
			else if (inProperty['id'] === 'active')
				return false;
			else if (inProperty['id'] === 'orderLocationAliasIds')
				return false;
			else if (inProperty['id'] === 'orderType')
				return false;
			else if (inProperty['id'] === 'groupUi')
				return false;
			else if (inProperty['id'] === 'itemLocations' && !outboundOrders_)
				return false;
			else
				return true;
		}
	};


	var orderHeaderContextDefs = [
		{
			"label" : "Work Instructions for Order",
			"permission": "inventory:view",
			"action": function(orderHeader) {
				codeshelf.windowLauncher.loadWorkInstructionsForHeader(orderHeader['persistentId']);
			}
		}
	];

	var orderDetailContextDefs = [
		{
			"label" : "Item Locations For SKU",
			"permission": "inventory:view",
			"action": function(orderDetail) {
				codeshelf.windowLauncher.loadItemsListViewForSku(toSku(orderDetail));
			}
		}
	];

	if (outboundOrders_) {
		orderDetailContextDefs.push(
			{
				"label" : "Edit Item Location",
				"permission": "item:edit",
				"action": function(orderDetail) {
					codeshelf.openItemEditDialog(facility_, toSku(orderDetail), orderDetail['description'], orderDetail['uomMasterId'], orderDetail['itemLocations'], orderDetail['persistentId']);
				}
			}
		);
	};

	orderDetailContextDefs.push(
		{
			"label" : "Work Instructions for Order Detail",
			"permission": "inventory:view",
			"action": function(orderDetail) {
				codeshelf.windowLauncher.loadWorkInstructionsForDetail(orderDetail['persistentId']);
			}
		}
	);


	var orderTypeEnum = 'CROSS';
	if (outboundOrders_) {
		orderTypeEnum = 'OUTBOUND';
	}

	var orderDetailHierarchyMapDef = {
		"className": domainobjects['OrderDetail']['className'],
		"linkProperty": 'parent',
		"filter": "orderDetailsByHeader",
		"filterParams": undefined,
		"properties": domainobjects['OrderDetail']['properties'],
		"comparer": undefined ,
		"contextMenuDefs": orderDetailContextDefs
	};

	var hierarchyMap = [];
	var view = null;
	if (facility_['hasMeaningfulOrderGroups']) {
        //By limiting to at least order groups that have the order we largely reduce the load
        // until better solution

		var orderGroupFilter = "orderGroupsByOrderHeaderId";
		var orderGroupFilterParams = [
			{ 'name': 'parentId', 'value': facility_['persistentId']},
			{ 'name': 'partialDomainId', 'value': '%' + partialOrderIdQuery + '%'}
		];

		var orderHeaderFilter = "orderHeadersByGroupAndType";
		var orderHeaderFilterParams = [
			{ 'name': 'orderType', 'value': orderTypeEnum }
		];

		// GoodEggs reliably has order groups. So deliver a 3-level view.
		hierarchyMap[0] = { "className": domainobjects['OrderGroup']['className'], "linkProperty": 'parent', "filter": orderGroupFilter, "filterParams": orderGroupFilterParams, "properties": domainobjects['OrderGroup']['properties'], "comparer": undefined };
		hierarchyMap[1] = { "className": domainobjects['OrderHeader']['className'], "linkProperty": 'orderGroup', "filter": orderHeaderFilter, "filterParams": orderHeaderFilterParams, "properties": domainobjects['OrderHeader']['properties'], "comparer": workSequenceComparer, "contextMenuDefs": orderHeaderContextDefs };
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


		var orderHeaderFilter = "orderHeadersByFacilityAndPartialDomainId";

		var orderHeaderFilterParams = [
			{ 'name': 'facilityId', 'value': facility_['persistentId']},
			{ 'name': 'partialDomainId', 'value': '%' + partialOrderIdQuery_ + '%'}
		];

		// Accu-Logistics and many sites have no group at all, or are missing many. Just ignore and do the order headers.
		hierarchyMap[0] = { "className": domainobjects['OrderHeader']['className'], "linkProperty": 'parent', "filter": orderHeaderFilter, "filterParams": orderHeaderFilterParams, "properties": domainobjects['OrderHeader']['properties'], "comparer": workSequenceComparer, "contextMenuDefs": orderHeaderContextDefs };
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
