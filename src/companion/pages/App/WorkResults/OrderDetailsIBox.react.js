import React from "react";
import _ from "lodash";
import ibox from "components/common/IBox";
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
import DoughnutSummary from "components/common/DoughnutSummary";
import ActiveRun from "./ActiveRun";

var OrderDetailIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "groupName": "",
            "pickRate": 0,
            "activeRuns": []
        };
    },
    render: function() {
        var orderDetailSummaryData = this.props.orderDetailSummaryData;
        var groupName    = this.props.groupName;
        var shorts       = orderDetailSummaryData["short"];
        var pickRate     = this.props.pickRate;
        var activeRuns = this.props.activeRuns;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        Order Group {groupName} Burn Down
                    </IBoxTitleText>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={orderDetailSummaryData}
                                     totalLabelSingular="Line"
                                     totalLabel="Lines" />
                </IBoxSection>
                <IBoxSection className="shortSummary">
                    <IBoxData dataValue={shorts} dataLabelSingular="Short" dataLabel="Shorts" />
                </IBoxSection>
                <IBoxSection className="pickRate">
                    <IBoxData dataValue={Math.round(pickRate)} dataLabel="/ Hour" />
                </IBoxSection>
                <IBoxSection>
                    <IBoxTitleText>Active Runs</IBoxTitleText>
                </IBoxSection>
                    {
                        _.map(activeRuns, function(run) {
                            if (ActiveRun.isActive(run)) {
                                var id = ActiveRun.getId(run);
                                return (
                                        <IBoxSection key={id}>
                                            <ActiveRun key={id} run={run} />
                                        </IBoxSection>);
                            }
                            else {
                                return null;
                            }
                        })
                    }
               </IBox>);

        }
});

module.exports = OrderDetailIBox; //Exports the class
