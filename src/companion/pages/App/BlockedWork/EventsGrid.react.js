import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';
import DateDisplay from 'components/common/DateDisplay';
import {Table} from 'components/common/Table';

class EventsGrid extends React.Component {
    constructor() {
            this.columnMetadata = [
                {
                    columnName: "orderId",
                    displayName: "Order"
                },
                {
                    columnName: "actualQuantity",
                    displayName: "Actual"
                },
                {
                    columnName: "planQuantity",
                    displayName: "Plan"
                },
                {
                    columnName: "locationId",
                    displayName: "Where"
                },
                {
                    columnName: "eventTimestamp",
                    displayName: "Occurred",
                    customComponent: DateDisplay
                }
            ];
    }

    componentWillMount() {
        this.columns = _.map(this.columnMetadata, (column) => column.columnName);
    }

    render() {
            return <Table results={this.props.events.toJS()}
             columns={this.columns}
             columnMetadata={this.columnMetadata} />;

    }
}
EventsGrid.propTypes = {
    events: React.PropTypes.object.isRequired
}

export class UnresolvedEvents extends EventsGrid {
    constructor() {
        super();
        this.columnMetadata.push.apply(this.columnMetadata, [
            {
                columnName: "action",
                displayName: "Resolve",
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
                columnName: "resolution",
                displayName: "Resolution"
            },
            {
                columnName: "resolver",
                displayName: "Resolver"
            }]);
    }

};


class Resolve extends React.Component {
    render() {
        return (<Button bsStyle="primary"><Icon name="check" /></Button>);

    }
}

class WorkerCellDisplay extends React.Component {
    render() {
        let worker = this.props.data;
        return (<a>{worker.lastName}, {worker.firstName}</a>);

    }
}

class ItemCellDisplay extends React.Component {
    render() {
        let item = this.props.data;
        return (<a>{item.gtin}</a>);

    }
}
