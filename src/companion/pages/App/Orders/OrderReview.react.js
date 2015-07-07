import  React from "react";
import _ from "lodash";
import {Map, fromJS} from "immutable";
import {getFacilityContext} from "data/csapi";
import {StatusSummary} from "data/types";
import {Table} from "components/common/Table";
import {Select, Input} from 'components/common/Form';
import {Row, Col} from 'components/common/pagelayout';
import OrderDetailList from "./OrderDetailList";

export default class OrderReview extends React.Component{

    constructor(props) {
        super(props);
        this.state= {
            selectedOrderId: null,
            orderDetails: Map()
        };

        this.columnMetadata = [
            {columnName:  "persistentId", displayName: "UUID"},
            {columnName:  "orderId", displayName: "ID"},
            {columnName:  "customerId", displayName: "Customer"},
            {columnName:  "shipperId", displayName: "Shipper"},
            {columnName:  "destinationId", displayName: "Destination"},
            {columnName:  "containerId", displayName: "Container"},
            {columnName:  "readableDueDate", displayName: "Due Date"},
            {columnName:  "status", displayName: "Status"},
            {columnName:  "orderLocationAliasIds", displayName: "Location"},
            {columnName:  "groupUi", displayName: "Group"},
            {columnName:  "active", displayName: "Active"},
            {columnName:  "fullDomainId", displayName: "Full ID"},
            {columnName:  "wallUi", displayName: "Wall"},
            {columnName:  "readableOrderDate", displayName: "Order Date"},
            {columnName:  "orderType", displayName: "Type"}

        ];
        this.columns = ["orderId", "customerId", "shipperId", "destinationId", "containerId", "readableDueDate", "status", "readableDueDate"];
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
    render() {
        let orders = this.props.orders.sortBy(order => order.get("orderId"));

        return (<div>
                <Table results={orders} columns={this.columns}
                    columnMetadata={this.columnMetadata}
                    sortedBy="+orderId"
                    expand={this.shouldExpand.bind(this)}
                    onRowExpand={this.handleRowExpand.bind(this)}
                    onRowCollapse={this.handleRowCollapse.bind(this)} />
                </div>);
    }
};
