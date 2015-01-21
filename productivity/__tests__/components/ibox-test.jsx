var IBoxData = require('components/ibox').IBoxData;
var React = require('react');
var $ = require('jquery');

describe("IBox", function(){
    var testDiv;
    beforeEach(function(){
        $(document.body).append('<div id="ibox"/>');
        testDiv = $("#ibox");
    });

    afterEach(function() {
        React.unmountComponentAtNode(testDiv.get(0));
        testDiv.remove();
    });

    describe("IBoxData", function() {

        it("uses singular label for value of 1", function(){
            React.render(<IBoxData dataValue="1" dataLabelSingular="Singular" dataLabel="Plural"/>,
                         testDiv.get(0));
            expect(testDiv.text()).toMatch("Singular");
        });

        it("uses default label for value of -1", function(){
            React.render(<IBoxData dataValue="-1" dataLabelSingular="Short" dataLabel="Shorts"/>,
                         testDiv.get(0));
            expect(testDiv.text()).toMatch("Shorts");
        });

    });


});
