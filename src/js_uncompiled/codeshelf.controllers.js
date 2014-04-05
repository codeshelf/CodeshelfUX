/*******************************************************************************
 *    CodeShelfUX
 *    Copyright (c) 2005-2013, Jeffrey B. Williams, All rights reserved
 *  $Id: application.js,v 1.24 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/

'use strict';
goog.provide('codeshelf.controllers');
goog.require('codeshelf.websession');
// goog.require('workAreaModalCtrlFile');


var codeshelfApp = angular.module('codeshelfApp', [
		'ui.bootstrap', 'ngRoute'
	]).factory('$websession', function () {
		return application.getWebsession();
	})
/*.config(['$routeProvider',
 function($routeProvider) {
 $routeProvider.
 when('/login', {
 templateUrl: 'partials/login.html',
 controller: 'LoginCtrl'
 }).
 when('/main', {
 templateUrl: 'partials/main.html',
 controller: 'MainlCtrl'
 }).
 otherwise({
 redirectTo: '/login'
 });
 }])
 */;

var WorkAreaCtrl = codeshelfApp.controller('WorkAreaCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

	$scope.open = function (facilityContext, aisleShape) {
		//TODO facility might be able to come from a parent controller
		var modalInstance = $modal.open({
			/*JR */
			/*'templateUrl': 'createAisleModalContent.html',*/
			'templateUrl': 'partials/aisle-editor.html',
			'controller': 'WorkAreaModalCtrl',
			'resolve': {
				'facilityContext': function () {
					return facilityContext;
				},
				'aisleShape': function () {
					return aisleShape;
				}
			}
		});

		modalInstance.result.then(function (aisleData) {
			$log.info('Modal saved at: ' + new Date());
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	};

}]);


var WorkAreaModalCtrl = codeshelfApp.controller('WorkAreaModalCtrl', ['$scope', '$modalInstance', '$log', '$websession', 'facilityContext', 'aisleShape', function ($scope, $modalInstance, $log, $websession, facilityContext, aisleShape) {

	var consts = {};
	Object.defineProperty(consts, 'feetInMeters', {'value': 0.3048,
		'writable': false,
		'enumerable': true,
		'configurable': true});

	$scope.aisleForm = {};
	$scope.aisleForm = {
		messages: []
	};

	$scope.websession = $websession;
	$scope.facilityContext = facilityContext;
	$scope.aisleShape = aisleShape;

	$scope['ok'] = function () {
		var aisle = $scope['convertData'](this['aisleForm']);
		$log.info('aisle obj: ' + angular.toJson(aisle));
		$scope.sendCreateAisleCommand(aisle,
			function onSuccess(lastAisleData) {
				$modalInstance.close(lastAisleData);  //communicates to the promise
			},
			function onError(errorResult) {
				var responseMessages = errorResult['messages'];
				$scope.aisleForm.messages = responseMessages;
			});

		//don't close instance until successful
		//
	};

	$scope['cancel'] = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope['convertData'] = function (aisleForm) {
		var aisle = {};
		//TODO this should be a proper OO method on an aisle shape since the point and the pixelsPerMeter come from outside in the shape
		aisle.xOriginMeters = $scope.pixelsToMeter($scope.aisleShape.dragStartPoint.x);
		aisle.yOriginMeters = $scope.pixelsToMeter($scope.aisleShape.dragStartPoint.y);

		aisle.aisleId = aisleForm['aisleId'];
		aisle.bayHeight = aisleForm['bayHeight'] * consts['feetInMeters'];
		aisle.bayWidth = aisleForm['bayWidth'] * consts['feetInMeters'];
		aisle.bayDepth = aisleForm['bayDepth'] * consts['feetInMeters'];
		aisle.baysHigh = aisleForm['baysHigh'];
		aisle.baysLong = aisleForm['baysLong'];
		aisle.controllerId = aisleForm['controllerId'];
		aisle.isLeftHandBay = aisleForm['isLeftHandBay'] == "true";

		aisle.runInXDim = true;
		if ($scope.aisleShape.rectangle.width < $scope.aisleShape.rectangle.height) {
			aisle.runInXDim = false;
		}
		return aisle;
	};

	$scope.pixelsToMeter = function (pixels) {
		return (pixels / $scope.aisleShape.pixelsPerMeter);
	};

	$scope.sendCreateAisleCommand = function (aisle, onSuccess, onError) {

		var anchorPoint = {'posTypeEnum': 'METERS_FROM_PARENT', 'x': aisle.xOriginMeters, 'y': aisle.yOriginMeters, 'z': 0.0};
		var protoBayPoint = {'posTypeEnum': 'METERS_FROM_PARENT', 'x': aisle.bayWidth, 'y': aisle.bayDepth, 'z': aisle.bayHeight};
		var data = {
			'className': $scope.facilityContext['className'],
			'persistentId': $scope.facilityContext['facility']['persistentId'],
			'methodName': 'createAisle',
			'methodArgs': [
				{ 'name': 'inAisleId', 'value': aisle.aisleId.toUpperCase(), 'classType': 'java.lang.String'},
				{ 'name': 'anchorPoint', 'value': anchorPoint, 'classType': 'com.gadgetworks.codeshelf.model.domain.Point'},
				{ 'name': 'protoBayPoint', 'value': protoBayPoint, 'classType': 'com.gadgetworks.codeshelf.model.domain.Point'},
				{ 'name': 'inProtoBaysHigh', 'value': aisle.baysHigh, 'classType': 'java.lang.Integer'},
				{ 'name': 'inProtoBaysLong', 'value': aisle.baysLong, 'classType': 'java.lang.Integer'},
				{ 'name': 'inControllerId', 'value': aisle.controllerId.toLowerCase(), 'classType': 'java.lang.String'},
				{ 'name': 'inRunInXDir', 'value': aisle.runInXDim, 'classType': 'java.lang.Boolean'},
				{ 'name': 'inLeftHandBay', 'value': aisle.isLeftHandBay, 'classType': 'java.lang.Boolean'}
			]
		};

		var createAisleCmd = $scope.websession.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
		var callback = {
			'exec': function (response) {
				$scope.$apply(function () {
					if (response['data']['status'] == "ERROR") {
						var errorResult = response['data']['results'];
						onError(errorResult);
					}
					else {
						var dataResult = response['data']['results'];
						onSuccess(dataResult);
					}
				});
			}
		};
		$scope.websession.sendCommand(createAisleCmd, callback, true);
	};
}]);



codeshelfApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
/*
			when('/WorkAreaCtrl', {
				'templateUrl': 'partials/aisle-editor.html',
				'controller': 'WorkAreaModalCtrl'
			}).
*/
			when('/MissingRouter', {
				templateUrl: 'partials/missing-router.html',
				controller: 'MissingRouterCtrl'
			}).
			otherwise({
				redirectTo: '/MissingRouter'
			});
	}]);

/* demonstrating
1) controller default routing
2) logging to main log window
3) using the dWahlin dialog service below
 */
//codeshelfApp.controller('MissingRouterCtrl', ['$scope', '$routeParams', /* 'dialogService',*/
//	function($scope, $routeParams/*, dialogService*/) {
codeshelfApp.controller('MissingRouterCtrl', ['$scope', '$routeParams', 'dialogService',
	function($scope, $routeParams, dialogService) {
		var theLogger = goog.debug.Logger.getLogger('Codeshelf router');
		theLogger.info("routed to  default controller MissingRouterCtrl");

			/* comment out later, but keep the lines to show the pattern */

		// modal using the default text and buttons
		// Paul: uncomment this line
//		dialogService.showModalDialog();
		// Paul: ui.bootstrap should have MessageBoxController, but our does not. Wrong version?
		// Also, to use, it should need to be like this:
		// codeshelfApp.controller('MissingRouterCtrl', ['$scope', '$routeParams', 'dialogService',
			// function($scope, $routeParams, dialogService) {
		// But if you add that, it no longer executes the logger line

		// Wednesday, August 21, 2013 1:38 PM by Mike Erickson
		// It should be noted, this code will ONLY work Bootstrap 2.3.x as the ui.bootstrap service has not been
		// updated as of the time of this comment to work with Bootstrap 3.x



		// simple use with pursposeful text.
		// dialogService.showMessage('Record not Found!', 'The record you were looking for cannot be found.');

		// modal with injections to significantly modify what the dialog is showing and doing.

		var dialogOptions = {
			closeButtonText: 'Cancel',
			actionButtonText: 'Delete Timesheet',
			headerText: 'Delete Timesheet?',
			bodyText: 'Are you sure you want to delete this timesheet?',
			callback: function () {}
		}
		dialogService.showModalDialog({}, dialogOptions);
	}]);

/* From dWahlin  Building an Angular Dialog Service */
/*
 This relies on a template built-into Angular UI Bootstrap named template/dialog/message.html
 and a controller that’s also built-in named MessageBoxController.
 NOT PRESENT?
 */


angular.module('codeshelfApp').service('dialogService', ['$modal',
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

			if (!tempDialogDefaults.controller) {
				tempDialogDefaults.controller = function ($scope, $modalInstance) {
					$scope.dialogOptions = tempDialogOptions;
					$scope.ok = function () {
						$modalInstance.close(/*results*/);
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

		this.showMessage = function (title, message, buttons) {
			var defaultButtons = [{result:'ok', label: 'OK', cssClass: 'btn-primary'}];
			var msgBox = new $modal.open({
				dialogFade: true,
				templateUrl: 'template/modal/message.html',
				controller: 'MessageBoxController',
				resolve:
				{
					model: function () {
						return {
							title: title,
							message: message,
							buttons: buttons == null ? defaultButtons : buttons
						};
					}
				}
			});
			return msgBox.open();
		};

	}]);

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'partials/dialog.html',
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
