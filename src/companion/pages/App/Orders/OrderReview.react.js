import  React from "react";
import {DropdownButton} from "react-bootstrap";
import Icon from "react-fa";
import _ from "lodash";
import {Map, List, fromJS, Record, Seq} from "immutable";
import {getFacilityContext} from "data/csapi";
import {StatusSummary} from "data/types";
import {Table} from "components/common/Table";
import ListManagement from "components/common/list/ListManagement";
import DateDisplay from 'components/common/DateDisplay';
import PureComponent from 'components/common/PureComponent';
import {Row, Col} from 'components/common/pagelayout';
import OrderDetailList from "./OrderDetailList";


let desc = (b) => b * -1;

let ascFunc = (a, b) => {
    if (a < b) return -1;
        if (a > b) return 1;
    return 0;
};


var SortSpec = Record({
    property: null,
    direction: "asc",
    sortFunction: ascFunc
});

function toFullSortSpecs(columns, sortSpecs) {
    return columns.reduce((fullSortSpecs, c) => {
        let columnName = c;
        let order = sortSpecs.getIn([columnName, "order"]);
        if (order) {
            return fullSortSpecs.push(SortSpec({direction: order, property: columnName}));
        } else {
            return fullSortSpecs;
        }

    }, List())
    .map((spec) => {
        if (spec.direction === "desc") {
            return spec.set("sortFunction",  _.compose(desc, ascFunc)); // compose = desc(ascFunc(a,b))
        } else {
            return spec.set("sortFunction", ascFunc);
        }
    });;
}

export default class OrderReview extends React.Component{

    constructor(props) {
        super(props);

            this.columnMetadata = fromJS([
            {columnName:  "persistentId", displayName: "UUID"},
            {columnName:  "orderId", displayName: "ID"},
            {columnName:  "customerId", displayName: "Customer"},
            {columnName:  "shipperId", displayName: "Shipper"},
            {columnName:  "destinationId", displayName: "Destination"},
            {columnName:  "containerId",           displayName: "Container"},
            {columnName:  "status",                displayName: "Status"},
            {columnName:  "orderLocationAliasIds", displayName: "Location"},
            {columnName:  "groupUi", displayName: "Group"},
            {columnName:  "active", displayName: "Active"},
            {columnName:  "fullDomainId", displayName: "Full ID"},
            {columnName:  "wallUi", displayName: "Wall"},
            {columnName:  "orderType", displayName: "Type"},
            {columnName:  "dueDate", displayName: "Due Date", customComponent: DateDisplay},
            {columnName:  "orderDate", displayName: "Order Date", customComponent: DateDisplay},


        ]);

        this.state= {
            selectedOrderId: null,
            orderDetails: Map()
        };
        this.handleRowExpand = this.handleRowExpand.bind(this);
        this.handleRowCollapse = this.handleRowCollapse.bind(this);
        this.shouldExpand = this.shouldExpand.bind(this);
    }

    handleRowExpand(row) {
        let persistentId = row.get("persistentId");
        let orderId = row.get("orderId");
        this.setState({selectedOrderId: persistentId});
        this.fetchOrderDetails(orderId);
    }

    handleRowCollapse(row) {
        this.setState({selectedOrderId: null});
    }

    fetchOrderDetails(orderId) {
        getFacilityContext().getOrderDetails(orderId).then((orderDetails) => {
            let oldOrderDetails = this.state.orderDetails;
            let newOrderDetails = oldOrderDetails.set(orderId, fromJS(orderDetails));
            this.setState({"orderDetails": newOrderDetails});
        });
    }

    findOrderDetails(orderId) {
        this.state.orderDetails.get(orderId);
    }

    shouldExpand(row) {
        let {selectedOrderId} = this.state;
        if (row.get("persistentId") === selectedOrderId) {
            let orderDetails = this.state.orderDetails.get(row.get("orderId"));
            return <OrderDetailList orderDetails={orderDetails} />;
        }
        return null;

    }

    getAllSelected(select) {
        var result = [];
        var options = select && select.options;
        var opt;

        for (var i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        return result;
    }

    handleColumnMove(moved, afterName) {

        this.props.columns((columns) => {
            let formerPosition = columns.indexOf(moved);
            let newPosition = columns.indexOf(afterName);
            let after = columns.splice(formerPosition, 1)
                    .splice(newPosition, 0, moved);
            return after;
        });
    }

    handleColumnSortChange(columnName, direction) {
            this.props.sortSpecs((oldSortSpec)=>{
                return oldSortSpec.set(columnName, Map({order: direction}));
            });
    }

    render() {

        let {columns, sortSpecs, orders} = this.props;
        let {columnMetadata} = this;

            return (
                <ListManagement results={orders}
                 columns={columns}
                 columnMetadata={columnMetadata}
                 keyColumn="orderId"
                 sortSpecs={sortSpecs}
                 expand={this.shouldExpand}
                 onRowExpand={this.handleRowExpand}
                 onRowCollapse={this.handleRowCollapse}
                 allowExport={true}/>
            );
    }
};
OrderReview.displayName = "OrderReview";
