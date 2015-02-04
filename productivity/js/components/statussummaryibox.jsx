/** @jsx React.DOM */

var React = require("react");
var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IBoxData = ibox.IBoxData;
var DoughnutSummary = require("./doughnutsummary.jsx");

var StatusSummaryIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "statusSummary": {},
            "totalLabelSingular": "",
            "totalLabel":""
        };
    },
    render: function() {
        var {
            statusSummary,
            totalLabel,
            totalLabelSingular }      = this.props;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        {this.props.title}
                    </IBoxTitleText>
                    <div className="ibox-tools">
                        <a aria-expanded="false" className="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i className="fa fa-wrench"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-right dropdown-user ">
                            <li><a href="#">All</a> </li>
                            <li><a href="#">UPS/Fedex</a></li>
                            <li><a href="#">Trucking</a></li>
                        </ul>
                    </div>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={statusSummary}

                                     totalLabelSingular={totalLabelSingular}
                                     totalLabel={totalLabel} />
                </IBoxSection>
               </IBox>);

        }
});

module.exports = StatusSummaryIBox; //Exports the class
