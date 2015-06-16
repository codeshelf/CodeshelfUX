import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'components/common/PureComponent';
import DateDisplay from 'components/common/DateDisplay';
import {Table} from 'components/common/Table';
import _ from 'lodash';
import {resolveIssue} from 'data/issues/actions';

class EventsGrid extends React.Component {
    constructor() {
        super();
        this.columnMetadata = [
            {
                columnName: "workerName",
                displayName: "Worker"
            },
            {
                columnName: "itemId",
                displayName: "Item"
            },
            {
                columnName: "itemUom",
                displayName: "UOM"
            },
            {
                columnName: "itemLocation",
                displayName: "Location"
            },
            {
                columnName: "orderId",
                displayName: "Order"
            },
            {
                columnName: "wiActualQuantity",
                displayName: "Actual"
            },
            {
                columnName: "wiPlanQuantity",
                displayName: "Plan"
            },/*
               {
               columnName: "itemLocation",
               displayName: "Where"
               },*/
            {
                columnName: "createdAt",
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

    handleClick(rowData) {
        resolveIssue(rowData);
    }

    render() {
        let {rowData} = this.props;
        let clickHandler = _.partial(this.handleClick, rowData).bind(this);
        return (<Button bsStyle="primary" onClick={clickHandler}><Icon name="check" /></Button>);
    }
}
