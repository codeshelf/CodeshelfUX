import  React from 'react';
import DocumentTitle from 'react-document-title';
import {Overlay, Popover, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'components/common/PureComponent';
import DateDisplay from 'components/common/DateDisplay';
import {Table} from 'components/common/Table';
import _ from 'lodash';
import {resolveIssue, replenItem} from 'data/issues/actions';
import {Barcode} from "components/common/Barcode";


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
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
  }
  render() {
    let {rowData, style, onClick, iconName, title, className} = this.props;
    let {result} = this.state;
    let clickHandler = (e) =>{
        _.partial(onClick, rowData).bind(this)().then((result) => {
          const value = result.scannableId;
          const component = (
            <div>
              <Barcode value={value} width={240} height={100} />
              {value}
            </div>
          );

          this.setState({result: {title: "Success", "message" : component }});
        }, (e) => {
          const message = e.body.errors.join("\n");
          this.setState({result: {title: "Error", "message": message}});
        });
    };
    return (
        <span>

          <Button className={className} bsStyle="primary" style={style} onClick={clickHandler} title={title}>
            <Icon name={iconName} />

          </Button>
          <Overlay
            show={(result != null)}
            placement="left"
            target={()=> React.findDOMNode(this)}
            rootClose={true}
            onHide={()=>{this.setState({result: null});}} >
              <Popover className={result && result.title.toLowerCase()} title={result && result.title}>{result && result.message}</Popover>
          </Overlay>
        </span>
    );
  }
}

class IssueActions extends React.Component {


  render() {
    let {rowData} = this.props;
    const type = rowData.get("type");
    return (

        <div>
        {(type === "LOW" || type === "SHORT" || type === "SUBSTITUTION") &&
         <IssueButton className="replen" rowData={rowData} onClick={replenItem} iconName="retweet" title="Replenish"/> }
        <IssueButton rowData={rowData} onClick={resolveIssue} iconName="check" title="Resolve" style={{marginLeft: ".5em"}}/>


        </div>);
   }
}
