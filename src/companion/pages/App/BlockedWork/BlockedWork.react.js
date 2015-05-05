import React from 'react';
import DocumentTitle from 'react-document-title';
var _ = require('lodash');

import {PageGrid, Row, Col} from 'components/common/pagelayout';
var {IBox, IBoxBody} = require('components/common/IBox');
var IssuesIBox = require('./IssuesIBox');
var SkippedVerificationList = require('./SkippedVerificationList');
var {getFacilityContext} = require('data/csapi');
import {fetchIssuesSummary} from 'data/issues/actions';
import {getIssuesSummary} from 'data/issues/store';
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
        fetchIssuesSummary(
            {
                filterBy: {
                    "resolved" : false
                },
                groupBy: "type"
            });
/*
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
*/
   },
    componentWillReceiveProps: function(nextProps) {
        //this.updateViews(nextProps);
    },
    componentWillMount: function() {
        this.updateViews(this.props);
    },
    componentWillUnmount: function() {},

    toDescription: (type) => {
        return {
            "SKIP_ITEM_SCAN": "Skipped",
            "SHORT": "Shorted",
            "BUTTON": "Button",
            "COMPLETE": "Complete"
        }[type];
    },

    render: function() {
        var {selectedtype, blockedworksummary} = this.state;
        var {apiContext} = this.props;
        //groupBy("type").count()
        let issuesSummaryResults = getIssuesSummary();
        let issuesSummary = issuesSummaryResults.get("results");
        console.log(issuesSummary.toJS());

        return (
                <DocumentTitle title="Blocked Work">
        <PageGrid>
            <Row>
                <Col sm={12}>
                <IBox>
                    <IBoxBody>
                <TabbedArea className="nav-tabs-simple" activeKey={this.state.key} onSelect={this.handleSelect}>
                {

                    issuesSummary.sortBy((summary) => summary.get("name")).map((summary) => {
                        let type = summary.get("name");
                        let description = this.toDescription(type);
                        let total = summary.get("count");
                        return (<TabPane eventKey={type}
                                 tab={<span>
                                         {description.toUpperCase()}
                                         <Badge style={{marginLeft: "1em"}} className="badge-primary">{total}</Badge>
                                      </span>}>
                                    <IssuesIBox type={type} />
                                </TabPane>);
                    }).toArray()
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
