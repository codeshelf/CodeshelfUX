import React from 'react';
import DocumentTitle from 'react-document-title';
import {Badge, TabbedArea, TabPane} from 'react-bootstrap';
import _ from 'lodash';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody} from 'components/common/IBox';
import {Form, WrapInput, Input, Select, SubmitButton, getRefInputValue} from 'components/common/Form';
import DayOfWeekFilter from 'components/common/DayOfWeekFilter';
import {getFacilityContext} from 'data/csapi';
import {fetchUnresolvedIssuesByType, fetchTypeIssues} from 'data/issues/actions';
import {getIssuesSummary} from 'data/issues/store';
import {List} from 'immutable';
import IssuesByItem from './IssuesByItem';
import IssuesByWorker from './IssuesByWorker';

export default class BlockedWork extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        "groupBy": "item",
      };
      this.updateFilter = this.updateFilter.bind(this);
    }

    componentDidMount() {
      this.updateFilter();
    }

    componentWillUnmount() {

    }


    toDescription(type) {
        return {
            "SKIP_ITEM_SCAN": "Skipped",
            "SUBSTITUTION": "Substitution",
            "SHORT": "Shorted",
            "LOW": "Low"
        }[type];
    }

    handleGroupBy(e) {
      let groupBy = e.target.value;
      this.setState({groupBy: groupBy}, () => {
        this.updateFilter();
      });
    }

    updateFilter() {

      let interval = this.refs.createdFilter.getInterval();
      var filter = {
        resolved: false
      };
      if (interval) {
        filter['created'] = interval.toQueryParameterValue();
      }
      this.setState({filter: filter}, () =>{
        const {groupBy} = this.state;
        fetchUnresolvedIssuesByType(filter).then(()=> {
          let issuesSummary = getIssuesSummary();
          let issuesSummaryResults = issuesSummary.get("results") || List();
          let sortedSummary = issuesSummaryResults
          .filter(summary => {
            const type = summary.get("eventType");
            let description = this.toDescription(type);
            const hasDescription =  !(typeof description === 'undefined' || description == null);
            return hasDescription;
          })
          .sortBy((summary) => summary.get("eventType"))
          .forEach((summary) =>{
            const type = summary.get("eventType");

            fetchTypeIssues(
              [type, "false", groupBy],
              {groupBy: groupBy,
               filterBy: {
                   ...filter,
                 type: type
               }});
          });
        });
      });
    }


    renderTabbedArea(issuesSummary) {
        const first = issuesSummary.first();
        let firstType = first && first.get("eventType");
        const {filter, groupBy} = this.state;
        return (
                <IBox>
                <IBoxBody>
                <TabbedArea className="nav-tabs-simple" defaultActiveKey={firstType} >
                {
                    issuesSummary.map((summary) => {
                        let type = summary.get("eventType");
                        let description = this.toDescription(type);
                        let total = summary.get("count");
                        return (<TabPane eventKey={type}
                                 key={type}
                                 tab={<span>
                                      <span className="name">{description && description.toUpperCase()}</span>
                                      <Badge style={{marginLeft: "1em"}} className="badge-primary">{total}</Badge>
                                      </span>}>
                                <IBox>
                                  <IBoxBody>
                                  {
                                  (groupBy === "item") ?
                                    <IssuesByItem  groupBy="item" type={type} filter={filter} />
                                    :
                                    <IssuesByWorker groupBy="worker" type={type} filter={filter} />
                                  }
                                  </IBoxBody>
                                </IBox>
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
      let sortedSummary = issuesSummaryResults.filter(summary => {
        let type = summary.get("eventType");
        let description = this.toDescription(type);
        const hasDescription =  !(typeof description === 'undefined' || description == null);
        return hasDescription;
      }).sortBy((summary) => summary.get("eventType"));
      const {groupBy} = this.state;
      return (
                <DocumentTitle title={title}>
                  <PageGrid>
                    <Row>
                      <Col sm={12} lg={3}>
                        <WrapInput label="Created Date">
                          <DayOfWeekFilter ref="createdFilter" onChange={this.updateFilter} />
                        </WrapInput>
                      </Col>
                      <Col sm={12} lg={3}>
                        <form role="form">
                          <WrapInput label="Group By">
                            <Select id="groupBy" label='' value={groupBy} options={[{value: "item", label: "Item"}, {value:"worker", label: "Worker"}]} onChange={this.handleGroupBy.bind(this)}/>
                          </WrapInput>
                        </form>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                  {(sortedSummary.count() > 0) ?
                    this.renderTabbedArea(sortedSummary) :
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
