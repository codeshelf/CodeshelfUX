import  React from 'react';
import DocumentTitle from 'react-document-title';
import Griddle from 'griddle-react';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';
import DateDisplay from 'components/common/DateDisplay';


class EventsGrid extends React.Component {
    constructor() {
            this.columnMetadata = [
                {
                    columnName: "eventTimestamp",
                    displayName: "Time",
                    customComponent: DateDisplay
                },
                {
                    columnName: "workerId",
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
            ];
    }

    componentWillMount() {
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }

    render() {

            return <Griddle results={this.props.events.toJS()}
             columns={this.columns}
             columnMetadata={this.columnMetadata} />;

    }
}

export class UnresolvedEvents extends EventsGrid {
    constructor() {
        super();
        this.columnMetadata.push.apply(this.columnMetadata, [
            {
                columnName: "action",
                displayName: "",
                customComponent: Resolve
            }
        ]);
    }
}

export class ResolvedEvents extends EventsGrid {

    constructor() {
        super();
        this.columnMetadata.push.apply(this.columnMetadata, [
            {
                columnName: "resolvedTimestamp",
                displayName: "Resolved",
                customComponent: DateDisplay
            },
            {
                columnName: "resolvedBy",
                displayName: "Resolved By"
            }]);
    }

};


class Resolve extends React.Component {
    render() {
        return (<Button bsStyle="primary"><Icon name="close" /></Button>);

    }
}
