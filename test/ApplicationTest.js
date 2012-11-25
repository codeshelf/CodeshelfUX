ApplicationTest = TestCase("ApplicationTest");

ApplicationTest.prototype.testApplication = function () {
	var application = codeshelf.application();

	var organization = {};
	application.setOrganization(organization);
	assertEquals(organization, application.getOrganization());

	var websession = {};
	application.setWebsession(websession);
	assertEquals(websession, application.getWebsession());
	
	application.startApplication();

	jstestdriver.console.log("JsTestDriver", "ApplicationTest");
	console.log("ApplicationTest");
};
