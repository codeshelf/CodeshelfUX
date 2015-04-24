import React from 'react';
import DocumentTitle from 'react-document-title';
var _ = require('lodash');
var $ = require('jquery');

var csapi = require('data/csapi');
var {StatusSummary} = require('data/types');
var el = React.createElement;

import {PageGrid, Row, Col} from 'components/common/pagelayout';
var ibox = require('components/common/IBox');
var IBox = ibox.IBox;
var IBoxBody = ibox.IBoxBody;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IssuesIBox = require('./IssuesIBox');
var SkippedVerificationList = require('./SkippedVerificationList');
var {getFacilityContext} = require('data/csapi');
var {ListGroup, ListGroupItem, Badge, TabbedArea, TabPane} = require('react-bootstrap');

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
                "description": "No Location",
                "total": 0,
                "workDetails": [],
                "displayComponent": DetailsNoLocation
            },
            "SHORT" : {
                "type": "SHORT",
                "description": "Shorted",
                "total": 0,
                "workDetails" : [],
                "displayComponent": ShortedWorkList
            },
            "SKIPPEDVERIFICATION": {
                "type" : "SKIPPEDVERIFICATION",
                "description": "Skipped",
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
        return (
                <DocumentTitle title="Blocked Work">
        <PageGrid>
            <Row>
                <Col sm={12}>
                <IBox>
                    <IBoxBody>
                <TabbedArea className="nav-tabs-simple" activeKey={this.state.key} onSelect={this.handleSelect}>
                {
                    _.values(blockedworksummary).map(function(blockedworktype) {
                        var {type,
                             description,
                             displayComponent,
                             workDetails,
                             total             } = blockedworktype;
                        var DisplayComponent = displayComponent;  //Case matters for components
                        return (<TabPane eventKey={type}
                                         tab={<span>{description.toUpperCase()}<Badge style={{marginLeft: "1em"}} className="badge-primary">{total}</Badge></span>}>
                                    <DisplayComponent type={selectedtype} workDetails={workDetails} />
                                </TabPane>);
                                }.bind(this))
                }
                </TabbedArea>
                    </IBoxBody>
                </IBox>
                </Col>
                </Row>
</PageGrid>
</DocumentTitle>
);}});






module.exports = BlockedWorkPage;
