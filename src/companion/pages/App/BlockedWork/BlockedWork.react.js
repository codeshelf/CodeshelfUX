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

export default class BlockedWorkPage extends React.Component {
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
            "COMPLETE": "Complete"
        }[type];
    }

    renderTabbedArea(issuesSummary) {
        return (
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

        );
    }

    render() {
        //groupBy("type").count()
        let title = "Blocked Work";
        let issuesSummaryResults = getIssuesSummary();
        let issuesSummary = issuesSummaryResults.get("results") || List();
        return (
                <DocumentTitle title={title}>
        <PageGrid>
            <Row>
                <Col sm={12}>
                <IBox className="bg-primary">
                    <IBoxBody>
                        {(issuesSummary.count() > 0) ?
                            renderTabbedArea(issuesSummary) :
                            <h3 className="text-white text-center">No {title}</h3>
                        }

                    </IBoxBody>
                </IBox>
                </Col>
                </Row>
       </PageGrid>
       </DocumentTitle>
       );
   }
}
