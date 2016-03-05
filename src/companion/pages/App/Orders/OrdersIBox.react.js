import React from "react";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import {fromJS, Set} from "immutable";
import moment from "moment";
import {SingleCellLayout, Row1} from "components/common/pagelayout";
import {IBox} from "pages/IBox";
import {SingleCellIBox} from 'components/common/IBox';
import PivotTable from "components/common/pivot/PivotTable";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";
import Promise from "bluebird";
import search from "data/search";
import {getFacilityContext} from "data/csapi";
import SearchStatus from "components/common/SearchStatus";

export default class OrdersIBox extends React.Component{

    constructor(props) {
        super(props);
        var rootPath = ["preferences", "orders"];
        var selectedPath = ["pivot", "selectedOrders"];
        var resultsPath = ["pivot", "orders"];

        this.state = {
            refreshingAction: Promise.resolve([])
        };
        let {state}=  this.props;
        this.columnsCursor  = state.cursor(rootPath.concat(["table", "columns"]));
        this.columnSortSpecsCursor = state.cursor(rootPath.concat(["table", "sortSpecs"]));
        this.pivotOptionsCursor = state.cursor(rootPath.concat(["pivot"]));
        this.selectedCursor = state.cursor(selectedPath);
        this.resultsCursor = state.cursor(resultsPath);

        this.handleRefresh = this.handleRefresh.bind(this);
        this.cancelRefresh = this.cancelRefresh.bind(this);

        this.title = "Orders";
    }

    componentDidMount() {
        window.requestAnimationFrame(function(){
            if (this.resultsCursor().get("values").count() <= 0) {
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
            return this.handleFilterChange(this.refs.search.getFilter());
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
        this.setState({"errorMessage": null});
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
                          this.handleResultsUpdated.bind(this),
                          filter);

        promise
            .then(()=> this.forceUpdate())
            .catch((e) => {
                this.setState({"errorMessage": e.message});
            });
        this.setState({"refreshingAction" : promise});
        return promise;
    }

    handleResultsUpdated(updatedOrders, total) {
        this.resultsCursor((orders) =>{
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

    handleDrillDown(selected) {
        this.selectedCursor((previousSelected) =>{
            return previousSelected.clear().concat(fromJS(selected));
        });
    }

    render() {
        let {refreshingAction, errorMessage} = this.state;
        let results = this.resultsCursor();
        let orders = results.get("values");
        let selectedOrders = this.selectedCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <IBox
              title={this.title}
              style={{display: "inline-block"}}
              loading={refreshingAction.isPending()} reloadFunction={this.handleRefresh}>
                <Row1 md={6}>
                  <OrderSearch ref="search" onFilterChange={this.handleFilterChange.bind(this)}/>
                </Row1>
                <SearchStatus {...{results, errorMessage}} />
                <PivotTable results={orders} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}/>
                <OrderReview orders={selectedOrders} columns={columns} sortSpecs={sortSpecs}/>
            </IBox>);
    }
};
