import  React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import Immutable from 'immutable';
import {Table} from 'components/common/Table';
import {UnresolvedEvents} from './EventsGrid';
import {keyIn} from 'lib/predicates';
import {getTypeIssues, getItemIssues} from 'data/issues/store';
import {fetchTypeIssues, fetchItemIssues, subscribe, unsubscribe} from 'data/issues/actions';
import {IssueActions} from './IssueActions';

function itemKeys(item, type) {
    let itemId = item.get("itemId");
    let location = item.get("location");
    return [type, "false", itemId, location];
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
        this.rowActionComponent = IssueActions;

        this.state = {
            "selectedGroup": null
        };
    }

    getIssuesByItem(item) {
      let {type, filter} = this.props;
      return getItemIssues(itemKeys(item, type)).get("results");
    }

    handleSelectedGroup(expanded, item, rowNumber, e) {
        if (expanded) {
          this.setState({"selectedGroup" : item}, () => {
            let {type, filter} = this.props;
            let itemId = item.get("itemId");
            let location = item.get("location");

            fetchItemIssues(
              itemKeys(item, type),
              {filterBy: {
                  ...filter,
                  type: type,
                  itemId: itemId,
                  location: location
              }});
          });
        }
        else {
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

    render() {
        let {type, groupBy} = this.props;
        let typeIssues = getTypeIssues([type, "false", groupBy]);
        let results  = typeIssues.get("results").map((item) => {
          return item.set('type', type);
        });
        let {selectedGroup} = this.state;
        let handleOnRowExpand = this.handleSelectedGroup.bind(this, true);
        let handleOnRowCollapse = this.handleSelectedGroup.bind(this, false);
        let expandFunc = this.shouldExpand.bind(this, selectedGroup);
        return (
                <Table results={results}
                       columns={this.issueColumns}
                       columnMetadata={this.issueColumnMetadata}
                       rowActionComponent={this.rowActionComponent}
                       onRowExpand={handleOnRowExpand}
                       onRowCollapse={handleOnRowCollapse}
                       expand={expandFunc}>
                </Table>
               );
    }
};

IssuesByItem.propTypes = {
    type: React.PropTypes.string.isRequired,
};
