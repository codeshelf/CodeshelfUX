import React from "react";
import DocumentTitle from "react-document-title";
import {SingleCellLayout} from "components/common/pagelayout";
import {IBox, IBoxTitleBar, IBoxBody, IBoxSection, IBoxTitleText} from 'components/common/IBox';
import {fromJS, Map} from "immutable";
import WorkInstructionSearch from "./WorkInstructionSearch";
import ListView from "components/common/list/ListView";
import PivotTable from "components/common/pivot/PivotTable";
import {Table} from "components/common/Table";
import {keyColumn, properties} from 'data/types/WorkInstruction';

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
        this.columnMetadata = properties.map((metadata) => {
            return new ListView.ColumnRecord({columnName: metadata.id, displayName: metadata.title});
        });
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        this.refs.search.refresh();
    }

    handleSearchUpdate(updatedResults) {
        let updatedResultsList = fromJS(updatedResults);
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
            <IBox style={{display: "inline-block"}}>
                <IBoxTitleBar>
                    <IBoxTitleText>
                            {this.title}
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
                    <WorkInstructionSearch ref="search" onUpdated={this.handleSearchUpdate}/>
                        <PivotTable results={results} options={pivotOptions} onDrillDown={this.handleDrillDown}/>
                        <ListView results={selected}
                            columns={columns}
                            columnMetadata={this.columnMetadata}
                            keyColumn={keyColumn}
                       sortSpecs={sortSpecs}/>
                </IBoxBody>
            </IBox>);
    }
};
