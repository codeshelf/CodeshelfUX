import React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from "components/common/pagelayout";
import {SingleCellIBox} from 'components/common/IBox';
import {fromJS, Map} from "immutable";
import WorkInstructionSearch from "./WorkInstructionSearch";
import ListView from "components/common/list/ListView";
import PivotTable from "components/common/pivot/PivotTable";
import {Table} from "components/common/Table";
import {keyColumn, properties} from 'data/types/WorkInstruction';
import DateTime from "data/types/DateTime";
import DateDisplay from "components/common/DateDisplay";

export default class WorkInstructionIBox extends React.Component{

    constructor(props) {
        super(props);
        var rootPath = ["preferences", "workInstructions"];
        var selectedPath = ["pivot", "selectedWorkInstructions"];
        var resultsPath = ["pivot", "workInstructions"];

        let {state}=  this.props;
        this.columnsCursor  = state.cursor(rootPath.concat(["table", "columns"]));
        this.columnSortSpecsCursor = state.cursor(rootPath.concat(["table", "sortSpecs"]));
        this.pivotOptionsCursor = state.cursor(rootPath.concat(["pivot"]));
        this.selectedCursor = state.cursor(selectedPath);
        this.resultsCursor = state.cursor(resultsPath);

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleSearchUpdate = this.handleSearchUpdate.bind(this);
        this.handleDrillDown = this.handleDrillDown.bind(this);

        this.title = "Work Instructions";
        this.columnMetadata = ListView.toColumnMetadataFromProperties(properties);
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        return this.refs.search.refresh();
    }

    handleSearchUpdate(updatedResultsList) {
        this.resultsCursor((previousResults) =>{
            return previousResults.clear().concat(updatedResultsList);
        });
        this.handleDrillDown(updatedResultsList);
    }

    handleDrillDown(selected) {
        this.selectedCursor((previousSelected) =>{
            return previousSelected.clear().concat(fromJS(selected));
        });
    }

    render() {
        let results = this.resultsCursor();
        let selected = this.selectedCursor();
        let pivotOptions = this.pivotOptionsCursor;
        let columns = this.columnsCursor;
        let sortSpecs = this.columnSortSpecsCursor;
        return (
            <SingleCellIBox title={this.title}
                    style={{display: "inline-block"}}
                    onRefresh={this.handleRefresh}>
                <WorkInstructionSearch ref="search" onUpdated={this.handleSearchUpdate}/>
                <PivotTable results={results} options={pivotOptions} onDrillDown={this.handleDrillDown}/>
                <ListView results={selected}
                 columns={columns}
                 columnMetadata={this.columnMetadata}
                 keyColumn={keyColumn}
                 sortSpecs={sortSpecs}/>
            </SingleCellIBox>);
    }
};
