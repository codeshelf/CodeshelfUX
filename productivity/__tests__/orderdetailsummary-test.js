/** @jsx React.DOM */

var _ = require('lodash');
var $ = require('jquery');
var Addons = require('react/addons');
var React = require('react');
var TestUtils = Addons.addons.TestUtils;
var OrderDetailIBox = require('components/orderdetailibox');
var DoughnutChart = require('components/doughnut.jsx');
var ProductivitySummary = require('data/types').ProductivitySummary;


var testsContext = require.context(".", true, /-test$/);
testsContext.keys().forEach(testsContext);

describe('OrderDetailIBox', function() {
    $(document.body).append('<div id="test"/>');
    var testDiv = $("#test");
    var groupName = "TESTGROUPNAME";
    var groupData = ProductivitySummary("undefined", 4, 5, 10,1);
    var keyedData = groupData["groups"]["undefined"];

    beforeEach(function() {

    });

    describe("when initializes", function() {
        it('shows group name', function() {
            var orderDetailIBox = renderDetails('#test', groupName, keyedData);
            var componentText = testDiv.text();
            expect(componentText).toMatch(groupName);
        });

        it('shows shorts name', function() {
            var numShorts = 98765;
            keyedData["short"] = numShorts;
            var orderDetailIBox = renderDetails('#test', groupName, keyedData);
            var componentText = testDiv.text();
            expect(componentText).toMatch(numShorts);
        });

        it('shows chart', function() {
            var orderDetailIBox = renderDetails('#test', groupName, keyedData);
            var detailsDoughnut = TestUtils.findRenderedComponentWithType(orderDetailIBox, DoughnutChart);
            expect(detailsDoughnut.getSegments().length).toBe(4);

            var canvas = TestUtils.findRenderedDOMComponentWithTag(orderDetailIBox, 'canvas');

            expect(canvas).not.toBeNull();
        });

        it('shows total label', function() {
            var orderDetailIBox = renderDetails('#test', groupName, keyedData);
            var orderDetailIBox = renderDetails('#test', groupName, keyedData);
            var componentText = testDiv.text();
            expect(componentText).toMatch("Lines");
        });


        it('shows pickRate', function() {
            var pickRate = "10101";
            var orderDetailIBox = renderDetails('#test', groupName, keyedData, pickRate);
            var componentText = testDiv.text();
        });
    });

});

function renderDetails(id, groupName, orderDetailSummaryData, pickRate) {
    var el = $(id).get(0);
    return React.render(React.createElement(OrderDetailIBox, {
        groupName: groupName,
        pickRate: pickRate,
        orderDetailSummaryData: orderDetailSummaryData}), el);
}
