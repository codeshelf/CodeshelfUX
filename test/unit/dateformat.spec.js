'use strict';

goog.require('codeshelf.dateformat');

//requires moment js
describe('dateformat', function() {
	var currentTime;

	beforeEach(function() {
		currentTime = moment("2014-09-23 16:00:00");
	});

	it("parses epoch earlier in the day with HH:mm", function() {
		var epoch = moment("2014-09-23 09:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("09:00");
	});

	it("parses epoch later in the day with HH:mm", function() {
		var epoch = moment("2014-09-23 20:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("+20:00");
	});

	it("parses epoch earlier in the week with EEE HH:mm", function() {
		var epoch = moment("2014-09-17 00:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("We 00:00");
	});

	it("parses epoch just over a week with MMM_DD", function() {
		var epoch = moment("2014-09-16 09:01:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("Sep_16");
	});


	it("parses epoch within a year as MMM_DD", function() {
		var epoch = moment("2013-09-24 09:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("Sep_24");
	});

	it("parses epoch exactly a year ago as  MMMyyyy", function() {
		var epoch = moment("2013-09-23 09:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("Sep2013");
	});

	it("parses epoch in the future within a week as +EEE HH:mm", function() {
		var epoch = moment("2014-09-30 09:00:00").valueOf();
		expect(codeshelf.timeUnitAwareFormat(epoch, currentTime)).toEqual("+Tu 09:00");
	});


});
