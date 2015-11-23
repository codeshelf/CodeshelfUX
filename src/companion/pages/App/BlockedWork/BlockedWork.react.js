import React from 'react';
import DocumentTitle from 'react-document-title';
var {Badge, TabbedArea, TabPane} = require('react-bootstrap');
var _ = require('lodash');

import {PageGrid, Row, Col} from 'components/common/pagelayout';
var {IBox, IBoxBody} = require('components/common/IBox');
var IssuesIBox = require('./IssuesIBox');
var {getFacilityContext} = require('data/csapi');
import {fetchUnresolvedIssuesByType, subscribe, unsubscribe} from 'data/issues/actions';
import {getIssuesSummary} from 'data/issues/store';
import {List} from 'immutable';

export default class BlockedWork extends React.Component {
    componentWillMount() {
        subscribe("blockedwork", fetchUnresolvedIssuesByType);
    }
    componentWillUnmount() {
        unsubscribe("blockedwork");
    }

    toDescription(type) {
        return {
            "SKIP_ITEM_SCAN": "Skipped",
            "SHORT": "Shorted",
            "BUTTON": "Button",
            "COMPLETE": "Complete",
            "LOW": "Low"
        }[type];
    }

    renderTabbedArea(issuesSummary) {
        let sortedSummary = issuesSummary
            .sortBy((summary) => summary.get("eventType"));
        let firstType = sortedSummary.first().get("eventType");
        return (
                <IBox>
                <IBoxBody>

                <TabbedArea className="nav-tabs-simple" defaultActiveKey={firstType}>
                {

                    sortedSummary.map((summary) => {
                        let type = summary.get("eventType");
                        let description = this.toDescription(type);
                        let total = summary.get("count");
                        return (<TabPane eventKey={type}
                                 tab={<span>
                                      {description && description.toUpperCase()}
                                      <Badge style={{marginLeft: "1em"}} className="badge-primary">{total}</Badge>
                                      </span>}>
                                <IssuesIBox type={type} />
                                </TabPane>);
                                }).toArray()
                    }
            </TabbedArea>
                </IBoxBody>
                </IBox>

        );
    }

    render() {
        let title = "Blocked Work";
        let issuesSummary = getIssuesSummary();
        let issuesSummaryResults = issuesSummary.get("results") || List();
        let filteredIssueSummaryResults = issuesSummaryResults
                .filter((summary) => summary.get("eventType") !== "COMPLETE");
        return (
                <DocumentTitle title={title}>
        <PageGrid>
            <Row>
                <Col sm={12}>
                {(filteredIssueSummaryResults.count() > 0) ?
                    this.renderTabbedArea(filteredIssueSummaryResults) :
                    <IBox className="bg-primary">
                        <IBoxBody>
                            <h3 className="text-white text-center">No {title}</h3>
                        </IBoxBody>
                    </IBox>
                }
                </Col>
                </Row>
       </PageGrid>
       </DocumentTitle>
       );
   }
}
