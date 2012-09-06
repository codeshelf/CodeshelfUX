/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dropboxView.js,v 1.1 2012/09/06 06:43:38 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.dropboxview');
goog.require('codeshelf.aisleview');
goog.require('codeshelf.dataentrydialog');
goog.require('codeshelf.templates');
goog.require('codeshelf.view');
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');

/**
 * The current state of dropbox files for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The dropbox view.
 */
codeshelf.dropboxview = function(websession, facility) {

	var websession_ = websession;
	var facility_ = facility;
	var dropboxPane_;

	function createTreeFromTestData(node, data) {
		node.setHtml(data[0]);
		if (data.length > 1) {
			var children = data[1];
			var childNotCollapsible = 3; // Hard coded to reduce randomness.
			for (var i = 0; i < children.length; i++) {
				var child = children[i];
				var childNode = node.getTree().createNode('');

				node.add(childNode);
				createTreeFromTestData(childNode, child);

				if (i == childNotCollapsible && child.length > 1) {
					childNode.setIsUserCollapsible(false);
					childNode.setExpanded(true);
					nonCollapseNode = childNode;
				}

			}
		}
	}

	function websocketCmdCallbackFacility(expectedResponseType) {
		var callback = {
			exec: function(command) {
				if (!command['d'].hasOwnProperty('r')) {
					alert('response has no result');
				} else {
					if (command['t'] == kWebSessionCommandType.OBJECT_FILTER_RESP) {
						for (var i = 0; i < command['d']['r'].length; i++) {
							var object = command['d']['r'][i];

							if (object['className'] === domainobjects.vertex.classname) {
								// Vertex updates.
								if (object['op'] === 'cr') {

								} else if (object['op'] === 'up') {

								} else if (object['op'] === 'dl') {

								}
							}
						}
					} else if (command['t'] == kWebSessionCommandType.OBJECT_CREATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_UPDATE_RESP) {
					} else if (command['t'] == kWebSessionCommandType.OBJECT_DELETE_RESP) {
					}
				}
			}
		}

		return callback;
	}


	/**
	 * The work area editor object we'll return.
	 * @type {Object}
	 * @private
	 */
	var self = {

		doSetupView: function() {

			// Setup the work area view elements.
			var dropdoxView = soy.renderAsElement(codeshelf.templates.dropboxView);
			goog.dom.appendChild(self.getMainPaneElement(), dropdoxView);

			dropboxPane_ = dropdoxView.getElementsByClassName('dropboxPane')[0];

			var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
			treeConfig['cleardotPath'] = '../../images/tree/cleardot.gif';
			var tree = new goog.ui.tree.TreeControl('root', treeConfig);

			var testData = ['Files', [
				['Import', [
					['File 1'],
					['File 2'],
					['File 3'],
					['File 4']
				]],
				['Export', [
					['File 1'],
					['File 2'],
					['File 3']
				]]
			]];


			createTreeFromTestData(tree, testData);

			tree.render(goog.dom.getElement(dropboxPane_));
		},

		open: function() {
			// Create the filter to listen to all vertex updates for this facility.
			var vertexFilterData = {
				'className':     domainobjects.vertex.classname,
				'propertyNames': ['DomainId', 'PosType', 'PosX', 'PosY', 'DrawOrder'],
				'filterClause':  'parentLocation.persistentId = :theId',
				'filterParams':  [
					{ 'name': "theId", 'value': facility_['persistentId']}
				]
			}

			var vertexFilterCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_FILTER_REQ, vertexFilterData);
			websession_.sendCommand(vertexFilterCmd, websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_FILTER_RESP), true);
		},

		close: function() {

		},

		exit: function() {

		},

		doMouseDownHandler: function(event) {

		},

		doGetContentElement: function() {
			return dropboxPane_;
		},

		canDragSelect: function(event) {
			return true;
		},

		doDraggerBefore: function(event) {

		},

		doDraggerStart: function(event) {

		},

		doDraggerDrag: function(event) {

		},

		doDraggerEnd: function(event) {

		},

		doResize: function() {
			self.invalidate();
		},

		doDraw: function() {

		}
	}

	var tools = [
		{id: 'select-tool', title: 'Select', icon: 'select-icon.png'},
		{id: 'delete-tool', title: 'Delete', icon: 'delete-icon.png'}
	]

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.view({doHandleSelection: true, doDragSelect: true, toolbarTools: tools});
	jQuery.extend(view, self);
	self = view;

	return view;
}