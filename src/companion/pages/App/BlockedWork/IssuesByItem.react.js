import  React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import Immutable from 'immutable';
import {Table} from 'components/common/Table';
import {UnresolvedEvents} from './EventsGrid';
import {keyIn} from 'lib/predicates';
import {getTypeIssues, getItemIssues} from 'data/issues/store';
import {fetchTypeIssues, fetchItemIssues, subscribe, unsubscribe} from 'data/issues/actions';


function itemKeys(item, type, resolved) {
    let itemId = item.get("itemId");
    let location = item.get("location");
    return [type, resolved.toString(), itemId, location];
}

export default class IssuesByItem extends React.Component{

    constructor(props) {
        super(props);
        this.issueColumnMetadata = [
            {
                columnName: "itemId",
                displayName: "Item"
            },

            {
                columnName: "location",
                displayName: "Location"
            },
            {

                columnName: "uom",
                displayName: "UOM"
            },
            {
                columnName: "description",
                displayName: "Description"
            },
            {
                columnName: "count",
                displayName: "Count"
            }
        ];

        this.issueColumns = _.map(this.issueColumnMetadata, (c) => c.columnName);

        this.state = {
            "selectedGroup": null
        };
    }

    getIssuesByItem(item) {
let {type, resolved, filter} = this.props;
        return getItemIssues(itemKeys(item, type, resolved)).get("results");
    }

    handleSelectedGroup(expanded, item, rowNumber, e) {
        if (expanded) {
            this.setState({"selectedGroup" : item});

            let {type, resolved, filter} = this.props;
            let itemId = item.get("itemId");
            let location = item.get("location");
            var partialFunc = fetchItemIssues.bind(null,
                                  itemKeys(item, type, resolved),
                                  {filterBy: {
                                      ...filter,
                                      type: type,
                                      itemId: itemId,
                                      resolved: resolved,
                                      location: location
                                  }});
            unsubscribe("expanded");
            subscribe("expanded", partialFunc);
        }
        else {
            unsubscribe("expanded");
            this.setState({"selectedGroup" : null});
        }
    }

    shouldExpand(selectedGroup, row) {
        if (selectedGroup) {
            var selectedSubset = selectedGroup.filter(keyIn("itemId", "location", "uom"));
            var rowSubset = row.filter(keyIn("itemId", "location", "uom"));
            if (Immutable.is(selectedSubset, rowSubset)) {
                let issues = this.getIssuesByItem(row);
                return <UnresolvedEvents events={issues} />;
            }
        }
        return null;
    }

        subscribeToIssues() {
            let {type, resolved, groupBy, filter} = this.props;
            let partialFunc = fetchTypeIssues.bind(null,
                                                   [type, resolved.toString(), groupBy],
                                                   {groupBy: groupBy,
                                                    filterBy: {
                                                        ...filter,
                                                        type: type,
                                                        resolved: resolved
                                                    }});

            subscribe(type, partialFunc);
            //issues().pick("item", "worker", "type").filter(filter).groupBy(groupField).count().sortBy(sortField).take(100);
        }

        unsubscribeToIssues() {
            unsubscribe(this.props.type);
        }

        componentWillMount() {
            this.subscribeToIssues();
        }

        componentWillUnmount() {
            this.unsubscribeToIssues();
        }

    render() {
        let {type, resolved, groupBy} = this.props;
        let typeIssues = getTypeIssues([type, resolved.toString(), groupBy]);
        let results  = typeIssues.get("results");
        let {selectedGroup} = this.state;
        let handleOnRowExpand = this.handleSelectedGroup.bind(this, true);
        let handleOnRowCollapse = this.handleSelectedGroup.bind(this, false);
        let expandFunc = this.shouldExpand.bind(this, selectedGroup);
        return (
                <Table results={results}
                       columns={this.issueColumns}
                       columnMetadata={this.issueColumnMetadata}
                       onRowExpand={handleOnRowExpand}
                       onRowCollapse={handleOnRowCollapse}
                       expand={expandFunc}>
                </Table>
               );
    }
};

IssuesByItem.propTypes = {
    type: React.PropTypes.string.isRequired,
    resolved: React.PropTypes.bool.isRequired
};
