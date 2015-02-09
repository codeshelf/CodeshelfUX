/** @jsx React.DOM */

var React = require("react");
var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IBoxData = ibox.IBoxData;
var SummaryFilter = require("./summaryfilter.jsx");
var DoughnutSummary = require("./doughnutsummary.jsx");

var StatusSummaryIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "title": "",
            "statusSummary": {},
            "totalLabelSingular": "",
            "totalLabel":"",
            "filterOptions": []
        };
    },
    render: function() {
        var {
            title,
            statusSummary,
            totalLabel,
            totalLabelSingular,
            filterOptions}      = this.props;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        {title}
                    </IBoxTitleText>
                    <SummaryFilter filters={filterOptions}
                                   selectedFilter={function(filterName){console.log(filterName);}}/>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={statusSummary}
                                     totalLabelSingular={totalLabelSingular}
                                     totalLabel={totalLabel}
                                     />
                </IBoxSection>
               </IBox>);

        }
});

module.exports = StatusSummaryIBox; //Exports the class
