import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Table} from 'components/common/Table';
import {UnresolvedEvents} from './EventsGrid';
import _ from 'lodash';

const noop = () => {};
export default class IssuesByItem extends React.Component{

    constructor() {
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
    }

    render() {
        let {issues, expand, expandSource, onSelectedGroup} = this.props;
        let handleOnRowExpand = (onSelectedGroup) ? _.partial(onSelectedGroup, true) : noop;
        let handleOnRowCollapse = (onSelectedGroup) ? _.partial(onSelectedGroup, false) : noop;
        return (
                <Table results={issues}
                       columns={this.issueColumns}
                       columnMetadata={this.issueColumnMetadata}
                       onRowExpand={handleOnRowExpand}
                       onRowCollapse={handleOnRowCollapse}
                       expand={expand}
                       ExpandComponent={produceExpandClass(expandSource)}>
                </Table>
               );
    }
};
IssuesByItem.propTypes = {

    issues: React.PropTypes.object.isRequired,
    onSelectedGroup: React.PropTypes.func,
    expandSource: React.PropTypes.func.isRequired,
    expand: React.PropTypes.object
};

function produceExpandClass(expandSource) {
    class ExpandIssues extends React.Component {
        render() {
            let {
                row
            } = this.props;
            let issues = expandSource(row);
            return <UnresolvedEvents events={issues} />;
        }
    }
    ExpandIssues.propTypes = {
        row: React.PropTypes.object.isRequired
    };
    return ExpandIssues;
}
