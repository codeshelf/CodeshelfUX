'use strict';

/* jasmine specs for controllers go here */
describe('Codeshelf controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('codeshelfApp'));

  describe('WorkAreaCtrl', function(){
    var $scope, $modal, $q, createController;

    beforeEach(function() {
        $modal = jasmine.createSpyObj('$modal', ['open']);
        module(function($provide) {
            $provide.value('$modal', $modal);
        });

        inject(function(_$q_, $log, $rootScope, $controller) {
            $q = _$q_;

            $scope = $rootScope.$new();

            createController = function() {
                return $controller('WorkAreaCtrl', {
                    '$scope': $scope,
                    '$modal': $modal,
                    '$log': $log
                });
            };
        })
    });

    it('should have a method to open a dialog', function() {
      var deferred;
      $modal.open.andCallFake(function () { deferred = $q.defer(); return {result: deferred.promise}; });
      var controller = createController();
      $scope.open({}, {}, {});
    });


  });
});
