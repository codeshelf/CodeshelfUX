'use strict';

var codeshelfApp = angular.module('codeshelfApp', [
    'ui.bootstrap'

]);

/* Controllers */

    codeshelfApp.controller('WorkAreaCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
        $scope.master = {};
        $scope.user = {};

        $scope.update = function(user) {
            $scope.master = angular.copy(user);
        };

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };

        $scope.isUnchanged = function(user) {
            return angular.equals(user, $scope.master);
        };

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function () {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
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

        $scope.reset();

    }]);

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

/*
function Controller($scope) {
  $scope.master = {};

  $scope.update = function(user) {
    $scope.master = angular.copy(user);
  };
 
  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };
 
  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.master);
  };
 
  $scope.reset();
}
    */