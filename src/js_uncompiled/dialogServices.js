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
//  this.scope_ = $rootScope;
	this.modal_ = $modal;
	this.q_ = $q;
};

/**
 * @return {Promise}  A promise that is resolved when the transition finishes.
 * @export
 */
codeshelfApp.SimpleDialogService.prototype.open = function(dialogOptions) {
	var modalOptions = {};
	modalOptions['backdrop'] = true;
	modalOptions['keyboard'] = true;
	modalOptions['backdropClick'] = true;
	modalOptions['dialogFade'] = true;
	modalOptions['templateUrl'] = 'partials/dialog.html';
//	modalOptions['scope'] = this.scope;
	modalOptions['controller'] = codeshelfApp.SimpleDialogCtrl;

	modalOptions['resolve'] = {
		'dialogOptions' : function() {
			return dialogOptions;
		}
	};

	this.log_.info("about to open");
	var modalInstance = this.modal_.open(modalOptions);
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
codeshelfApp.SimpleDialogCtrl = function($scope, $modalInstance, dialogOptions){
	this.modalInstance_ = $modalInstance;
	this.scope_ = $scope;
	var defaultDialogOptions = {};
	defaultDialogOptions['cancelButtonVisibility'] = 'visible';
	defaultDialogOptions['cancelButtonText'] = "Close";
	defaultDialogOptions['actionButtonText'] = "OK";
	defaultDialogOptions['headerText'] = "Proceed?";
	defaultDialogOptions['bodyText'] = "Perform this action?";

	var options = angular.extend({}, defaultDialogOptions, dialogOptions);
	options['cancelButtonVisibility'] = (options['cancelButtonText'] != "") ? "visible" : "hidden";

	$scope['dialogOptions'] = options;
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

angular.module('codeshelfApp').controller('SimpleDialogCtrl', ['$scope', '$modalInstance', 'dialogOptions', codeshelfApp.SimpleDialogCtrl]);


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

		showModalDialog: function(customDialogDefaults, customDialogOptions) {
			var injector = angular.injector(['ng', 'codeshelfApp']);
			injector.invoke(['simpleDialogService', function(simpleDialogService){
				// logs to devTools console only
				console.log("Opening"); // log this before  the dialog opens
				var response = simpleDialogService.open(customDialogOptions);
				response.then(function() {
					console.log("doing something"); // log this only if ok was clicked.
					// Does not log for cancel. That is good. In principle, this can be used to determine whether to
					// close the list demo view window, or similar cases.

					// By the calling structure, the dialog still closes on cancel, which is also good.

				// return response; // Paul: do we need to return the promise? (Does seem to help in current code structure.)
				});
				// return response; // Does not work here either.
			}]);

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
