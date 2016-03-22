import React from "react";
import _ from "lodash";
import DocumentTitle from "react-document-title";
import {fromJS, Set} from "immutable";
import moment from "moment";
import {SingleCellLayout, Row1} from "components/common/pagelayout";
import {IBox} from "pages/IBox";
import {SingleCellIBox} from 'components/common/IBox';
import Pivot from "components/common/pivot/Pivot";
import CrossTab from "components/common/pivot/CrossTab";
import OrderSearch from "./OrderSearch";
import OrderReview from "./OrderReview";
import Promise from "bluebird";
import search from "data/search";
import {getAPIContext} from "data/csapi";
import SearchStatus from "components/common/SearchStatus";

const groupValues = {
  "status" : [
    { name: "COMPLETE", selected: true },
    { name: "RELEASED", selected: true },
    { name: "SHORT", selected: true },
    { name: "INPROGRESS", selected: true }

  ],
  "customerId" : [
    { name: "L7", selected: true },
    { name: "B6", selected: true }
  ]
};

let columnGroups = ['status'];

let rowGroups = ['customerId'];

function addGroup(name) {
  //for simplicity just add to row group and allow them to just switch it to col group
  rowGroups.push(name);
}

function changeGroup(name) {
  const notGroup = (g) => g.name !== name;
  const column = columnGroups.includes(name);
  if (column) {
    columnGroups = columnGroups.filter(notGroup);
    rowGroups.push(name);
  } else {
    rowGroups = rowGroups.filter(notGroup);
    columnGroups.push(name);
  }
}

function removeGroup(name) {
  const notGroup = (g) => g.name !== name;
  const column = columnGroups.includes(name);
  if (column) {
    columnGroups = columnGroups.filter(notGroup);
  } else {
    rowGroups = rowGroups.filter(notGroup);
  }
}

const availableGroups = [
  {
                        name: 'status',
                        label: 'Status',
                        sort: {order: "asc"}
                        },
                    {name: "pivotDetailCount",
                     label: "Lines"},
                    {name: "pivotRemainingDetailCount",
                     label: "Lines Remaining"},

                     {name: "caseQuantity",
                    label: "Cases",
                     dataSettings: {aggregateFunc: 'sum'}
                    },
                    {name: "eachQuantity",
                    label: "Eaches",
                    dataSettings: {aggregateFunc: 'sum'}
                    },
                    {name: "otherQuantity",
                     label: "Other UOM",
                     dataSettings: {aggregateFunc: 'sum'}
                     },
                    {
                        name: 'customerId',
                        label: 'Customer',
                        sort: { order: "asc"}
                    },
                    {
                        name: 'destinationId',
                        label: 'Destination',
                        sort: { order: "asc"}
                    },
                    {
                        name: "shipperId",
                        label: "Shipper",
                        sort: { order: "asc"}
                    },
                    {
                        name: "dueDay",
                        label: "Date Due",
                        sort: { order: "asc"}
                    },
                    {
                        name: "dueTime",
                        label: "Time Due",
                        sort: { order: "asc"}
                    },
                    {
                      name: "orderType",
                      label: "Type",
                      sort: { order: "asc"}
                    }
                ];

export default class OrdersIBox extends React.Component{

    constructor(props) {
        super(props);
        var rootPath = ["preferences", "orders"];
        var selectedPath = ["pivot", "selectedOrders"];
        var resultsPath = ["pivot", "orders"];

        this.state = {
          refreshingAction: Promise.resolve([]),
          selected: Set()
        };
        let {state}=  this.props;
        this.columnsCursor  = state.cursor(rootPath.concat(["table", "columns"]));
        this.columnSortSpecsCursor = state.cursor(rootPath.concat(["table", "sortSpecs"]));
        this.pivotOptionsCursor = state.cursor(rootPath.concat(["pivot"]));
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
        promise =  search(getAPIContext().findOrderReferences,
                          _.partial(getAPIContext().getOrder, properties),
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
      this.setState({selected: fromJS(selected)});
    }

    render() {
        let {refreshingAction, errorMessage, selected} = this.state;
        let results = this.resultsCursor();
        let orders = results.get("values");
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let sortSpecs = this.columnSortSpecsCursor;
        const groupControls = {
          remove: removeGroup,
          change: changeGroup
        };
        return (
            <IBox
              title={this.title}
              style={{display: "inline-block"}}
              loading={refreshingAction.isPending()} reloadFunction={this.handleRefresh}>
                <Row1 md={6}>
                  <OrderSearch ref="search" onFilterChange={this.handleFilterChange.bind(this)}/>
                </Row1>
                <SearchStatus {...{results, errorMessage}} />
                <Pivot {...{availableGroups, addGroup}}
                       {...{groupValues, rowGroups, columnGroups}}
                       {...{groupControls}}
                       results={orders} options={pivotOptions} onDrillDown={this.handleDrillDown.bind(this)}>
                   <CrossTab />
                </Pivot>
                <OrderReview orders={selected} columns={columns} sortSpecs={sortSpecs}/>
            </IBox>);
    }
};
