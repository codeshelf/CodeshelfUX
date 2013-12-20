/**
 * Created by pmonteiro on 12/17/13.
 */

'use strict';

var codeshelfApp = angular.module('codeshelfApp', [
    'ui.bootstrap'

]);

var WorkAreaCtrl = codeshelfApp.controller('WorkAreaCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    var consts = {};
    Object.defineProperty(consts, 'feetInMeters', {value: 0.3048,
        writable:                                         false,
        enumerable:                                       true,
        configurable:                                     true});

    $scope.open = function (facility, startDragPoint, currentRect) {
        //TODO facility might be able to come from a parent controller
        $scope.facility_ = facility;
        $scope.startDragPoint_ = startDragPoint;
        $scope.currentRect_ = currentRect;
        $scope.aisleForm = {};
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
            var aisle  = $scope.convertData(aisleForm);
            $log.info('aisle obj: ' + angular.toJson(aisle));
            $scope.sendCreateAisleCommand(aisle);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.convertData = function (aisleForm) {
        var aisle = {};
        aisle.xOriginMeters = $scope.startDragPoint_.x / self.getPixelsPerMeter();
        aisle.yOriginMeters = $scope.startDragPoint_.y / self.getPixelsPerMeter();

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
            'className':    domainobjects['Facility']['className'],
            'persistentId': $scope.facility_['persistentId'],
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

        var createAisleCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
        websession_.sendCommand(createAisleCmd,
            websocketCmdCallbackFacility(kWebSessionCommandType.OBJECT_METHOD_REQ),
            true);
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

