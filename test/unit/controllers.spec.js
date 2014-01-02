'use strict';

/* jasmine specs for controllers go here */
describe('Codeshelf controllers', function() {

  /* Run before each describe and it function */
  beforeEach(function(){
      //Include all modules required for controller under test
      module('codeshelfApp');
  });

  describe('WorkAreaCtrl', function(){
    var $scope, $modal, $websession, $q, createController;

    beforeEach(function() {
        // Create spys for mock objects and list the methods you are going to fake
        $websession = jasmine.createSpyObj('$websession', ['createCommand', 'sendCommand']);
        $modal = jasmine.createSpyObj('$modal', ['open']);
        var deferred;

        // Create fake stubs for the methods
        $modal.open.andCallFake(function () { deferred = $q.defer(); return {result: deferred.promise}; });

        // Set up a module that provides your spy objects to the injector
        module(function($provide) {
            $provide.value('$websession', $websession);
            $provide.value('$modal', $modal);
        });

        //Inject will look up your services and mocks and provide them to the function from which you can create
        // closures to create controllers properly
        // the underscore variables are a way to keep from colliding with vars in your environment, yet still look up
        //   service by name
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
        var rectangle;

        beforeEach(function(){
          fakeCommand = {"same":"same"};

          $websession.createCommand.andCallFake(function() { return fakeCommand});
          var controller = createController();
          facilityContext = {
              facility: {persistentId: 99},
              className:  "FACILITYCLASS"
          };
          var dragPoint = {
              x: 48,
              y: 24
          };
          rectangle = {
              width: 10,
              height: 12
          };

          commandCallback = function() {};
          var aisleForm = {
              'aisleId': '1A',
	      'bayHeight': 3,
              'bayWidth': 2,
              'bayDepth' : 1,
	      'baysHigh' : 4,
	      'baysLong' : 5,
	      'opensLowSide' : 'true'

          };
          $scope.open(facilityContext, 6, dragPoint, rectangle, commandCallback);
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

          it("should convert xOriginMeters from pixels to meters", function(){
              expect(data.methodArgs[1].value).toEqual(48 / 6);
          });

          it("should convert yOriginMeters from pixels to meters", function(){
              expect(data.methodArgs[2].value).toEqual(24 / 6);
          });
          
          
          it("should convert bayWidth to meters", function(){
              expect(data.methodArgs[3].value).toEqual(2 * 0.3048);
          });

          it("should convert bayDepth to meters", function() {
              expect(data.methodArgs[4].value).toEqual(1 * 0.3048);
          });

          it("should convert bayHeight to meters", function() {
              expect(data.methodArgs[5].value).toEqual(3 * 0.3048);
          });

          it("should transfer  baysHigh", function() {
              expect(data.methodArgs[6].value).toEqual(4);
          });

          it("should transfer baysLong", function() {
              expect(data.methodArgs[7].value).toEqual(5);
          });

          it("should transfer opensLowSide", function() {
              expect(data.methodArgs[9].value).toEqual('true');
          });

          it("should have an aisle id", function(){
              expect(data.methodArgs[0].name).toEqual('inAisleId');
              expect(data.methodArgs[0].value).toEqual('1A');
          });

          it("should set runInXDim to false if rectangle is higher than width", function() {
              expect(rectangle.height).toBeGreaterThan(rectangle.width);
              expect(data.methodArgs[8].value).toEqual(false);
          });


      });

      it("should call sendCommand with command and callback", function() {
          expect($websession.sendCommand).toHaveBeenCalledWith(fakeCommand, commandCallback, true);
      });

    });
  });
});
