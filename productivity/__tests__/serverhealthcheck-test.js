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
    var props = {
        server: {
            "roles": "appserver",
            "host": "TESTHOST",
            "description": "DESC TEST"
        },
        "healthchecks": [
            {"name": "CHECK1", "message": "CHECK1 MESSAGE", "status": "ok"},
            {"name": "CHECK2", "message": "CHECK1 FAIL MESSAGE", "status": "fail"}
        ]
    };

    beforeEach(function() {

    });

    describe("when initializes", function() {
        it('shows server role', function() {
            var serverHealthIBox = renderDetails('#test', props);
            var componentText = testDiv.text();
            expect(componentText).toMatch("App Server");
        });

        it('shows server host', function() {
            var serverHealthIBox = renderDetails('#test', props);
            var componentText = testDiv.text();
            expect(componentText).toMatch(props.server.host);
        });

        it('shows server description', function() {
            var serverHealthIBox = renderDetails('#test', props);
            var componentText = testDiv.text();
            expect(componentText).toMatch(props.server.description);
        });
        it('shows all checks', function() {
            var serverHealthIBox = renderDetails('#test', props);
            var componentText = testDiv.text();
            _.forEach(props.healthchecks, function(healthcheck) {
                expect(componentText).toMatch(healthcheck.name);
            });
        });
    });

});


function renderDetails(id, props) {
    var el = $(id).get(0);
    return React.render(React.createElement(ServerHealth, props), el);
}
