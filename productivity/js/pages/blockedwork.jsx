var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var csapi = require('data/csapi');
var el = React.createElement;

var ibox = require('components/ibox');
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var DetailsNoLocation = require('components/detailsnolocation');
var ShortedWorkList = require('components/shortedwork');

var {ListGroup, ListGroupItem, Badge} = require('react-bootstrap');

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
                "workDetails": []
            },
            "SHORT" : {
                "type": "SHORT",
                "description": "Shorted Order Lines",
                "total": 0
            },
            "SUSPECTORDER": {
                "type": "SUSPECTORDER",
                "description": "Suspect Order Lines Imports",
                "total": 0
            },
            "SKIPPEDVERIFICATION": {
                "type" : "SKIPPEDVERIFICATION",
                "description": "Skipped Verification Scans",
                "total": 0
            }
        };
        return {
            "selectedtype" : "NOLOC",
            "blockedworksummary": types
        };
    },

    componentDidMount: function() {
        var {apiContext} = this.props;
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
    },
    componentWillUnmount: function() {},
    componentWillReceiveProps: function(nextProps) {
    },

    show: function(type) {
        this.setState({"selectedtype" : type});
    },

    render: function() {
        var {selectedtype, blockedworksummary} = this.state;
        var {apiContext} = this.props;
        var workDetails = blockedworksummary["NOLOC"]["workDetails"];
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
            {
                (selectedtype == "NOLOC") ? <DetailsNoLocation type="NOLOC" workDetails={workDetails}/> : <ShortedWorkList type={selectedtype} apiContext={apiContext}/>
            }
            </div>
            </div>
</div>
);}});






module.exports = BlockedWorkPage;
