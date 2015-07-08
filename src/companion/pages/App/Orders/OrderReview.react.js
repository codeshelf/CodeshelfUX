import  React from "react";
import {DropdownButton} from "react-bootstrap";
import Icon from "react-fa";
import _ from "lodash";
import {Map, fromJS} from "immutable";
import {getFacilityContext} from "data/csapi";
import {StatusSummary} from "data/types";
import {Table} from "components/common/Table";
import {MultiSelect, Input} from 'components/common/Form';

import {Row, Col} from 'components/common/pagelayout';
import OrderDetailList from "./OrderDetailList";

export default class OrderReview extends React.Component{

    constructor(props) {
        super(props);

        this.columnMetadata = [
            {columnName:  "persistentId", displayName: "UUID"},
            {columnName:  "orderId", displayName: "ID"},
            {columnName:  "customerId", displayName: "Customer"},
            {columnName:  "shipperId", displayName: "Shipper"},
            {columnName:  "destinationId", displayName: "Destination"},
            {columnName:  "containerId",           displayName: "Container"},
            {columnName:  "readableDueDate",       displayName: "Due Date"},
            {columnName:  "status",                displayName: "Status"},
            {columnName:  "orderLocationAliasIds", displayName: "Location"},
            {columnName:  "groupUi", displayName: "Group"},
            {columnName:  "active", displayName: "Active"},
            {columnName:  "fullDomainId", displayName: "Full ID"},
            {columnName:  "wallUi", displayName: "Wall"},
            {columnName:  "readableOrderDate", displayName: "Order Date"},
            {columnName:  "orderType", displayName: "Type"}

        ];
        this.columnMetadata = _.map(this.columnMetadata, (metadata, i) => {
            metadata.order = i;
            return metadata;
        })

        this.state= {
            selectedOrderId: null,
            orderDetails: Map(),
            columns: ["orderId", "customerId", "shipperId", "destinationId", "containerId", "readableDueDate", "status", "readableDueDate"]
        };

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

    storeColumns(columns) {
        this.setState({columns: columns});
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
    
    render() {
        let orders = this.props.orders.sortBy(order => order.get("orderId"));
        let {columns} = this.state;
        let options = _.map(this.columnMetadata, (columnMetadata) => {
            return {label: columnMetadata.displayName, value: columnMetadata.columnName};
        })
        return (<div>
                <Row>
                <Col sm={12} >
                <DropdownButton className="pull-right" title={<Icon name="gear" />}>
                <MultiSelect options={options} values={columns} onChange={(data) => this.storeColumns(data)}/>
                </DropdownButton>
                </Col>
                </Row>
                <Table results={orders} columns={columns}
                    columnMetadata={this.columnMetadata}
                    sortedBy="+orderId"
                    expand={this.shouldExpand.bind(this)}
                    onRowExpand={this.handleRowExpand.bind(this)}
                    onRowCollapse={this.handleRowCollapse.bind(this)} />
                </div>);
    }
};
