'use strict';

var codeshelfApp = angular.module('codeshelfApp', [

]);


/* Controllers */

    codeshelfApp.controller('WorkAreaCtrl', ['$scope',
    function($scope) {
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

        $scope.reset();
    }]);

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