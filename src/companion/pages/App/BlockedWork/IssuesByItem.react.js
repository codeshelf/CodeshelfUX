import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Table} from 'components/common/Table';
import {UnresolvedEvents} from './EventsGrid';


export default class IssuesByItem extends React.Component{

    constructor() {
        this.issueColumnMetadata = [
            {
                columnName: "sku",
                displayName: "Item"
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
                columnName: "issueCount",
                displayName: "Count"
            }
        ];

        this.issueColumns = _.map(this.issueColumnMetadata, (c) => c.columnName);
    }

    render() {
        let {issues, expand, expandSource} = this.props;
        return (
                <Table results={issues} columns={this.issueColumns} columnMetadata={this.issueColumnMetadata} expand={expand} ExpandComponent={produceExpandClass(expandSource)}>

                </Table>
               );
    }
};
IssuesByItem.propTypes = {

    issues: React.PropTypes.object.isRequired,
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
