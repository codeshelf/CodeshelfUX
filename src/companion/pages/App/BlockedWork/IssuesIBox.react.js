var React = require('react');
import {Select, Checkbox} from 'components/common/Form';
var _ = require('lodash');

var {IBox, IBoxBody}  = require('components/common/IBox');
import {Row, Col} from 'components/common/pagelayout';

import IssuesByItem from './IssuesByItem';
import {List, Map, fromJS, Set} from 'immutable';
import {fetchTypeIssues, fetchItemIssues} from 'data/issues/actions';
import {getTypeIssues, getItemIssues} from 'data/issues/store';


function keyIn(/*...keys*/) {
    var keySet = Set(arguments);
    return function (v, k) {
        return keySet.has(k);
    };
}


export default class IssuesIBox extends React.Component {
    constructor(props) {
        this.state = {
            "groupBy": "item",
            "resolved": false,
            "selectedGroup" : null
        };
    }

    getIssuesByItem(item) {
        //issues().filterBy(item).sortBy("order");
            //return issues.filter((issue) => issue.get("item") === item).sortBy(issue => issue.get("order"));
        let {type} = this.props;
        let {resolved} = this.state;
        let {itemId} = item.get("itemId");

        return getItemIssues([type, resolved.toString(), itemId]).get("results");
    }

    handleSelectedGroup(expanded, item, rowNumber, e) {
        if (expanded) {
            this.setState({"selectedGroup" : item});

            let {type} = this.props;
            let {resolved} = this.state;
            let {itemId} = item.get("itemId");
            fetchItemIssues([type, resolved.toString(), itemId], {filterBy: {
                type: type,
                itemId: itemId,
                resolved: resolved
            }});

        }
        else {

            this.setState({"selectedGroup" : null});
        }

    }

    handleGroupBy(groupBy) {
        this.setState({groupBy: groupBy});
    }

    handleResolved(resolved) {
        this.setState({resolved: resolved});
    }

    componentWillMount() {
        let {type} = this.props;
        let {groupBy, resolved} = this.state;
        fetchTypeIssues([type, resolved.toString()], {groupBy: groupBy,
                               filterBy: {
                                   type: type,
                                   resolved: resolved
                               }});
        //issues().pick("item", "worker", "type").filter(filter).groupBy(groupField).count().sortBy(sortField).take(100);
    }

    render() {
        let {type} = this.props;
        let {groupBy, resolved, selectedGroup} = this.state;
        let typeIssues = getTypeIssues([type, resolved.toString()]);
        let results  = typeIssues.get("results");
        let total = typeIssues.get("total");
        let sortedBy = typeIssues.get("sortedBy");

        return (
                   <IBox>
                      <IBoxBody>
                          <form role="form">
                          <Row>
                              <Col sm={6} lg={3}>
                                  <Select id="groupBy" label='Group By' value={groupBy} options={[{value: "item", label: "Item"}, {value:"worker", label: "Worker"}]} onChange={this.handleGroupBy.bind(this)}/>
                              </Col>
                              <Col sm={6} lg={3} >
                                  <Checkbox id="r" label="Show Resolved Only" value={resolved} onChange={this.handleResolved.bind(this)} />
                              </Col>
                            </Row>
                          </form>
                          <IssuesByItem onSelectedGroup={this.handleSelectedGroup.bind(this)} issues={results} expand={selectedGroup} expandSource={this.getIssuesByItem.bind(this)}/>
                      </IBoxBody>
                      </IBox>
              );
    }

    groupByItem(workDetails) {
        var groupedDetails = workDetails.groupBy((workDetail) => {
            return (workDetail.get("sku") + ":" + workDetail.get("uom"));
        });
        var list = groupedDetails.keySeq().map((key) => {
            var sameItems = groupedDetails.get(key);
            var first = sameItems.first();
            var sku =  first.get("sku");
            var description = first.get("description") ? first.get("description"): "";
            return Map({
                key: key,
                sku: sku,
                gtin: sku,
                uom: first.get("uom"),
                description: description,
                itemDescription: description,
                issueCount: sameItems.size,
                lineCount: sameItems.size,
                details: sameItems
            });
        });

        return list;
    }

}
IssuesIBox.propTypes = {
    workDetails: React.PropTypes.array.isRequired
};
