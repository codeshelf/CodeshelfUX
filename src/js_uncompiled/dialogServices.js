/*******************************************************************************
 *    CodeShelfUX
 *    Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *    file dialogServices.js author Jon Ranstrom
 *******************************************************************************/

'use strict';
goog.require('codeshelf.controllers');
goog.provide('simpleDialogService');
goog.provide('codeshelf.simpleDlogService');
goog.provide('adhocDialogService');

/* From dWahlin  Building an Angular Dialog Service */
/* modified to use ModalInstanceCtrl
* Gives easy to inject header, body, cancel, ok buttons. And easy callback for what happens from ok.
* Needed improvement:  optionally hide the cancel button.
*/

/**
 * @param {!Object} $modal Angular UI Bootstrap service.
 * @param {!angular.Q} $q Angular UI Bootstrap service.
 * @constructor
 * @export
 * @ngInject
 */
codeshelfApp.SimpleDialogService = function($log, $modal, $q) {
  /* PJM need to figure out what @type {!angular.$modal} */
	this.log_ = $log;
	this.modal_ = $modal;
	this.q_ = $q;
};

/**
 * @return {Promise}  A promise that is resolved when the transition finishes.
 * @export
 */
codeshelfApp.SimpleDialogService.prototype.open = function(modalOptions, dialogScope) {
	var defaultModalOptions = {};
	defaultModalOptions['backdrop'] = true;
	defaultModalOptions['keyboard'] = true;
	defaultModalOptions['backdropClick'] = true;
	defaultModalOptions['dialogFade'] = true;
	defaultModalOptions['templateUrl'] = 'partials/dialog.html';
	defaultModalOptions['controller'] = codeshelfApp.SimpleDialogCtrl;
	var mergedModalOptions = angular.extend({}, defaultModalOptions, modalOptions);


	var defaultDialogScope = {};
	defaultDialogScope['cancelButtonVisibility'] = 'visible';
	defaultDialogScope['cancelButtonText'] = "Close";
	defaultDialogScope['actionButtonText'] = "OK";
	defaultDialogScope['headerText'] = "Proceed?";
	defaultDialogScope['bodyText'] = "Perform this action?";

	var mergedDialogScope = angular.extend({}, defaultDialogScope, dialogScope);
	mergedDialogScope['cancelButtonVisibility'] = (mergedDialogScope['cancelButtonText'] != "") ? "visible" : "hidden";

	modalOptions['resolve'] = {
		'dialogScope' : function() {
			return mergedDialogScope;
		}
	};


	var modalInstance = this.modal_.open(mergedModalOptions);
	return modalInstance.result;
};

/**
 * @return {Promise}  A promise that is resolved when the transition finishes.
 * @export
 */
codeshelfApp.SimpleDialogService.prototype.openCustom = function(templateUrl, controller, data, opts) {
	var defaultModalOptions = {};
	defaultModalOptions['backdrop'] = true;
	defaultModalOptions['keyboard'] = true;
	defaultModalOptions['backdropClick'] = true;
	defaultModalOptions['dialogFade'] = true;
	defaultModalOptions['templateUrl'] = templateUrl;
	defaultModalOptions['controller'] = controller;
	var mergedModalOptions = angular.extend({}, defaultModalOptions, opts);


	var defaultDialogScope = {};
	defaultDialogScope['cancelButtonVisibility'] = 'visible';
	defaultDialogScope['cancelButtonText'] = "Close";
	defaultDialogScope['actionButtonText'] = "OK";
	defaultDialogScope['headerText'] = "Proceed?";
	defaultDialogScope['bodyText'] = "Perform this action?";

	var mergedDialogScope = angular.extend({}, defaultDialogScope, data);
	mergedDialogScope['cancelButtonVisibility'] = (mergedDialogScope['cancelButtonText'] != "") ? "visible" : "hidden";

	mergedModalOptions['resolve'] = {
		'dialogScope' : function() { return mergedDialogScope;}
	};


	var modalInstance = this.modal_.open(mergedModalOptions);
	return modalInstance.result;
};


angular.module('codeshelfApp').service('simpleDialogService', ['$log', '$modal', '$q', codeshelfApp.SimpleDialogService]);

/**
 *  @param {!angular.Scope} $scope
 *  @param  $modalInstance
 *  @constructor
 *  @ngInject
 *  @export
 */
codeshelfApp.SimpleDialogCtrl = function($scope, $modalInstance, dialogScope){
	this.scope_ = $scope;
	this.modalInstance_ = $modalInstance;
	$scope['dialogScope'] = dialogScope;
	$scope['controller'] = this;
};

/**
 * @export
 */
codeshelfApp.SimpleDialogCtrl.prototype.ok = function(){
	this.modalInstance_.close();
};

/**
 * @export
 */
codeshelfApp.SimpleDialogCtrl.prototype.cancel = function(){
	this.modalInstance_['dismiss'](); //not sure why this minifies but close() does not
};

angular.module('codeshelfApp').controller('SimpleDialogCtrl', ['$scope', '$modalInstance', 'dialogScope', codeshelfApp.SimpleDialogCtrl]);


/**
 * Implements an arbitrary field update on existing database object
 * @param {string}
 *            className the name of the remote data class that this field edits.
 * @param {string}
 *            classProperty the name of the remote data class property that this
 *            field edits.
 * @param {string}
 *            classPersistenceId the GUID of the class object instance that this
 *            field edits.
 */
codeshelf.simpleDlogService = (function() {
	// public API
	return {

		showModalDialog: function(header, msg, opts) {
			var response;
			var injector = angular.injector(['ng', 'codeshelfApp', 'dialogs.main', 'ngSanitize']);
			injector.invoke(['dialogs', function(dialogs){
				// logs to devTools console only
				console.log("Opening"); // log this before  the dialog opens
				var promise = dialogs.confirm(header, msg, opts);
				response = promise.result;
			}]);
			return response;

		},
		showNotifyDialog: function(header, msg, opts) {
			var response;
			var injector = angular.injector(['ng', 'codeshelfApp', 'dialogs.main', 'ngSanitize']);
			injector.invoke(['dialogs', function(dialogs){
				// logs to devTools console only
				console.log("Opening"); // log this before  the dialog opens
				var promise = dialogs.notify(header, msg, opts);
				response = promise.result;
			}]);
			return response;

		},

		showCustomDialog: function(templateUrl, controller, data, opts) {

			var response;
			var injector = angular.injector(['ng', 'codeshelfApp', 'dialogs.main', 'ngSanitize']);
			injector.invoke(['dialogs', function(dialogs){
				// logs to devTools console only
				console.log("Opening"); // log this before  the dialog opens
				response = dialogs.create(templateUrl, controller, data, opts);
			}]);
			return response;
		}

	};
})();

/* ************************** */

/*
 * A clone of the simpleDialogService, but making let the custom partial html do most of the work.
 */

/*
 * adhocDialogService
 * @constructor
 * @export
 * @ngInject
 */

angular.module('codeshelfApp').service('adhocDialogService', ['$modal',
	function ($modal) {
	/*
		var dialogDefaults = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			dialogFade: true,
			templateUrl: 'partials/dialog.html'
		};
	*/
		var dialogDefaults = {};
		dialogDefaults ['backdrop'] = true;
		dialogDefaults ['keyboard'] = true;
		dialogDefaults ['backdropClick'] = true;
		dialogDefaults ['dialogFade'] = true;
		dialogDefaults ['templateUrl'] = "partials/dialog.html";

		/*
		var adhocDialogOptions = {
			cancelButtonText: 'Cancel',
			actionButtonText: 'OK',
			passedInUrl: 'partials/dialog.html'
		}; */
		var adhocDialogOptions = {}
			adhocDialogOptions['cancelButtonText']= "Cancel";
			adhocDialogOptions['actionButtonText']= "OK";
			adhocDialogOptions['passedInUrl'] = "partials/dialog.html";

		this.showDialog = function (customDialogDefaults, customAdhocDialogOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempDialogDefaults = {};
			var tempAdhocDialogOptions = {};

			//Map angular-ui dialog custom defaults to dialog defaults defined in this service
			angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

			//Map dialog.html $scope custom properties to defaults defined in this service
			angular.extend(tempAdhocDialogOptions, adhocDialogOptions, customAdhocDialogOptions);

			tempDialogDefaults['templateUrl'] = customAdhocDialogOptions['passedInUrl'];

			if (!tempDialogDefaults.controller) {
				tempDialogDefaults.controller = function ($scope, $modalInstance) {
					$scope.adhocDialogOptions = tempAdhocDialogOptions;
					$scope.ok = function () {
						$modalInstance.close(/*results*/);
						customAdhocDialogOptions['callback']();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				};
			}

			var modalInstance = $modal.open(tempDialogDefaults);

			modalInstance.result.then(function (selectedItem) {
//				$scope.selected = selectedItem;
			}, function () {
//				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		this['showModalDialog'] = function (customDialogDefaults, customAdhocDialogOptions) {
			if (!customDialogDefaults) customDialogDefaults = {};
			customDialogDefaults['backdropClick'] = false;
			this.showDialog(customDialogDefaults, customAdhocDialogOptions);
		};

	}]);
