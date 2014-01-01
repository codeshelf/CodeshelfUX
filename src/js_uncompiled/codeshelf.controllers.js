/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2013, Jeffrey B. Williams, All rights reserved
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ *  $Id: application.js,v 1.24 2012/12/07 08:58:02 jeffw Exp $
 *******************************************************************************/

'use strict';

var codeshelfApp = angular.module('codeshelfApp', [
        'ui.bootstrap'
    ]).factory('$websession', function() {
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

var WorkAreaCtrl = codeshelfApp.controller('WorkAreaCtrl', ['$scope', '$modal', '$websession', '$log', function($scope, $modal, $websession, $log) {
    var consts = {};
    Object.defineProperty(consts, 'feetInMeters', {value: 0.3048,
        writable:                                         false,
        enumerable:                                       true,
        configurable:                                     true});

    $scope.open = function (facilityContext, pixelsPerMeter, startDragPoint, currentRect, commandCallback) {
        //TODO facility might be able to come from a parent controller
        $scope.facilityContext = facilityContext;
        $scope.pixelsPerMeter = pixelsPerMeter;
        $scope.startDragPoint = startDragPoint;
        $scope.currentRect_ = currentRect;
        $scope.commandCallback = commandCallback;
        $scope.aisleForm = {};
        $scope.websession = $websession;
        var modalInstance = $modal.open({
            templateUrl: 'createAisleModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                aisleForm: function () {
                    return $scope.aisleForm;
                }
            }
        });

        modalInstance.result.then(function (aisleForm) {
            $scope.onSave(aisleForm);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.pixelsToMeter = function (pixels) {
        return (pixels / this.pixelsPerMeter);
    }

    $scope.onSave = function (aisleForm) {
        var aisle  = $scope.convertData(aisleForm);
        $log.info('aisle obj: ' + angular.toJson(aisle));
        $scope.sendCreateAisleCommand(aisle);
    };

    $scope.convertData = function (aisleForm) {
        var aisle = {};
        aisle.xOriginMeters = $scope.pixelsToMeter(this.startDragPoint.x);
        aisle.yOriginMeters = $scope.pixelsToMeter(this.startDragPoint.y);

        aisle.aisleId = aisleForm['aisleId'];
        aisle.bayHeight = aisleForm['bayHeight'] * consts['feetInMeters'];
        aisle.bayWidth = aisleForm['bayWidth'] * consts['feetInMeters'];
        aisle.bayDepth = aisleForm['bayDepth'] * consts['feetInMeters'];
        aisle.baysHigh = aisleForm['baysHigh'];
        aisle.baysLong = aisleForm['baysLong'];
        aisle.opensLowSide = aisleForm['opensLowSide'];


        aisle.runInXDim = true;
        if ($scope.currentRect_.width < $scope.currentRect_.height) {
            aisle.runInXDim = false;
        }
        return aisle;
    };

    $scope.sendCreateAisleCommand = function(aisle) {
        // Call Facility.createAisle();
        var data = {
            'className':    $scope.facilityContext.className,
            'persistentId': $scope.facilityContext.facility['persistentId'],
            'methodName':   'createAisle',
            'methodArgs':   [
                { 'name': 'inAisleId', 'value': aisle.aisleId, 'classType': 'java.lang.String'},
                { 'name': 'inPosXMeters', 'value': aisle.xOriginMeters, 'classType': 'java.lang.Double'},
                { 'name': 'inPosYMeters', 'value': aisle.yOriginMeters, 'classType': 'java.lang.Double'},
                { 'name': 'inProtoBayXDimMeters', 'value': aisle.bayWidth, 'classType': 'java.lang.Double'},
                { 'name': 'inProtoBayYDimMeters', 'value': aisle.bayDepth, 'classType': 'java.lang.Double'},
                { 'name': 'inProtoBayZDimMeters', 'value': aisle.bayHeight, 'classType': 'java.lang.Double'},
                { 'name': 'inProtoBaysHigh', 'value': aisle.baysHigh, 'classType': 'java.lang.Integer'},
                { 'name': 'inProtoBaysLong', 'value': aisle.baysLong, 'classType': 'java.lang.Integer'},
                { 'name': 'inRunInXDir', 'value': aisle.runInXDim, 'classType': 'java.lang.Boolean'},
                { 'name': 'inOpensLowSide', 'value': aisle.opensLowSide, 'classType': 'java.lang.Boolean'}
            ]
        };

        var createAisleCmd = $scope.websession.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
        $scope.websession.sendCommand(createAisleCmd, $scope.commandCallback, true);
    };

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, aisleForm) {
    $scope.aisleForm = {};
    $scope.ok = function () {
        $modalInstance.close($scope.aisleForm);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

