goog.require('codeshelf.ASCIIAlphaNumericComparer');

describe('alphanumericsort', function() {
	var alphaNumericComparer;
	beforeEach(function() {
		alphaNumericComparer = codeshelf.ASCIIAlphaNumericComparer;
	});

	it("sorts strings with dash separators", function() {
		var testStrings = ["A1-T1-B1", "A1-T1-B10", "A1-T1-B9"];
		testStrings.sort(alphaNumericComparer);
		expect(testStrings).toEqual(["A1-T1-B1", "A1-T1-B9", "A1-T1-B10"]);
	});


	it("sorts strings with dot separators", function() {
		var testStrings = ["A1.T1.B1", "A1.T1.B10", "A1.T1.B9"];
		testStrings.sort(alphaNumericComparer);
		expect(testStrings).toEqual(["A1.T1.B1", "A1.T1.B9", "A1.T1.B10"]);
	});

	it("sorts strings with no alpha", function() {
		var testStrings = ["1", "11", "10", "9"];
		testStrings.sort(alphaNumericComparer);
		expect(testStrings).toEqual(["1", "9", "10", "11"]);
	});

	it("sorts shorter version before longer one", function() {
		var testStrings = ["A1.T1.B1", "A1.T1"];
		testStrings.sort(alphaNumericComparer);
		expect(testStrings).toEqual(["A1.T1", "A1.T1.B1"]);
	});

	it("sorts same without exception", function() {
		var testStrings = ["A1.T1", "A1.T1"];
		testStrings.sort(alphaNumericComparer);
		expect(testStrings).toEqual(["A1.T1", "A1.T1"]);
	});

});
