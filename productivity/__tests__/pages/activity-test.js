var $ = require('jquery');
var React = require('react');
var ActivityPage = require('pages/activity');
var ProductivitySummary = require('data/types').ProductivitySummary;
var RunSummary = require('data/types').RunSummary;
var timeformat = require('helpers/timeformat');

describe('Activity', function() {
    $(document.body).append('<div id="page"/>');
    var testDiv = $("#page");

    beforeEach(function() {

    });

    describe("when selected facility", function() {
        var facilityName = "TEST-FAC";
        var facility = createFacility(facilityName);
        var productivityStream = Rx.Observable.empty();
        var activeRunsStream = Rx.Observable.empty();

        it('shows navbar', function() {
            var activityPage = renderDetails(testDiv, facility, productivityStream, activeRunsStream);
            var componentText = testDiv.text();
            expect(componentText).toMatch(facilityName);
            unmount(testDiv);

        });

        it('shows breadcrumbs', function() {

            var activityPage = renderDetails(testDiv, facility, productivityStream, activeRunsStream);
            var componentText = testDiv.find('.breadcrumb').text();
            expect(componentText).toMatch(facilityName);
            unmount(testDiv);

        });

        it('renders activity', function() {
            var productivityStream  = Rx.Observable.just(
                ProductivitySummary("GROUPNAME1", 4, 5, 10,1)
            );
            var activityPage = renderDetails(testDiv, facility, productivityStream, activeRunsStream);
            var componentText = testDiv.text();
            expect(componentText).toMatch("GROUPNAME1");
            unmount(testDiv);

        });

        it('renders che runs', function() {
            var groupName = "TEST_GROUP_CHE";
            var assignedTime = Date.now();
            var productivityStream  = Rx.Observable.just(
                ProductivitySummary(groupName, 4, 5, 10,1)
            );
            var activeRunsStream  = Rx.Observable.just(
                RunSummary(groupName, assignedTime, 4,2,1)
            );
            var activityPage = renderDetails(testDiv, facility, productivityStream, activeRunsStream);
            var componentText = testDiv.text();
            expect(componentText).toMatch(timeformat(assignedTime));
            unmount(testDiv);




        });

    });

    function renderDetails(jqEl, facility, productivityStream, activeRunsStream) {
        var el = jqEl.get(0);
        return React.render(React.createElement(ActivityPage, {
            facility: facility,
            productivityStream: productivityStream,
            activeRunsStream: activeRunsStream
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
