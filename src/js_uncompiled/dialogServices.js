/*******************************************************************************
 *    CodeShelfUX
 *    Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *    file dialogServices.js author Jon Ranstrom
 *******************************************************************************/

'use strict';
goog.require('codeshelf.controllers');
goog.provide('simpleDialogService');
goog.provide('adhocDialogService');

/* From dWahlin  Building an Angular Dialog Service */
/* modified to use ModalInstanceCtrl
* Gives easy to inject header, body, cancel, ok buttons. And easy callback for what happens from ok.
* Needed improvement:  optionally hide the cancel button.
*/

angular.module('codeshelfApp').service('simpleDialogService', ['$modal',
	function ($modal) {
		var dialogDefaults = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			dialogFade: true,
			templateUrl: 'partials/dialog.html'
		};

		var dialogOptions = {
			cancelButtonVisibility: 'hidden',
			cancelButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};

		var dialogResults = {
			userClickedOk: false
		}

		this.showDialog = function (customDialogDefaults, customDialogOptions, customDialogResults) {
			//Create temp objects to work with since we're in a singleton service
			var tempDialogDefaults = {};
			var tempDialogOptions = {};
			var tempDialogResults = {};

			//Map angular-ui dialog custom defaults to dialog defaults defined in this service
			angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

			//Map dialog.html $scope custom properties to defaults defined in this service
			angular.extend(tempDialogOptions, dialogOptions, customDialogOptions);

			//We do not expect use to pass in result. This is a way to get the information out.
			angular.extend(tempDialogResults, dialogResults, customDialogResults);

			// If the customDialogOptions.cancelButtonText is empty string, there is visibility, or vice-versa, report error
			// Changing the value here does not seem to translate to the dialog
			// customDialogOptions.cancelButtonVisibility = (!customDialogOptions.closeButtonText || customDialogOptions.closeButtonText == '')? 'hidden' : '';


			if (!tempDialogDefaults.controller) {
				tempDialogDefaults.controller = function ($scope, $modalInstance) {
					$scope.dialogOptions = tempDialogOptions;
					$scope.ok = function () {
						dialogResults.userClickedOk = true;
						$modalInstance.close(/*results*/);
						customDialogOptions.callback();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				};
			}

			var modalInstance = $modal.open(tempDialogDefaults);

			// attempt to hide cancel button here.


			modalInstance.result.then(function (selectedItem) {
//				$scope.selected = selectedItem;
			}, function () {
//				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		this.showModalDialog = function (customDialogDefaults, customDialogOptions) {
			if (!customDialogDefaults) customDialogDefaults = {};
			customDialogDefaults.backdropClick = false;
			this.showDialog(customDialogDefaults, customDialogOptions);
		};

		// Paul: this does not work at all. Problems include:
		// customDialogResult is an empty proto object. Does not know it has a field for userClickedOk.
		// Would not matter anyway. This executes and returns immediately. It does not wait for user to click or dismiss.
		// So how do you call it?  See commented out call to getModalDialogResult() in codeshelf.controllers.js
		// We have a working callback for when the ok is clicked, and modal dismisses when clicked. But it is hard to code
		// If (user clicked the ok) {}
		// A good prototype would be alert/ask on clicking the close button. But I did not want to use the more
		// complicated injector for this first effort.

		this.getModalDialogResult = function (customDialogDefaults, customDialogOptions, customDialogResults) {
			if (!customDialogDefaults) customDialogDefaults = {};
			if (!customDialogResults) customDialogResults = {};
			customDialogDefaults.backdropClick = false;
			this.showDialog(customDialogDefaults, customDialogOptions, customDialogResults);
			return (customDialogResults.userClickedOk);
		};

	}]);

/* ************************** */

/**
 * A clone of the simpleDialogService, but making let the custom partial html do most of the work.
 */

angular.module('codeshelfApp').service('adhocDialogService', ['$modal',
	function ($modal) {
		var dialogDefaults = {
			backdrop: true,
			keyboard: true,
			backdropClick: true,
			dialogFade: true,
			templateUrl: 'partials/dialog.html'
		};

		var adhocDialogOptions = {
			cancelButtonText: 'Cancel',
			actionButtonText: 'OK',
			passedInUrl: 'partials/dialog.html'
		};

		this.showDialog = function (customDialogDefaults, customAdhocDialogOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempDialogDefaults = {};
			var tempAdhocDialogOptions = {};

			//Map angular-ui dialog custom defaults to dialog defaults defined in this service
			angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

			//Map dialog.html $scope custom properties to defaults defined in this service
			angular.extend(tempAdhocDialogOptions, adhocDialogOptions, customAdhocDialogOptions);

			tempDialogDefaults.templateUrl = customAdhocDialogOptions.passedInUrl;

			if (!tempDialogDefaults.controller) {
				tempDialogDefaults.controller = function ($scope, $modalInstance) {
					$scope.adhocDialogOptions = tempAdhocDialogOptions;
					$scope.ok = function () {
						$modalInstance.close(/*results*/);
						customAdhocDialogOptions.callback();
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

		this.showModalDialog = function (customDialogDefaults, customAdhocDialogOptions) {
			if (!customDialogDefaults) customDialogDefaults = {};
			customDialogDefaults.backdropClick = false;
			this.showDialog(customDialogDefaults, customAdhocDialogOptions);
		};

	}]);
/* ************************** */

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
