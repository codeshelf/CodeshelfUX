goog.require('codeshelf.websession');
goog.require('goog.array');
goog.require('goog.object');

describe('websession', function() {
	var websocketStub;
	var currentPageStub;
	var applicationStub;
	var sendSpy;
	var isOpenSpy;

	beforeEach(function() {
		currentPageStub = {
			exit: function() {

			}
		};
		applicationStub = {
			restartApplication: function() {

			}
		};
		websocketStub = new goog.net.WebSocket(true);
		spyOn(goog.net.WebSocket.prototype, "open").andCallFake(function() {
			websocketStub.onOpen_();
		});

		isOpenSpy = spyOn(goog.net.WebSocket.prototype, "isOpen").andCallFake(function() {
			return true;
		});

		sendSpy = spyOn(goog.net.WebSocket.prototype, "send").andCallFake(function(message) {
		});
	});

	it("calls done callback on update success", function() {
		var websession = codeshelf.websession();
		websession.setCurrentPage(currentPageStub);
		websession.initWebSocket(applicationStub, websocketStub);
		websession.openWebSocket();

		var callback = jasmine.createSpy("update_callback");

		var domainObject = {"className" : "DomainObjectClass", "persistentId": 111};
		websession.update(domainObject).done(callback);

		var command = goog.json.parse(sendSpy.mostRecentCall.args[0]);
		var commandBody = goog.object.getValues(command).shift();
		websocketStub.onMessage_({data: goog.json.serialize({
			'ObjectUpdateResponse': {
				'requestId': commandBody['messageId'],
				'results': domainObject
			}
		})});
		expect(callback).toHaveBeenCalled();
	});

	it("calls fail callback when websocket is not open", function() {

		var websession = codeshelf.websession();
		websession.setCurrentPage(currentPageStub);
		websession.initWebSocket(applicationStub, websocketStub);
		websession.openWebSocket();


		isOpenSpy.andCallFake(function() {
			return false;
		});

		var callback = jasmine.createSpy("fail_callback");
		var domainObject = {};
		websession.update(domainObject).fail(callback);

		expect(sendSpy).not.toHaveBeenCalled();
		expect(callback).toHaveBeenCalled();
	});

});
