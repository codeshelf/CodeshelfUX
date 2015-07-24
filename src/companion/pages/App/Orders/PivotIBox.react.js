import React from "react";
import DocumentTitle from "react-document-title";
import {fromJS, Set} from "immutable";
import moment from "moment";
import {SingleCellLayout} from "components/common/pagelayout";
import {SingleCellIBox} from 'components/common/IBox';
import PivotTable from "components/common/pivot/PivotTable";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";

export default class PivotIBox extends React.Component{

    constructor(props) {
        super(props);
        let {state}=  this.props;
        this.columnsCursor  = state.cursor(["preferences", "orders", "table", "columns"]);
        this.columnSortSpecsCursor = state.cursor(["preferences", "orders", "table", "sortSpecs"]);
        this.pivotOptionsCursor = state.cursor(["preferences", "orders", "pivot"]);
        this.selectedOrdersCursor = state.cursor(["pivot", "selectedOrders"]);
        this.ordersCursor = state.cursor(["pivot", "orders"]);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        window.requestAnimationFrame(() => this.refs.ibox.refresh());
    }

    handleRefresh() {
        return this.refs.orderSearch.refresh();
    }

    handleOrdersUpdated(updatedOrders) {
        this.ordersCursor((orders) =>{
            let newOrders=  orders.clear().concat(fromJS(updatedOrders));
            return newOrders.map((order) => {
                return order.withMutations((o) => {
                    let localDate = moment(o.get("dueDate")).local();
                    let endOfDay = localDate.clone();
                    endOfDay.endOf('day');
                    o.set("dueDay", endOfDay.format("YYYY-MM-DD"))
                        .set("dueTime", localDate.format("YYYY-MM-DD HH"));
                });
            });
        });
        this.handleDrillDown(updatedOrders);
    }

    handleDrillDown(selectedOrders) {
        this.selectedOrdersCursor((orders) =>{
            return orders.clear().concat(fromJS(selectedOrders));
        });
    }

    render() {
        let orders = this.ordersCursor();
        let selectedOrders = this.selectedOrdersCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let properties = new Set(columns()).union(pivotOptions().get("fields").map((f) => f.get("name")));

        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <SingleCellIBox ref="ibox" title="Orders" style={{display: "inline-block"}} onRefresh={this.handleRefresh}>
                <OrderSearch ref="orderSearch" properties={properties} onOrdersUpdated={this.handleOrdersUpdated.bind(this)}/>
                <PivotTable results={orders} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}/>
                <OrderReview orders={selectedOrders} columns={columns} sortSpecs={sortSpecs}/>
            </SingleCellIBox>);
    }
};
