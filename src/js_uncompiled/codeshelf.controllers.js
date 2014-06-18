/*******************************************************************************
 *    CodeShelfUX
 *    Copyright (c) 2005-2013, Jeffrey B. Williams, All rights reserved
 *  $Id: application.js,v 1.24 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/

'use strict';
goog.provide('codeshelf.controllers');
goog.require('codeshelf.websession');

var WorkAreaCtrl = angular.module('codeshelfApp').controller('WorkAreaCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

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


var WorkAreaModalCtrl = angular.module('codeshelfApp').controller('WorkAreaModalCtrl', ['$scope', '$modalInstance', '$log', 'websession', 'facilityContext', 'aisleShape', function ($scope, $modalInstance, $log, websession, facilityContext, aisleShape) {

	var consts = {};
	Object.defineProperty(consts, 'feetInMeters', {'value': 0.3048,
		'writable': false,
		'enumerable': true,
		'configurable': true});

	$scope.aisleForm = {};
	$scope.aisleForm = {
		messages: []
	};

	$scope.websession = websession;
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
		aisle['xOriginMeters'] = $scope.pixelsToMeter($scope.aisleShape.dragStartPoint.x);
		aisle['yOriginMeters'] = $scope.pixelsToMeter($scope.aisleShape.dragStartPoint.y);

		aisle['aisleId'] = aisleForm['aisleId'];
		aisle['bayHeight'] = aisleForm['bayHeight'] * consts['feetInMeters'];
		aisle['bayWidth'] = aisleForm['bayWidth'] * consts['feetInMeters'];
		aisle['bayDepth'] = aisleForm['bayDepth'] * consts['feetInMeters'];
		aisle['baysHigh'] = aisleForm['baysHigh'];
		aisle['baysLong'] = aisleForm['baysLong'];
		aisle['controllerId'] = aisleForm['controllerId'];
		aisle['isLeftHandBay'] = aisleForm['isLeftHandBay'] == "true";

		aisle['runInXDir'] = true;
		if ($scope.aisleShape.rectangle.width < $scope.aisleShape.rectangle.height) {
			aisle['runInXDir'] = false;
		}
		return aisle;
	};

	$scope.pixelsToMeter = function (pixels) {
		return (pixels / $scope.aisleShape.pixelsPerMeter);
	};

	$scope.sendCreateAisleCommand = function (aisle, onSuccess, onError) {

		var anchorPoint = {'posTypeEnum': 'METERS_FROM_PARENT', 'x': aisle['xOriginMeters'], 'y': aisle['yOriginMeters'], 'z': 0.0};
		var protoBayPoint = {'posTypeEnum': 'METERS_FROM_PARENT', 'x': aisle['bayWidth'], 'y': aisle['bayDepth'], 'z': aisle['bayHeight']};

		var aisleId = (aisle['aisleId']) ? aisle['aisleId'].toUpperCase() : '';
		var controllerId = (aisle['controllerId']) ? aisle['controllerId'].toLowerCase() : '';
		var data = {
			'className': $scope.facilityContext['className'],
			'persistentId': $scope.facilityContext['facility']['persistentId'],
			'methodName': 'createAisle',
			'methodArgs': [
				{ 'name': 'inAisleId', 'value': aisleId, 'classType': 'java.lang.String'},
				{ 'name': 'anchorPoint', 'value': anchorPoint, 'classType': 'com.gadgetworks.codeshelf.model.domain.Point'},
				{ 'name': 'protoBayPoint', 'value': protoBayPoint, 'classType': 'com.gadgetworks.codeshelf.model.domain.Point'},
				{ 'name': 'inProtoBaysHigh', 'value': aisle['baysHigh'], 'classType': 'java.lang.Integer'},
				{ 'name': 'inProtoBaysLong', 'value': aisle['baysLong'], 'classType': 'java.lang.Integer'},
				{ 'name': 'inControllerId', 'value': controllerId, 'classType': 'java.lang.String'},
				{ 'name': 'inRunInXDir', 'value': aisle['runInXDir'], 'classType': 'java.lang.Boolean'},
				{ 'name': 'inLeftHandBay', 'value': aisle['isLeftHandBay'], 'classType': 'java.lang.Boolean'}
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
