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

codeshelfApp.controller('MissingRouterCtrl', ['$scope', '$routeParams', 'simpleDialogService',
	function($scope, $routeParams, simpleDialogService) {

		// Demonstration of use of dialog service
		// modal with injections to significantly modify what the dialog is showing and doing.
		// But this dialog is coming

		var dialogOptions = {
			closeButtonText: 'Cancel',
			actionButtonText: 'OK',
			headerText: 'Default Router',
			bodyText: 'Default router was called',
			callback: function () {
				var theLogger = goog.debug.Logger.getLogger('Codeshelf router');
				theLogger.info("Clicked the ok button");
			}
		}
		// If you uncomment this line, you will see that MissingRouterCtrl is called when application starts
		// And, only if you click the ok button, it logs, showing the callback works

		// simpleDialogService.showModalDialog({}, dialogOptions);
		/*
		if (!simpleDialogService.getModalDialogResult({}, dialogOptions)){
			var theLogger = goog.debug.Logger.getLogger('Codeshelf router');
			theLogger.info("did not click the ok button");

		}
		*/

		// Simple!
		// See ListViewDemo for how to invoke an angular service in non-angular code.

	}]);
