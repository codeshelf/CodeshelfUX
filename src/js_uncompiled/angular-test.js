'use strict';

var codeshelfApp = angular.module('codeshelfApp', [
    'fundoo.services'

]);


/* Controllers */

    codeshelfApp.controller('WorkAreaCtrl', ['$scope', 'createDialog', function($scope, createDialogService) {
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

        $scope.launchSimpleModal = function() {
            createDialogService('simpleModal.html', {
                id: 'simpleDialog',
                title: 'A Simple Modal Dialog',
                backdrop: true,
                success: {label: 'Success', fn: function() {console.log('Simple modal closed');}}
            });
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