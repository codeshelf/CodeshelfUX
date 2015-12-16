import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Button} from 'react-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'components/common/PureComponent';
import DateDisplay from 'components/common/DateDisplay';
import {Table} from 'components/common/Table';
import _ from 'lodash';
  import {resolveIssue, replenItem} from 'data/issues/actions';

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
             columnMetadata={this.columnMetadata}
             rowActionComponent={this.rowActionComponent}/>;

    }
}
EventsGrid.propTypes = {
    events: React.PropTypes.object.isRequired
}

export class UnresolvedEvents extends EventsGrid {
    constructor() {
        super();
        this.rowActionComponent = IssueActions;
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
            },
            {
                columnName: "resolver",
                displayName: "Resolver"
            }]);
    }

};

class IssueButton extends React.Component {
  handleClick(rowData) {
    replenItem(rowData);
  }

  render() {
let {rowData, style, onClick, iconName, title} = this.props;
    let clickHandler = _.partial(onClick, rowData).bind(this);
        return (<Button bsStyle="primary" style={style} onClick={clickHandler} title={title}><Icon name={iconName} /></Button>);
  }
}

class IssueActions extends React.Component {

  render() {
    let {rowData} = this.props;
    return (
      <div>
        {(rowData.get("type") === "LOW" || rowData.get("type") === "SHORT") &&
          <IssueButton rowData={rowData} onClick={replenItem} iconName="retweet" title="Replenish"/> }
          <IssueButton rowData={rowData} onClick={resolveIssue} iconName="check" title="Resolve" style={{marginLeft: ".5em"}}/>
      </div>);
   }
}
