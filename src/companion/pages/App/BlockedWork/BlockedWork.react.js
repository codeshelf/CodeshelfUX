var React = require('react');
var _ = require('lodash');
var $ = require('jquery');

var csapi = require('data/csapi');
var {StatusSummary} = require('data/types');
var el = React.createElement;

var ibox = require('components/common/IBox');
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IssuesIBox = require('./IssuesIBox');
var SkippedVerificationList = require('./SkippedVerificationList');
var {getFacilityContext} = require('data/csapi');
var {ListGroup, ListGroupItem, Badge} = require('react-bootstrap');

class ShortedWorkList extends React.Component {
    render() {
        return <IssuesIBox title="Shorted Order Lines By Item" {...this.props} />
    }
}

class DetailsNoLocation extends React.Component {
    render() {
        return <IssuesIBox title="Order Lines without Location By Item" {...this.props} />
    }
}

var BlockedWorkPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Blocked Work";
        }
    },
    getInitialState: function() {
        var types = {
            "NOLOC" : {
                "type" : "NOLOC",
                "description": "Order Lines w/o Location",
                "total": 0,
                "workDetails": [],
                "displayComponent": DetailsNoLocation
            },
            "SHORT" : {
                "type": "SHORT",
                "description": "Shorted Order Lines",
                "total": 0,
                "workDetails" : [],
                "displayComponent": ShortedWorkList
            },
            "SKIPPEDVERIFICATION": {
                "type" : "SKIPPEDVERIFICATION",
                "description": "Skipped UPC Scans",
                total: 0,
                "workDetails" : [],
                "displayComponent": SkippedVerificationList

            }/*,
              FOR LATER
            "SUSPECTORDER": {
                "type": "SUSPECTORDER",
                "description": "Suspect Order Lines Imports",
                "total": 0
            },
              SHOULD MOVE TO AN ALERTS AREA
            */
        };
        return {
            "selectedtype" : "NOLOC",
            "blockedworksummary": types
        };
    },

    updateViews: function(props) {
        var apiContext = getFacilityContext();
        apiContext.getBlockedWorkNoLocation().then(
            function(workDetails) {
                if (this.isMounted()) {
                    this.state.blockedworksummary["NOLOC"]["total"] = workDetails.length;
                    this.state.blockedworksummary["NOLOC"]["workDetails"] = workDetails;

                    this.setState({
                        "blockedworksummary": this.state.blockedworksummary
                    });
                }
            }.bind(this)
        );
        apiContext.getBlockedWorkShorts().then(
            function(workDetails) {
                if (this.isMounted()) {
                    this.state.blockedworksummary["SHORT"]["total"] = workDetails.length;
                    this.state.blockedworksummary["SHORT"]["workDetails"] = workDetails;

                    this.setState({
                        "blockedworksummary": this.state.blockedworksummary
                    });
                }
            }.bind(this)
        );
    },
    componentWillReceiveProps: function(nextProps) {
        this.updateViews(nextProps);
    },
    componentDidMount: function() {
        this.updateViews(this.props);
    },
    componentWillUnmount: function() {},
    show: function(type) {
        this.setState({"selectedtype" : type});
    },

    render: function() {
        var {selectedtype, blockedworksummary} = this.state;
        var {apiContext} = this.props;
        var workDetails = blockedworksummary[selectedtype]["workDetails"];
        var DisplayComponent = blockedworksummary[selectedtype]["displayComponent"];
        return (

        <div>
            <div className="row orderdetails">
                <div className="col-sm-6 col-md-4">
                <IBox>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            Blocked Work
                        </IBoxTitleText>
                    </IBoxTitleBar>
                    <div className="ibox-content">
                    <ListGroup>
                    {
                        _.values(blockedworksummary).map(function(blockedworktype) {
                            var type = blockedworktype.type;
                            return <ListGroupItem
                                        key={type}
                                        onClick={this.show.bind(this, type)}
                                        active={selectedtype == type} >

                                        {blockedworktype.description}
                                        <Badge>{blockedworktype.total}</Badge>
                                   </ListGroupItem>;
                        }.bind(this))
                    }
                    </ListGroup>
                </div>
                </IBox>
                </div>
                </div>
            <div className="row orderdetails">

            <div className="col-sm-6 col-md-8">
                <DisplayComponent type={selectedtype} workDetails={workDetails} />
            </div>
            </div>
</div>
);}});






module.exports = BlockedWorkPage;
