/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *  orderdetailsview.js  author jon ranstrom
 *******************************************************************************/

goog.provide('codeshelf.orderdetailsview');
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
codeshelf.orderdetailsview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

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

	function toSku(orderDetail) {
		return orderDetail['itemMasterId'];
	}

	var self = {

		'getViewName': function () {
				return 'Order Details';
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
			else if (inProperty['id'] === 'status')
				return true;
			else if (inProperty['id'] === 'active')
				return false;
			else if (inProperty['id'] === 'itemLocations')
				return false;
			else if (inProperty['id'] === 'groupUi')
				return false;
			else if (inProperty['id'] === 'putWallUi')
				return false;
			else if (inProperty['id'] === 'orderLocationAliasIds')
				return false;
			else
				return true;
		}
	};


	var orderDetailContextDefs = [
		{
			"label" : "Item Locations For SKU",
			"permission": "inventory:view",
			"action": function(orderDetail) {
				codeshelf.windowLauncher.loadItemsListViewForSku(toSku(orderDetail));
			}
		}
	];

	orderDetailContextDefs.push(
		{
			"label" : "Edit Item Location",
			"permission": "item:edit",
			"action": function(orderDetail) {
				codeshelf.openItemEditDialog(facility_, toSku(orderDetail), orderDetail['description'], orderDetail['uomMasterId'], orderDetail['itemLocations'], orderDetail['persistentId']);
			}
		}
	);

	orderDetailContextDefs.push(
		{
			"label" : "Work Instructions for Order Detail",
			"permission": "inventory:view",
			"action": function(orderDetail) {
				codeshelf.windowLauncher.loadWorkInstructionsForDetail(orderDetail['persistentId']);
			}
		}
	);


	var orderDetailFilter = "orderDetailsByFacility";
	var orderDetailFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
	];

	var orderDetailHierarchyMapDef = { "className": domainobjects['OrderDetail']['className'], "linkProperty": 'parent', "filter": orderDetailFilter, "filterParams": orderDetailFilterParams, "properties": domainobjects['OrderDetail']['properties'], "comparer": undefined , "contextMenuDefs": orderDetailContextDefs};

	var hierarchyMap = [];
	var view = null;


	hierarchyMap[0] = orderDetailHierarchyMapDef;
	var viewOptions = {
		'editable':  false,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	view = codeshelf.hierarchylistview(websession_, domainobjects['OrderDetail'], hierarchyMap, viewOptions);


	jQuery.extend(view, self);
	self = view;

	return view;
};
