import React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from "components/common/pagelayout";
import {SingleCellIBox} from 'components/common/IBox';
import {fromJS, Map, Set} from "immutable";
import WorkInstructionSearch from "./WorkInstructionSearch";
import ListView from "components/common/list/ListView";
import PivotTable from "components/common/pivot/PivotTable";
import {Table} from "components/common/Table";
import {keyColumn, properties} from 'data/types/WorkInstruction';
import moment from "moment";
import Promise from "bluebird";
import search from "data/search";
import {getFacilityContext} from "data/csapi";
import SearchStatus from "components/common/SearchStatus";

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
        this.columnMetadata = ListView.toColumnMetadataFromProperties(properties);
    }


    componentDidMount() {
        window.requestAnimationFrame(() => {
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
        promise =  search(getFacilityContext().findWorkInstructionReferences,
                          _.partial(getFacilityContext().getWorkInstruction, properties),
                          this.handleResultsUpdated.bind(this),
                          filter);

        promise.then(()=> this.forceUpdate());
        this.setState({"refreshingAction" : promise});
        return promise;
    }

    handleResultsUpdated(updatedResultsList, total) {
        this.resultsCursor((previousResults) =>{
                return previousResults.set("updated", moment())
                                      .set("total", total)
                                      .set("values", fromJS(updatedResultsList).map((wi) => {
                                          let gtin = wi.get("gtin");
                                          if (gtin && gtin.length >= 4) {
                                          return wi.set("store", gtin.substring(0,4));
                                      } else {
                                          return wi;
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
        let {refreshingAction} = this.state;
        let results = this.resultsCursor();
        let resultValues = results.get("values");
        let selected = this.selectedCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <SingleCellIBox title={this.title}
                    style={{display: "inline-block"}}
                    isRefreshing={refreshingAction.isPending()}
                    onRefresh={this.handleRefresh}>
                <WorkInstructionSearch ref="search" onFilterChange={this.handleFilterChange.bind(this)}/>
                <SearchStatus {...{results}} />
                <PivotTable results={resultValues} options={pivotOptions} onDrillDown={this.handleDrillDown}/>
                <ListView results={selected}
                 columns={columns}
                 columnMetadata={this.columnMetadata}
                 keyColumn={keyColumn}
                 sortSpecs={sortSpecs}/>
            </SingleCellIBox>);
    }
};
