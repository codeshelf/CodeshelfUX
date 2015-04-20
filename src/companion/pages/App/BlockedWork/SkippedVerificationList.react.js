import  React from 'react';
import DocumentTitle from 'react-document-title';
import {List, Record} from "immutable";
import Chance from 'chance';
import _ from 'lodash';
import Griddle from 'griddle-react';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';
import DateDisplay from 'components/common/DateDisplay';
const chance = new Chance();

const UPCSkipIssue = Record({
        timestamp: null,
        worker: null,
        workDetail: null
    }
);

export default class SkippedVerificationList extends React.Component{

    constructor() {
        this.columnMetadata = [
            {
                columnName: "timestamp",
                displayName: "Last",
                customComponent: DateDisplay
            },
            {
                columnName: "worker",
                displayName: "Worker"
            },
            {
                columnName: "upc",
                displayName: "UPC"
            },
            {
                columnName: "workDetail",
                displayName: "Work Detail"
            },
            {
                columnName: "action",
                displayName: "",
                customComponent: Resolve
            }
        ];
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);

        this.issues = List(_.range(12).map((i) => {
            return UPCSkipIssue({
                persistentId: chance.guid(),
                timestamp: chance.hammertime(),
                worker: {},
                workDetail: {}
            });
        }));
    }

    render() {

        return (<DocumentTitle title="Skipped UPC Verification">
                <div>
                    <a>By Item</a>| <a>By Worker</a>
                    <Griddle results={this.issues.toJS()}
                     columns={this.columns}
                     columnMetadata={this.columnMetadata} />
                </div>
                </DocumentTitle>
               );
    }
};

class Resolve extends React.Component {
    render() {
        return (<Button bsStyle="primary"><Icon name="close" /></Button>);

    }
}
