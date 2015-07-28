import React from "react";
import DocumentTitle from "react-document-title";
import {fromJS, Set} from "immutable";
import moment from "moment";
import {SingleCellLayout} from "components/common/pagelayout";
import {SingleCellIBox} from 'components/common/IBox';
import PivotTable from "components/common/pivot/PivotTable";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";

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
        window.requestAnimationFrame(() => {
            if (this.ordersCursor().get("values").count() <= 0) {
                this.refs.ibox.refresh();
            }
        }.bind(this));
    }

    handleRefresh() {
        return this.refs.orderSearch.refresh();
    }

    handleOrdersUpdated(updatedOrders) {
        this.ordersCursor((orders) =>{
            return orders.set("updated", moment())
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
        let orders = this.ordersCursor();
        let ordersUpdated = orders.get("updated");
        let selectedOrders = this.selectedOrdersCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let properties = new Set(columns())
                .union(pivotOptions().get("fields").map((f) => f.get("name")))
                .add("persistentId");


        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <SingleCellIBox ref="ibox" title="Orders" style={{display: "inline-block"}} onRefresh={this.handleRefresh}>
                <OrderSearch ref="orderSearch" properties={properties} onOrdersUpdated={this.handleOrdersUpdated.bind(this)}/>
                {(ordersUpdated) ? <h5>Last Updated: <RelativeTime time={ordersUpdated} /></h5>: null}

                <PivotTable results={orders.get("values")} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}/>
                <OrderReview orders={selectedOrders} columns={columns} sortSpecs={sortSpecs}/>
            </SingleCellIBox>);
    }
};
