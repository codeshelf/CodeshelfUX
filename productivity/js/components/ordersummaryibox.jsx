/** @jsx React.DOM */

var React = require("react");
var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var DoughnutSummary = require("./doughnutsummary.jsx");

var OrderSummaryIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "orderSummary": {}
        };
    },
    render: function() {
        var orderSummary = this.props.orderSummary;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        Orders Burn Down
                    </IBoxTitleText>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={orderSummary}
                                     totalLabelSingular="Order"
                                     totalLabel="Orders" />
                </IBoxSection>
               </IBox>);

        }
});

module.exports = OrderSummaryIBox; //Exports the class
