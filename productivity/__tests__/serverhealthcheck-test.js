/** @jsx React.DOM */

var _ = require('lodash');
var $ = require('jquery');
var Addons = require('react/addons');
var React = require('react');
var TestUtils = Addons.addons.TestUtils;
var ServerHealth = require('components/serverhealthcheck');


describe('ServerHealth', function() {
	$(document.body).append('<div id="test"/>');
	var testDiv = $("#test");
	var server = {
		"healthchecks": [
			{"name": "CHECK1", "message": "CHECK1 MESSAGE", "status": "ok"},
			{"name": "CHECK2", "message": "CHECK1 FAIL MESSAGE", "status": "fail"}
		],
		"roles": "appserver",
		"host": "TESTHOST",
		"description": "DESC TEST"
	};

	beforeEach(function() {

	});

	describe("when initializes", function() {
		it('shows server role', function() {
			var serverHealthIBox = renderDetails('#test', server);
			var componentText = testDiv.text();
			expect(componentText).toMatch("App Server");
		});

		it('shows server host', function() {
			var serverHealthIBox = renderDetails('#test', server);
			var componentText = testDiv.text();
			expect(componentText).toMatch(server.host);
		});

		it('shows server description', function() {
			var serverHealthIBox = renderDetails('#test', server);
			var componentText = testDiv.text();
			expect(componentText).toMatch(server.description);
		});
		it('shows all checks', function() {
			var serverHealthIBox = renderDetails('#test', server);
			var componentText = testDiv.text();
			_.forEach(server.healthchecks, function(healthcheck) {
				expect(componentText).toMatch(healthcheck.name);
			});
		});
	});

});


function renderDetails(id, server) {
	var el = $(id).get(0);
	return React.render(React.createElement(ServerHealth, {
		server: server
	}), el);
}
