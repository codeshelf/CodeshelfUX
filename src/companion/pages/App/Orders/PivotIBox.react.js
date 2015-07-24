import React from "react";
import DocumentTitle from "react-document-title";
import {fromJS} from "immutable";
import moment from "moment";
import {SingleCellLayout} from "components/common/pagelayout";
import {IBox, IBoxTitleBar, IBoxBody, IBoxSection, IBoxTitleText} from 'components/common/IBox';
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
        this.handleRefresh.pending = false;
        this.state = {
            "refreshPending" : false
        };
    }

    componentDidMount() {
            window.requestAnimationFrame(() => this.handleRefresh());
    }

    handleRefresh() {
        this.setState({"refreshPending": true});
        this.refs.orderSearch.refresh().then(() => this.setState({"refreshPending": false}));

    }

    handleOrdersUpdated(updatedOrders) {
        this.setState({"refreshPending": false});
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
    let sortSpecs = this.columnSortSpecsCursor;
    let {refreshPending} = this.state;
    let progressStyle = {display: (refreshPending) ? "block" : "none"};
    return (
            <IBox style={{display: "inline-block"}}>
            <IBoxTitleBar>
            <IBoxTitleText>
                Orders
            </IBoxTitleText>
            <div className="panel-controls">
            <ul>
            <li><a href="#" className="portlet-refresh text-black" data-toggle="refresh"
                 onClick={this.handleRefresh.bind(this)}
                 ><i className="portlet-icon portlet-icon-refresh"></i></a>
            </li>
            </ul>
            </div>
            </IBoxTitleBar>
            <IBoxBody>
                <OrderSearch ref="orderSearch" onOrdersUpdated={this.handleOrdersUpdated.bind(this)}/>
                <PivotTable results={orders} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}/>
                <OrderReview orders={selectedOrders} columns={columns} sortSpecs={sortSpecs}/>
                    </IBoxBody>
                            <div className="portlet-progress" style={progressStyle}><div className="progress-circle-indeterminate progress-circle-master"></div></div>
            </IBox>);

}
};
