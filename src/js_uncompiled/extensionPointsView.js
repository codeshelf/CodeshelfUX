/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *  extensionPointsView.js  author Ilya Landa
 *******************************************************************************/

goog.provide('codeshelf.extensionpointsview');

/**
 * The current orders for this facility.
 * @param websession The websession used for updates.
 * @param facility get config parameters for this facility.
 * @return {Object} The view.
 */
codeshelf.extensionpointsview = function(websession, facility) {

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

	var self = {
		'getViewName': function () {
				return 'Extension Points';
		},

		// following psuedo-inheritance pattern
		'shouldAddThisColumn': function (inProperty) {
			// exclude these fields. (Includ qty, UOM, container ID, order ID, SKU, Description.
			// A combination of fields from each of 3 levels.
			if (inProperty['id'] === 'persistentId')
				return false;
			else
				return true;
		}
	};


	var contextDefs = [
		{
			"label": "Toggle Extension Point",
			"permission": "extensionPoints:edit",
			"action": function(itemContext) {
				itemContext['active'] = !itemContext['active'];
				websession_.update(itemContext, ['active']);
			}
		}
	];

	var extensionPointsFilter = "allByParent";
	var extensionPointsParams = [
		{ 'name': 'parentId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['ExtensionPoint']['className'],
                        "linkProperty": 'parent',
                        "filter" : extensionPointsFilter,
                        "filterParams" : extensionPointsParams,
                        "properties": domainobjects['ExtensionPoint']['properties'],
                        "contextMenuDefs": contextDefs};
	var viewOptions = {
		'editable':  false,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	var view = codeshelf.hierarchylistview(websession_, domainobjects['ExtensionPoint'], hierarchyMap, viewOptions);


	jQuery.extend(view, self);
	self = view;

	return view;
};