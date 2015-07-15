import  React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from "components/common/pagelayout";
import {IBox, IBoxTitleBar, IBoxBody, IBoxSection, IBoxTitleText} from 'components/common/IBox';
import {Button} from "react-bootstrap";
import {getFacilityContext} from "data/csapi";
import  {fromJS} from "immutable";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";
import moment from "moment";

import PivotTable from "./PivotTable";


export default class PivotIBox extends React.Component{

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        this.refs.orderSearch.refresh();
    }

    handleOrdersUpdated(updatedOrders) {
        this.getOrdersCursor()((orders) =>{
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
    this.getSelectedOrdersCursor()((orders) =>{
        return orders.clear().concat(fromJS(selectedOrders));
    });
}

getOrdersCursor() {
    let {state}=  this.props;
    return state.cursor(["pivot", "orders"]);
}

getSelectedOrdersCursor() {
    let {state}=  this.props;
    return state.cursor(["pivot", "selectedOrders"]);
}

getPivotOptionsCursor() {
    let {state}=  this.props;
        return state.cursor(["preferences", "orders", "pivot"]);
    }

getColumnsCursor() {
    let {state}=  this.props;
    return state.cursor(["preferences", "orders", "table", "columns"]);
}

getColumnSortSpecs() {
    let {state}=  this.props;
    return state.cursor(["preferences", "orders", "table", "sortSpecs"]);

}


render() {
    let orders = this.getOrdersCursor()();
    let selectedOrders = this.getSelectedOrdersCursor()();
    let pivotOptions = this.getPivotOptionsCursor();
    let columns = this.getColumnsCursor();
    let sortSpecs = this.getColumnSortSpecs();
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
            </IBox>);

}
};
