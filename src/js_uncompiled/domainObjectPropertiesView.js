/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2014, Codeshelf, All rights reserved
 *  configurationview.js  author jon ranstrom
 *******************************************************************************/

goog.provide('codeshelf.domainobjectpropertiesview');
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
codeshelf.domainobjectpropertiesview = function(websession, facility) {

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

		// view of "DomainObjectProperty", flattened to include fields from DomainObjectDefaultProperty
		getViewName: function () {
				return 'Configuration Parameters';
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


	var configurationContextDefs = [
	];

	configurationContextDefs.push(
		{
			"label" : "Edit Configuration",
			"permission": "configuration:edit",
			"action": function(domainobjectproperty) {
				codeshelf.openConfigurationEditDialog(domainobjectproperty['description'], domainobjectproperty['name'], domainobjectproperty['value']);
			}
		}
	);

	var configurationFilter = "configurationByFacility";
	var configurationFilterParams = [
		{ 'name': 'facilityId', 'value': facility_['persistentId']}
	];

	var configurationHierarchyMapDef = { "className": domainobjects['DomainObjectProperty']['className'], "linkProperty": 'parent', "filter": configurationFilter, "filterParams": configurationFilterParams, "properties": domainobjects['DomainObjectProperty']['properties'], "comparer": undefined , "contextMenuDefs": configurationContextDefs};

	var hierarchyMap = [];
	var view = null;


	hierarchyMap[0] = configurationHierarchyMapDef;
	var viewOptions = {
		'editable':  false,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};
	view = codeshelf.hierarchylistview(websession_, domainobjects['DomainObjectProperty'], hierarchyMap, viewOptions);


	jQuery.extend(view, self);
	self = view;

	return view;
};
