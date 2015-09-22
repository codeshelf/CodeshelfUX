import React from "react";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import {fromJS, Set} from "immutable";
import moment from "moment";
import {SingleCellLayout} from "components/common/pagelayout";
import {SingleCellIBox} from 'components/common/IBox';
import PivotTable from "components/common/pivot/PivotTable";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";
import Promise from "bluebird";
import search from "data/search";
import {getFacilityContext} from "data/csapi";

class RelativeTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalToken: null
        };
    }

    componentDidMount(){
        let token = setInterval(() => {
                this.forceUpdate();
        }.bind(this), 1000 * 30);
        this.setState({intervalToken: token});
    }

    componentWillUnmount() {
        if (this.state.intervalToken) {
            clearInterval(this.state.intervalToken);
        }
    }

    render() {
        var time = this.props.time;
        return <span title={time.local().format()}>{time.local().fromNow()}</span>
    }
}

export default class OrdersIBox extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            refreshingAction: Promise.resolve([])
        };
        let {state}=  this.props;
        this.columnsCursor  = state.cursor(["preferences", "orders", "table", "columns"]);
        this.columnSortSpecsCursor = state.cursor(["preferences", "orders", "table", "sortSpecs"]);
        this.pivotOptionsCursor = state.cursor(["preferences", "orders", "pivot"]);
        this.selectedOrdersCursor = state.cursor(["pivot", "selectedOrders"]);

        this.ordersCursor = state.cursor(["pivot", "orders"]);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.cancelRefresh = this.cancelRefresh.bind(this);
    }

    componentDidMount() {
        window.requestAnimationFrame(() => {
            if (this.ordersCursor().get("values").count() <= 0) {
                this.handleRefresh();
            }
        }.bind(this));
    }

    componentWillUnmount() {
        this.cancelRefresh();
    }


    handleRefresh() {
        var promise = this.state.refreshingAction;

        if (promise && promise.isPending()) {
            console.log("refresh already happening, cancellable: ", promise.isCancellable());
            return promise;
        } else {
            return this.handleFilterChange(this.refs.orderSearch.getFilter());
        }

    }

    cancelRefresh() {
        var promise = this.state.refreshingAction;
        if (promise && promise.isPending()) {
            console.log("cancelling order refresh");
            promise.cancel();
        }
    }

    handleFilterChange(filter) {
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let properties = new Set(columns())
            .union(pivotOptions().get("fields").map((f) => f.get("name")))
            .add("persistentId")
            .toJS();

        var promise = this.state.refreshingAction;

        if (promise && promise.isPending()) {
            if (promise.isCancellable() == false) {
                console.error("unable to cancel existing search");
            } else {
                console.log("cancelling order search");
                promise.cancel();
            }
        }
        promise =  search(getFacilityContext().findOrderReferences,
                          _.partial(getFacilityContext().getOrder, properties),
                          this.handleOrdersUpdated.bind(this),
                          filter);

        promise.then(()=> this.forceUpdate());
        this.setState({"refreshingAction" : promise});
        return promise;
    }

    handleOrdersUpdated(updatedOrders, total) {
        this.ordersCursor((orders) =>{
        return orders.set("updated", moment())
                     .set("total", total)
                     .set("values", fromJS(updatedOrders).map((order) => {
                                 let localDate = moment(order.get("dueDate")).local();
                                 let endOfDay = localDate.clone();
                                 return order.set("dueDay", endOfDay.format("YYYY-MM-DD"))
                                             .set("dueTime", localDate.format("YYYY-MM-DD HH"));
                             }));
        });
    }

    handleDrillDown(selectedOrders) {
        this.selectedOrdersCursor((orders) =>{
            return orders.clear().concat(fromJS(selectedOrders));
        });
    }

    render() {
        let {refreshingAction} = this.state;
        let ordersResult = this.ordersCursor();
        let ordersUpdated = ordersResult.get("updated");
        let ordersTotal = ordersResult.get("total") || 0;
        let orders = ordersResult.get("values");
        let selectedOrders = this.selectedOrdersCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let properties = new Set(columns())
                .union(pivotOptions().get("fields").map((f) => f.get("name")))
                .add("persistentId");


        let sortSpecs = this.columnSortSpecsCursor;
        return (
                <SingleCellIBox ref="ibox" title="Orders" style={{display: "inline-block"}} isRefreshing={refreshingAction.isPending()} onRefresh={this.handleRefresh}>
                    <OrderSearch ref="orderSearch" onFilterChange={this.handleFilterChange.bind(this)}/>
                    {(ordersUpdated) ? <h5>Last Updated: <RelativeTime time={ordersUpdated} /></h5>: null}
                    <h5>Loading  {orders.count()} / {ordersTotal} Orders</h5>
                    <PivotTable results={orders} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}/>
                <OrderReview orders={selectedOrders} columns={columns} sortSpecs={sortSpecs}/>
            </SingleCellIBox>);
    }
};
