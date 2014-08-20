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

	var self = {

		getViewName: function () {
			return 'EDI Services';
		},

		linkAccount: function(item) {
			var dropboxServiceId = item['persistentId'];

			var modalInstance = codeshelf.simpleDlogService.showCustomDialog(
				"partials/link-dropbox-dlog.html",
				"DropboxLinkController as controller",
				{"dropboxServiceId": dropboxServiceId});
				modalInstance.result.then(function(){
					//then do nothing
				});
		}

	};
	var contextDefs = [
		{
			"label": "Link Dropbox",
			"permission": "edit:edit",
			"action": function(itemContext) {
				self.linkAccount(itemContext);
			}
		}
	];

	var serviceFilter = 'parent.persistentId = :theId';
	var serviceFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['DropboxService']['className'], "linkProperty": 'parent', "filter": serviceFilter, "filterParams": serviceFilterParams, "properties": domainobjects['DropboxService']['properties'], "contextMenuDefs" : contextDefs };
	hierarchyMap[1] = { "className": domainobjects['EdiDocumentLocator']['className'], "linkProperty": 'parent', "filter": undefined, "filterParams": undefined, "properties": domainobjects['EdiDocumentLocator']['properties'] };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': 0
	};

	var view = codeshelf.hierarchylistview(websession_, domainobjects['DropboxService'], hierarchyMap,viewOptions);
	jQuery.extend(view, self);
	self = view;

	return view;
};


/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.DropboxLinkController = function($scope, $modalInstance, websession, data){

	$scope['dropboxServiceId'] = data['dropboxServiceId'];
	$scope['dropbox'] = {};
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
};


/**
 * @export
 */
codeshelfApp.DropboxLinkController.prototype.link = function(){
	// Call Facility.startLinkDropbox();
	/*
	var data = {
		'className': domainobjects['DropboxService']['className'],
		'persistentId': this.scope_['dropboxServiceId'],
		'methodName': 'startLink',
		'methodArgs': [
		]
	};
	var startLinkDropboxCmd = this.websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
	*/
	var className = domainobjects['DropboxService']['className'];
	var persistentId = this.scope_['dropboxServiceId'];
	var startLinkDropboxCmd = this.websession_.createObjectMethodRequest(className, persistentId,'startLink',[]);
	this.websession_.sendCommand(startLinkDropboxCmd, this.startLinkCallback_(), true);
};

/**
 * @export
 */
codeshelfApp.DropboxLinkController.prototype.ok = function(){
	// Call Facility.finishLinkDropbox();
	var accessCode = this.scope_['dropbox']['accessCode'];
	/*
	var data = {
		'className': domainobjects['DropboxService']['className'],
		'persistentId': this.scope_['dropboxServiceId'],
		'methodName': 'finishLink',
		'methodArgs': [
			{'name': 'code', 'value': accessCode, 'classType': 'java.lang.String'}
		]
	};
	var finishLinkDropboxCmd = this.websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
	*/
	var className = domainobjects['DropboxService']['className'];
	var persistentId = this.scope_['dropboxServiceId'];
	var args = [{'name': 'code', 'value': accessCode, 'classType': 'java.lang.String'}];
	var finishLinkDropboxCmd = this.websession_.createObjectMethodRequest(className, persistentId,'finishLink',args);
	this.websession_.sendCommand(finishLinkDropboxCmd, this.finishLinkCallback_(this.modalInstance_), true);
};

/**
 * @export
 */
codeshelfApp.DropboxLinkController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};


codeshelfApp.DropboxLinkController.prototype.startLinkCallback_ = function() {
	var callback = {
		exec: function (type,command) {
			if (type === kWebSessionCommandType.OBJECT_METHOD_RESP) {
				var url = command['results'];
				window.open(url, '_blank');
				window.focus();
			}
		}
	};
	return callback;
};

codeshelfApp.DropboxLinkController.prototype.finishLinkCallback_ = function(modalInstance) {
	var callback = {
		exec: function (type,command) {
			if (type === kWebSessionCommandType.OBJECT_METHOD_RESP) {
				var result = command['results'];
				if (result === true) {
					modalInstance.close();
				}
			}
		}
	};
	return callback;
};

angular.module('codeshelfApp').controller('DropboxLinkController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.DropboxLinkController]);
