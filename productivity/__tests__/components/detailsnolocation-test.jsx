var DetailsNoLocation = require('components/detailsnolocation');
var React = require('react');
var $ = require('jquery');

describe("DetailsNoLocation", function(){
    var testDiv;
    beforeEach(function(){
        $(document.body).append('<div id="ibox"/>');
        testDiv = $("#ibox");
    });

    afterEach(function() {
        React.unmountComponentAtNode(testDiv.get(0));
        testDiv.remove();
    });

    describe("groups details by sku/uom", function() {

        it("multiple are grouped together", function() {
            var workDetails = [
                {
                    "sku": "A",
                    "uom": "U",
                    "planQuantity" : 1
                },
                {
                    "sku": "A",
                    "uom": "U",
                    "planQuantity" : 3
                },
                {
                    "sku": "B",
                    "uom": "U",
                    "planQuantity" : 5
                },
                {
                    "sku": "B",
                    "uom": "M",
                    "planQuantity" : 7
                }

            ];
            var groupedDetails = DetailsNoLocation.groupByItem(workDetails);
            expect(groupedDetails).toEqual([
                {"sku": "A", "uom" : "U", "description": "", "lines": 2, "total": 4},
                { sku: 'B', uom: 'U', description: '', lines: 1, total: 5 },
                { sku: 'B', uom: 'M', description: '', lines: 1, total: 7 }
            ]);
        });

    });


});
