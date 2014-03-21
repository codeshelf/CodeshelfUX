'use strict';

/* jasmine specs for controllers go here */
describe('Codeshelf controllers', function() {

	/* Run before each describe and it function */
	beforeEach(function(){
		//Include all modules required for controller under test
		module('codeshelfApp');
	});

	describe('WorkAreaModalCtrl', function(){
		/* BDD Form:
		 Story: Make aisles
		 In order to... configure a facility
		 As a... system installer or tester
		 I want to... add/change/configure aisles in a facility.
		 */

		var $scope, $modalInstance, $websession, $q, createController;

		beforeEach(function() {
			// Create spys for mock objects and list the methods you are going to fake
			$websession = jasmine.createSpyObj('$websession', ['createCommand', 'sendCommand']);
			$modalInstance = jasmine.createSpyObj('$modalInstance', ['close','dismiss']);


			// Create fake stubs for the methods
			// Set up a module that provides your spy objects to the injector
			module(function($provide) {
				$provide.value('$websession', $websession);
				$provide.value('$modalInstance', $modalInstance);
			});

			//Inject will look up your services and mocks and provide them to the function
			//  from which you can create closures to create controllers properly
			// the underscore variables are a way to keep from colliding with vars
			// in your environment, yet still look up service by name
			inject(function(_$q_, $log, $rootScope, _$modalInstance_, _$websession_) {
				$q = _$q_;
				$scope = $rootScope.$new();

				createController = function(facilityContext, aisleShape) {
					return WorkAreaModalCtrl($scope,
						$log,
						$modalInstance,
						$websession,
						facilityContext,
						aisleShape);
				};
			});
		});

		/* BDD Scenario 1 (remember, no UI in BDD)
		 Scenario 1: Make new aisle
		 Given... facility is there
		 When... user makes a new aisle
		 Then... there is one more aisle than before, And the aisle is correctly made
		 */

		/* BDD Scenario 2: Delete existing aisle
		 Given... facility is there, and there is at least one aisle
		 When... user deletes an aisle
		 Then... there is one fewer aisle than before.
		 */

		/* BDD Scenario 3: Edit existing aisle
		 Given... facility is there, and there is at least one aisle
		 When... user edits an aisle
		 Then... the aisle changes to match the user's intention.
		 */

		/* tests below only cover scenario 1: new aisle
		* UI is user drags a rectangle. This yields a dialog. Upon completion, the aisle is made.
		* cases: user is entering valid data, and checking both boxes.
		* check that integer distances in feet gets converted to meters.
		*
		* */
		/*
		Could add:
		invalid entry: 0, -5, s, for height,width
		valid height and width like 2.5
		user attempt at different units: like 2.5m or 250cm
		invalid bay/tier counts like 2.5

		And multiple aisles, including a duplicate name that should fail.
		No name aisle. Start with valid aisle and change to duplicate or no name.
		 */

 		describe('when the dialog is saved ', function() {
			var fakeCommand;
			var facilityContext;
			var aisleShape;

			beforeEach(function(){
				fakeCommand = {"same":"same"};

				$websession.createCommand.andCallFake(function() { return fakeCommand});

				facilityContext = {
					facility: {persistentId: 99},
					className:  "FACILITYCLASS"
				};
				aisleShape = {
					pixelsPerMeter: 6,
					rectangle: {
						width: 10,
						height: 12
					},
					dragStartPoint: {
						x: 48,
						y: 24
					}
				};
				var aisleForm = {
					'aisleId': '1A',
					'bayHeight': 3,
					'bayWidth': 2,
					'bayDepth' : 1,
					'baysHigh' : 4,
					'baysLong' : 5,
					'opensLowSide' : 'true',
					'isLeftHandBay' : 'true'
				};
				var controller = createController(facilityContext, aisleShape);
				$scope.aisleForm = aisleForm;
			});

			describe('and the websession command fails', function() {
				var messagesFromCommand;
				beforeEach(function(){
					messagesFromCommand = ['message1', 'message2'];
					$websession.sendCommand.andCallFake(function(inCommand, inCallback, inRemainActive) {
						var response = {
							data: {
								status: "ERROR",
								results: {
									messages: messagesFromCommand
								}
							}
						};
						inCallback.exec(response);
					});
					$scope.ok();
				});

				it('should transfer the messages to the scope', function() {
					expect($scope.aisleForm.messages).toEqual(messagesFromCommand);
				});

				it('should not close the dialog', function(){
					expect($modalInstance.close.calls.length).toEqual(0);
				});
			});

			describe('the websession command succeeds', function() {
				beforeEach(function(){
					$websession.sendCommand.andCallFake(function(inCommand, inCallback, inRemainActive) {
						var response = {
							data: {
								status: "OK",
								results: {
									whatever: 'notsure'

								}
							}
						};
						inCallback.exec(response);
					});
					$scope.ok();
				});
				it('should close the dialog', function() {
					expect($modalInstance.close).toHaveBeenCalled();
				});
			});

			describe('the command data', function() {
				var data;
				beforeEach(function() {
					$scope.ok();
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
					expect(data.methodArgs[9].value).toEqual(true);
				});

				it("should transfer isLeftHandBay", function() {
					expect(data.methodArgs[10].value).toEqual(true);
				});

				it("should have an aisle id", function(){
					expect(data.methodArgs[0].name).toEqual('inAisleId');
					expect(data.methodArgs[0].value).toEqual('1A');
				});

				it("should set runInXDim to false if rectangle is higher than width", function() {
					expect(aisleShape.rectangle.height).toBeGreaterThan(aisleShape.rectangle.width);
					expect(data.methodArgs[8].value).toEqual(false);
				});
			});
		});
	});
});
