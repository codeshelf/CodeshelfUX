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
goog.require('extern.jquery');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.ui.tree.TreeControl');


function linkAccount(persistentId) {
	var dropboxServiceId = persistentId;

	var modalInstance = codeshelf.simpleDlogService.showCustomDialog(
		"partials/link-dropbox-dlog.html",
		"DropboxLinkController as controller",
		{"dropboxServiceId": dropboxServiceId});
	modalInstance.result.then(function(){
		//then do nothing
	});
}
goog.exportSymbol('linkAccount', linkAccount);
/**
 * The current state of edi files for this facility.
 * @param websession The websession used for updates.
 * @param facility The facility to check.
 * @return {Object} The edi view.
 */
codeshelf.ediservicesview = function (websession, facility) {

	var websession_ = websession;
	var facility_ = facility;

	var contextMenu_;


	var self = {

		getViewName: function () {
			return 'EDI Services';
		},

		setupContextMenu: function () {
			contextMenu_ = $("<span class='contextMenu' style='display:none;position:absolute;z-index:20;' />").appendTo(document['body']);
			contextMenu_.bind('mouseleave', function (event) {
				$(this).fadeOut(5);
			});
		},

		// This is mainly demonstration/experiment. Ancestor hierarchyListView has a close(). Which is called?
		close: function() {
			var theLogger = goog.debug.Logger.getLogger('EDI Services view');
			theLogger.info("Called this close");
		},

		doContextMenu: function (event, item, column) {
			if (event && event.stopPropagation)
				event.stopPropagation();

			event.preventDefault();
			contextMenu_.empty();
			var persistentId = item['persistentId'];
			var line = $('<li><a href="javascript:linkAccount(\'' + persistentId + '\')">Link Dropbox</a></li>').appendTo(contextMenu_);
			line.data("option", "link");
			contextMenu_
				.css('top', event.pageY - 10)
				.css('left', event.pageX - 10)
				.fadeIn(5);
		}
	};

	var serviceFilter = 'parent.persistentId = :theId';
	var serviceFilterParams = [
		{ 'name': 'theId', 'value': facility_['persistentId']}
	];

	var hierarchyMap = [];
	hierarchyMap[0] = { className: domainobjects['DropboxService']['className'], linkProperty: 'parent', filter: serviceFilter, filterParams: serviceFilterParams, properties: domainobjects['DropboxService']['properties'] };
	hierarchyMap[1] = { className: domainobjects['EdiDocumentLocator']['className'], linkProperty: 'parent', filter: undefined, filterParams: undefined, properties: domainobjects['EdiDocumentLocator']['properties'] };

	// We want this view to extend the root/parent view, but we want to return this view.
	var view = codeshelf.hierarchylistview(websession_, domainobjects['DropboxService'], hierarchyMap, 0);
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
	var data = {
		'className': domainobjects['DropboxService']['className'],
		'persistentId': this.scope_['dropboxServiceId'],
		'methodName': 'startLink',
		'methodArgs': [
		]
	};
	var startLinkDropboxCmd = this.websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
	this.websession_.sendCommand(startLinkDropboxCmd, this.startLinkCallback_(), true);
};

/**
 * @export
 */
codeshelfApp.DropboxLinkController.prototype.ok = function(){
	// Call Facility.finishLinkDropbox();
	var accessCode = this.scope_['dropbox']['accessCode'];
	var data = {
		'className': domainobjects['DropboxService']['className'],
		'persistentId': this.scope_['dropboxServiceId'],
		'methodName': 'finishLink',
		'methodArgs': [
			{'name': 'code', 'value': accessCode, 'classType': 'java.lang.String'}
		]
	};
	var finishLinkDropboxCmd = this.websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
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
		exec: function (command) {
			if (!command['data'].hasOwnProperty('results')) {
				alert('response has no result');
			} else {
				if (command['type'] === kWebSessionCommandType.OBJECT_METHOD_RESP) {
					var url = command['data']['results'];
					window.open(url, '_blank');
					window.focus();
				}
			}
		}
	};
	return callback;
};

codeshelfApp.DropboxLinkController.prototype.finishLinkCallback_ = function(modalInstance) {
	var callback = {
		exec: function (command) {
			if (!command['data'].hasOwnProperty('results')) {
				alert('response has no result');
			} else {
				if (command['type'] === kWebSessionCommandType.OBJECT_METHOD_RESP) {
					var result = command['data']['results'];
					if (result === true) {
						modalInstance.close();
					}
				}
			}
		}
	};
	return callback;
};

angular.module('codeshelfApp').controller('DropboxLinkController', ['$scope', '$modalInstance', 'websession', 'data', codeshelfApp.DropboxLinkController]);
