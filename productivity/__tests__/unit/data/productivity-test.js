
var csapi = require("data/csapi");


describe("Productivity Data", function() {
	var endpoint = "mockendpoint";
	var facilityId = "facId";
	it("produces productivity stream", function() {
//		sinon.fakeServer.create();

		csapi.getProductivity(endpoint, facilityId)
			.then(function(productivity) {

			});
	});
});
