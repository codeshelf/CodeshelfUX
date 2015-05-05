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

var BlockedWorkPage = React.createClass({

    updateViews: function(props) {
        fetchIssuesSummary(
            {
                filterBy: {
                    "resolved" : false
                },
                groupBy: "type"
            });
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
        //groupBy("type").count()
        let issuesSummaryResults = getIssuesSummary();
        let issuesSummary = issuesSummaryResults.get("results");
        return (
                <DocumentTitle title="Blocked Work">
        <PageGrid>
            <Row>
                <Col sm={12}>
                <IBox>
                    <IBoxBody>
                <TabbedArea className="nav-tabs-simple" defaultActiveKey={"SKIP_ITEM_SCAN"}>
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
