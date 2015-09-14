import React from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {Modal, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import {RouteHandler} from 'react-router';
import PureComponent from 'components/common/PureComponent';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {SingleCellIBox} from 'components/common/IBox';
import UploadForm from 'components/common/UploadForm';


import ListView from "components/common/list/ListView";
import ListManagement from "components/common/list/ListManagement";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import {Authz} from 'components/common/auth';


import {getFacilityContext} from 'data/csapi';
import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';

const keyColumn = "persistentId";

export default class WorkerMgmt extends React.Component{

    constructor(props) {
        super(props);

        this.columnMetadata = ListView.toColumnMetadata([
            {
                columnName: keyColumn,
                displayName: "UUID"
            },
                {
                columnName: "lastName",
                displayName: "Last"
            },
            {
                columnName: "firstName",
                displayName: "First"
            },
            {
                columnName: "middleInitial",
                displayName: "M"
            },
            {
                columnName: "badgeId",
                displayName: "Badge"
            },
            {
                columnName: "hrId",
                displayName: "HR ID"
            },
            {
                columnName: "groupName",
                displayName: "Group"
            },
            {
                columnName: "updated",
                displayName: "Updated",
                customComponent: DateDisplay
            },
            {
                columnName: "active",
                displayName: "Active"
            },
        ]);
            this.rowActionComponent = ListManagement.toEditButton((row) => {
            return {    to: "workerdisplay",
                        params: {workerId: row.get(keyColumn)}};
        });
        let {state} = props;
        this.columnsCursor  = state.cursor(["preferences", "workers", "table", "columns"]);
        this.columnSortSpecsCursor = state.cursor(["preferences", "workers", "table", "sortSpecs"]);

    }


    componentWillMount() {
        fetchWorkers();
    }

    handleImportSubmit(method, file) {
        var formData = new FormData();
        formData.append("file", file);
        return getFacilityContext()[method](formData).then(() => {
            fetchWorkers();
        }.bind(this));
    }

    render() {
        var rows = getWorkers();
        let title = "Manage Workers";
        return (
            <SingleCellLayout title={title}>
                <Authz permission="worker:import">
                    <UploadForm label="Workers"
                            onImportSubmit={this.handleImportSubmit.bind(this, "importWorkers")} />
                </Authz>
                <ListManagement
                        addButtonRoute="workernew"

                        columns={this.columnsCursor}
                        columnMetadata={this.columnMetadata}
                        sortSpecs={this.columnSortSpecsCursor}
                        rowActionComponent={this.rowActionComponent}
                        results={rows}
                        keyColumn={keyColumn}/>
                <RouteHandler formMetadata={this.columnMetadata}/>
           </SingleCellLayout>);
    }


};

import {formatTimestamp} from 'lib/timeformat';
class DateDisplay extends React.Component {
    static search(value) {
        return formatTimestamp(value);
    }

    render() {
        return (<span>{formatTimestamp(this.props.rowData.get("updated"))}</span>);
    }
}
