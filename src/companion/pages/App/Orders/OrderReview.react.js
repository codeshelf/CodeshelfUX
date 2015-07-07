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
            {
                columnName: "domainId",
                displayName: "Order ID"
            },
            {
                columnName: "containerId",
                displayName: "Container"
            },
            {
                columnName: "status",
                displayName: "Status"
            }
        ];
        this.columns = _.pluck(this.columnMetadata, "columnName");


    }

    handleRowExpand(row) {
        let persistentId = row.get("persistentId");
        let orderId = row.get("domainId");
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
            let orderDetails = this.state.orderDetails.get(row.get("domainId"));
            return <OrderDetailList orderDetails={orderDetails} />;
        }
        return null;

    }
    render() {
        let orders = this.props.orders.sortBy(order => order.get("domainId"));

        return (<div>
                <Table results={orders} columns={this.columns}
                    columnMetadata={this.columnMetadata}
                    sortedBy="+domainId"
                    expand={this.shouldExpand.bind(this)}
                    onRowExpand={this.handleRowExpand.bind(this)}
                    onRowCollapse={this.handleRowCollapse.bind(this)} />
                </div>);
    }
};
