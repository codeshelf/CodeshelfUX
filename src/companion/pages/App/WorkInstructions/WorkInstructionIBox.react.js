import React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout, Row1} from "components/common/pagelayout";
import {IBox} from "pages/IBox";

import {fromJS, Map, Set} from "immutable";
import WorkInstructionSearch from "./WorkInstructionSearch";
import ListManagement from "components/common/list/ListManagement";
import PivotTable from "components/common/pivot/PivotTable";
import {Table} from "components/common/Table";
import {keyColumn, properties} from 'data/types/WorkInstruction';
import moment from "moment";
import Promise from "bluebird";
import search from "data/search";
import {getAPIContext} from "data/csapi";
import SearchStatus from "components/common/SearchStatus";
import {fetchWorkers} from 'data/workers/actions';
import {getWorkersByBadgeId, toWorkerName} from 'data/workers/store';

export default class WorkInstructionIBox extends React.Component{

    constructor(props) {
        super(props);
        var rootPath = ["preferences", "workInstructions"];
        var selectedPath = ["pivot", "selectedWorkInstructions"];
        var resultsPath = ["pivot", "workInstructions"];

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
        this.handleResultsUpdated = this.handleResultsUpdated.bind(this);
        this.handleDrillDown = this.handleDrillDown.bind(this);

        this.title = "Work Instructions";
        this.columnMetadata = ListManagement.toColumnMetadataFromProperties(properties);
    }

    componentWillMount() {
        fetchWorkers({limit: 5000});
    }

    componentDidMount() {
        window.requestAnimationFrame(function() {
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
        promise =  search(getAPIContext().findWorkInstructionReferences,
                          _.partial(getAPIContext().getWorkInstruction, properties),
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

    handleResultsUpdated(updatedResultsList, total) {
        this.resultsCursor((previousResults) =>{
                let workersByBadgeId = getWorkersByBadgeId();

                return previousResults.set("updated", moment())
                                      .set("total", total)
                                      .set("values", fromJS(updatedResultsList).map((wi) => {
                                          let domainId = wi.get("pickerId");
                                          let worker = workersByBadgeId.get(domainId);
                                          let name = toWorkerName(worker, domainId);
                                          let wiWithName = wi.set("pickerId", name);

                                          let itemMasterId = wi.get("itemMasterId");
                                          if (itemMasterId && itemMasterId.length >= 4) {
                                              return wiWithName.set("store", itemMasterId.substring(0,4));
                                          } else {
                                              return wiWithName;
                                          }
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
        let resultValues = results.get("values");
        let selected = this.selectedCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <IBox
                title={this.title}
                style={{display: "inline-block"}}
                loading={refreshingAction.isPending()} reloadFunction={this.handleRefresh}>
              <Row1 md={6}>
                <WorkInstructionSearch ref="search" onFilterChange={this.handleFilterChange.bind(this)}/>
              </Row1>
                <SearchStatus {...{results, errorMessage}} />
                <PivotTable results={resultValues} options={pivotOptions} onDrillDown={this.handleDrillDown}/>
                <ListManagement results={selected}
                 columns={columns}
                 columnMetadata={this.columnMetadata}
                 keyColumn={keyColumn}
                 sortSpecs={sortSpecs}
                 allowExport={true}/>
            </IBox>);
    }
};
