import React from 'react';
import DocumentTitle from 'react-document-title';
import {Badge, TabbedArea, TabPane} from 'react-bootstrap';
import _ from 'lodash';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody} from 'components/common/IBox';
import {Form, WrapInput, Input, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';

import IssuesIBox from './IssuesIBox';
import {getFacilityContext} from 'data/csapi';
import {fetchUnresolvedIssuesByType, subscribe, unsubscribe} from 'data/issues/actions';
import {getIssuesSummary} from 'data/issues/store';
import {List} from 'immutable';

export default class BlockedWork extends React.Component {

    constructor(props){
      super(props);
      this.state = {};
      this.subscribeWithFilter = this.subscribeWithFilter.bind(this);
    }

    componentDidMount() {
      this.subscribeWithFilter();
    }

    componentWillUnmount() {

        unsubscribe("blockedwork");
    }


    toDescription(type) {
        return {
            "SKIP_ITEM_SCAN": "Skipped",
            "SUBSTITUTION": "Substitution",
            "SHORT": "Shorted",
            "BUTTON": "Button",
            "COMPLETE": "Complete",
            "LOW": "Low"
        }[type];
    }

    subscribeWithFilter() {
      let interval = this.refs.createdFilter.getInterval();
      var filter = {
        resolved: false
      };
      if (interval) {
        filter['created'] = interval.toQueryParameterValue();
      }
      this.setState({filter: filter});
      subscribe("blockedwork", fetchUnresolvedIssuesByType.bind(null, filter));
    }

    renderTabbedArea(issuesSummary) {
        let sortedSummary = issuesSummary.filter(summary => {
            let type = summary.get("eventType");
            let description = this.toDescription(type);
            const hasDescription =  !(typeof description === 'undefined' || description == null);
            return hasDescription;
          }).sortBy((summary) => summary.get("eventType"));

        let firstType = sortedSummary.first().get("eventType");
        const {filter} = this.state;
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
                                 key={type}
                                 tab={<span>
                                      {description && description.toUpperCase()}
                                      <Badge style={{marginLeft: "1em"}} className="badge-primary">{total}</Badge>
                                      </span>}>
                                   <IssuesIBox type={type} filter={filter}/>
                                </TabPane>);
                                }).toArray()
                    }
            </TabbedArea>
                </IBoxBody>
                </IBox>

        );
    }

    render() {
        let title = "Issues";
        let issuesSummary = getIssuesSummary();
        let issuesSummaryResults = issuesSummary.get("results") || List();
        let filteredIssueSummaryResults = issuesSummaryResults
                .filter((summary) => summary.get("eventType") !== "COMPLETE");
        return (
                <DocumentTitle title={title}>
        <PageGrid>
            <Row>
                <Col sm={12}>
                  <WrapInput label="Created Date">
                    <DayOfWeekFilter ref="createdFilter" onChange={this.subscribeWithFilter} />
                  </WrapInput>
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
