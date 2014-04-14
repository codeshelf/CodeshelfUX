/*******************************************************************************
 *    CodeShelfUX
 *    Copyright (c) 2005-2014, Jeffrey B. Williams, All rights reserved
 *    file dialogServices.js author Jon Ranstrom
 *******************************************************************************/

'use strict';
goog.provide('simpleDialogService');

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
			closeButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};

		this.showDialog = function (customDialogDefaults, customDialogOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempDialogDefaults = {};
			var tempDialogOptions = {};

			//Map angular-ui dialog custom defaults to dialog defaults defined in this service
			angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

			//Map dialog.html $scope custom properties to defaults defined in this service
			angular.extend(tempDialogOptions, dialogOptions, customDialogOptions);

			// If the customDialogOptions.closeButtonText is empty string, then find and hide the cancel button.
			// in the html     <button type="button" class="btn" id="thecancelbutton"
			// Not done yet.

			if (!tempDialogDefaults.controller) {
				tempDialogDefaults.controller = function ($scope, $modalInstance) {
					$scope.dialogOptions = tempDialogOptions;
					$scope.ok = function () {
						$modalInstance.close(/*results*/);
						customDialogOptions.callback();
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

		this.showModalDialog = function (customDialogDefaults, customDialogOptions) {
			if (!customDialogDefaults) customDialogDefaults = {};
			customDialogDefaults.backdropClick = false;
			this.showDialog(customDialogDefaults, customDialogOptions);
		};

	}]);

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
	  // url is passed in by the service
      // templateUrl: 'partials/dialog.html',
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
