import  React from "react";
import {DropdownButton} from "react-bootstrap";
import Icon from "react-fa";
import _ from "lodash";
import {Map, List, frocks} from "immutable";
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

        this.state= {
            selectedOrderId: null,
            orderDetails: Map()
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



    render() {
        let desc = (b) => b * -1;

        let ascFunc = (a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        };

        let sortBy = List(["+customerId", "-shipperId"]).map((spec) => {
            var prefix = spec.charAt(0);
            var specObj = {
                property: spec.substring(1)
            };
            if (prefix === "-") {
                specObj.sortFunction = _.compose(desc, ascFunc); // compose = desc(ascFunc(a,b))
                specObj.direction = "desc";
            } else {
                specObj.sortFunction = ascFunc;
                specObj.direction = "asc";
            }
            return specObj;
        });


        let orders = this.props.orders.sort((a, b) => {
            let comp =  sortBy.map(({sortFunction, property}) => sortFunction(a.get(property), b.get(property)))
                .find((result) => result !=0) || 0;
            return comp;
        });
        let columns = this.props.columns;
        let {columnMetadata} = this;
        return (<div>
                <TableSettings onColumnsChange={columns}
                    columns={columns()}
                    columnMetadata={columnMetadata} />
                <Table results={orders}
                    columns={columns()}
                    columnMetadata={this.columnMetadata}
                    sortedBy={sortBy}
                    expand={this.shouldExpand.bind(this)}
                    onRowExpand={this.handleRowExpand.bind(this)}
                    onRowCollapse={this.handleRowCollapse.bind(this)}
                    onColumnMove={this.handleColumnMove.bind(this)}/>
                </div>);
    }
};

class TableSettings extends React.Component {

    render() {
        let {columns, columnMetadata, onColumnsChange} = this.props;
        let options = _.map(columnMetadata, (columnMetadata) => {
            return {label: columnMetadata.displayName, value: columnMetadata.columnName};
        });

        return (
                <Row>
                <Col sm={12} >
                <DropdownButton className="pull-right" title={<Icon name="gear" />}>
                <MultiSelect options={options} values={columns} onChange={onColumnsChange}/>
                </DropdownButton>
                </Col>
                </Row>

        );
    }
}
