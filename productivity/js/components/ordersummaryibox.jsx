/** @jsx React.DOM */

var React = require("react");
var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IBoxData = ibox.IBoxData;
var DoughnutSummary = require("./doughnutsummary.jsx");

var OrderSummaryIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "orderSummary": {}
        };
    },
    render: function() {
        var orderSummary = this.props.orderSummary;
        var shorts = orderSummary["short"];
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        {this.props.title}
                    </IBoxTitleText>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={orderSummary}
                                     totalLabelSingular="Order"
                                     totalLabel="Orders" />
                </IBoxSection>
                <IBoxSection>
                    <IBoxData dataValue={shorts} dataLabelSingular="Short" dataLabel="Shorts" />

                </IBoxSection>
               </IBox>);

        }
});

module.exports = OrderSummaryIBox; //Exports the class
