/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: ediServicesView.js,v 1.16 2013/04/07 21:33:00 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.ediservicesview');
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

		'getViewName': function () {
			return 'EDI Services';
		},

		linkAccount: function(item) {
			if (item['className'] == 'DropboxService') {
				var dropboxServiceId = item['persistentId'];

				var modalInstance = codeshelf.simpleDlogService.showCustomDialog(
					"partials/link-dropbox-dlog.html",
					"DropboxLinkController as controller",
					{"dropboxServiceId": dropboxServiceId});
					modalInstance.result.then(function(){
						//then do nothing
					});
			} else if (item['className'] == 'IronMqService'){
				var modalInstance = codeshelf.simpleDlogService.showCustomDialog(
					"partials/ironmq-credentials.html",
					"IronMqCredentialsController as controller",
					{"ironMqService": item},
					{"windowClass" : "modal-window-ironmqcredentials"});

				modalInstance.result.then(function(){


				});

			}
		}

	};
	var contextDefs = [
		{
			"label": "Link Service",
			"permission": "edit:edit",
			"action": function(itemContext) {
				self.linkAccount(itemContext);
			}
		}
	];

	var serviceFilter = 'allByParent';
	var serviceFilterParams = [
		{ 'name': 'parentId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { "className": domainobjects['EdiServiceABC']['className'], "linkProperty": 'parent', "filter": serviceFilter, "filterParams": serviceFilterParams, "properties": domainobjects['EdiServiceABC']['properties'], "contextMenuDefs" : contextDefs };

	var viewOptions = {
		'editable':  true,
		// -1 for non-dragable. Single level view with normal sort rules
		'draggableHierarchyLevel': -1
	};

	var view = codeshelf.hierarchylistview(websession_, domainobjects['EdiServiceABC'], hierarchyMap,viewOptions);
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
	var className = "DropboxService";
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

	var className = "DropboxService";
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

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.IronMqCredentialsController = function($scope, $modalInstance, websession, data){

	$scope['ironMqService'] = data['ironMqService'];
	$scope['credentials'] = {
		"projectId" : "",
		"token" : ""
	};
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	this.websession_ = websession;
};


/**
 * @export
 */
codeshelfApp.IronMqCredentialsController.prototype.ok = function(){
	var ironMqService = this.scope_['ironMqService'];
	var credentials = this.scope_['credentials'];
	var args = [{'name': 'projectId', 'value': credentials['projectId'], 'classType': 'java.lang.String'},
				{'name': 'token', 'value': credentials['token'], 'classType': 'java.lang.String'}
			   ];
	var modalInstance = this.modalInstance_;
	this.websession_.callMethod(ironMqService, "IronMqService", "storeCredentials", args).then(function() {
		modalInstance.close();
	});
};

/**
 * @export
 */
codeshelfApp.IronMqCredentialsController.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};
angular.module('codeshelfApp').controller('IronMqCredentialsController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.IronMqCredentialsController]);
