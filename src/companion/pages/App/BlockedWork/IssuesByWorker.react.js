import  React from 'react';
import DocumentTitle from 'react-document-title';
import _ from 'lodash';
import Immutable from 'immutable';
import {Table} from 'components/common/Table';
import {UnresolvedEvents} from './EventsGrid';
import {keyIn} from 'lib/predicates';
import {getTypeIssues, getItemIssues} from 'data/issues/store';
import {fetchTypeIssues, fetchItemIssues} from 'data/issues/actions';


function itemKeys(item, type, resolved) {
    let id = item.get("id");
    return [type, "false", id];
}

export default class IssuesByWorker extends React.Component{

    constructor(props) {
        super(props);
        this.issueColumnMetadata = [
            {
                columnName: "name",
                displayName: "Name"
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
        let {type, resolved} = this.props;
        return getItemIssues(itemKeys(item, type, resolved)).get("results");
    }

    handleSelectedGroup(expanded, item, rowNumber, e) {
        if (expanded) {
          this.setState({"selectedGroup" : item}, ()=> {
            let {type, resolved, filter} = this.props;
            let id = item.get("id");
            fetchItemIssues(
              itemKeys(item, type, resolved),
              {filterBy: {
                  ...filter,
                  type: type,
                  workerId: id,
                  resolved: resolved
              }});
          });
        }
        else {
            this.setState({"selectedGroup" : null});
        }
    }

    shouldExpand(selectedGroup, row) {
        if (selectedGroup) {
            var selectedSubset = selectedGroup.filter(keyIn("id"));
            var rowSubset = row.filter(keyIn("id"));
            if (Immutable.is(selectedSubset, rowSubset)) {
                let issues = this.getIssuesByItem(row);
                return <UnresolvedEvents events={issues} />;
            }
        }
        return null;
    }

    render() {
        let {type, resolved, groupBy} = this.props;
        let typeIssues = getTypeIssues([type, "false", groupBy]);
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

IssuesByWorker.propTypes = {
    type: React.PropTypes.string.isRequired,
};
