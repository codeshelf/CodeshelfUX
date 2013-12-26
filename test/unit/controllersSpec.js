'use strict';

/* jasmine specs for controllers go here */
describe('Codeshelf controllers', function() {

  beforeEach(function(){
      module('codeshelfApp');
  });

  describe('WorkAreaCtrl', function(){
    var $scope, $modal, $websession, $q, createController;

    beforeEach(function() {
        $websession = jasmine.createSpyObj('$websession', ['createCommand', 'sendCommand']);
        $modal = jasmine.createSpyObj('$modal', ['open']);
        var deferred;
        $modal.open.andCallFake(function () { deferred = $q.defer(); return {result: deferred.promise}; });

        module(function($provide) {
            $provide.value('$websession', $websession);
            $provide.value('$modal', $modal);
        });


        inject(function(_$q_, $log, $rootScope, $controller, _$modal_, _$websession_) {
            $q = _$q_;
            $scope = $rootScope.$new();

            createController = function() {
                return $controller('WorkAreaCtrl', {
                    '$scope': $scope,
                    '$modal': _$modal_,
                    '$websession': _$websession_,
                    '$log': $log
                });
            };
        })
    });

    it('should have a method to open a dialog', function() {
      var controller = createController();
      $scope.open({}, {}, {});
    });

    describe('when the dialog is saved ', function() {
      var fakeCommand;
      var facilityContext, commandCallback;

      beforeEach(function(){
          fakeCommand = {"same":"same"};

          $websession.createCommand.andCallFake(function() { return fakeCommand});
          var controller = createController();
          facilityContext = {
              facility: {persistentId: 99},
              className:  "FACILITYCLASS"
          };
          var dragPoint = {
              x: 23,
              y: 45
          };
          var rectangle = {
              width: 10,
              height: 12
          };

          commandCallback = function() {};
          var aisleForm = {
              'bayWidth': 2,
              'bayDepth' : 1

          };
          $scope.open(facilityContext, 3, dragPoint, rectangle, commandCallback);
          $scope.onSave(aisleForm);

      });

      describe('the command data', function() {
         var data;
         beforeEach(function() {
             data = $websession.createCommand.mostRecentCall.args[1];
         });

          it ("should have classname from facility context", function() {
              expect(data.className).toEqual(facilityContext.className);
          });

          it("should convert bayWidth to meters", function(){
              expect(data.methodArgs[3].value).toEqual(0.6096);
          });

          it("should convert bayDepth to meters", function() {
              expect(data.methodArgs[4].value).toEqual(0.3048);
          });
      });

      it("should call sendCommand with command and callback", function() {
          expect($websession.sendCommand).toHaveBeenCalledWith(fakeCommand, commandCallback, true);
      });

    });
  });
});
