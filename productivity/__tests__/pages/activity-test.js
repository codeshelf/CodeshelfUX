var $ = require('jquery');
var React = require('react');
var ActivityPage = require('pages/activity');
var ProductivitySummary = require('data/types').ProductivitySummary;

describe('Activity', function() {
    $(document.body).append('<div id="page"/>');
    var testDiv = $("#page");

    beforeEach(function() {

    });

    describe("when selected facility", function() {
        var facilityName = "TEST-FAC";
        var facility = createFacility(facilityName);
        var productivityStream = Rx.Observable.empty();

        it('shows navbar', function() {
            var activityPage = renderDetails(testDiv, facility, productivityStream);
            var componentText = testDiv.text();
            expect(componentText).toMatch(facilityName);
            unmount(testDiv);

        });

        it('shows breadcrumbs', function() {

            var activityPage = renderDetails(testDiv, facility, productivityStream);
            var componentText = testDiv.find('.breadcrumb').text();
            expect(componentText).toMatch(facilityName);
            unmount(testDiv);

        });

        it('renders activity', function() {
            var productivityStream  = Rx.Observable.just(
                ProductivitySummary("GROUPNAME1", 4, 5, 10,1)
            );
            var activityPage = renderDetails(testDiv, facility, productivityStream);
            var componentText = testDiv.text();
            expect(componentText).toMatch("GROUPNAME1");
            unmount(testDiv);

        });

    });

    function renderDetails(jqEl, facility, productivityStream) {
        var el = jqEl.get(0);
        return React.render(React.createElement(ActivityPage, {
            facility: facility,
            productivityStream: productivityStream
        }), el);
    }

    function createFacility(name) {
        return {
            "domainId": name
        };
    }

    function unmount(jqContainer) {
        React.unmountComponentAtNode(jqContainer.get(0));
    }
});
