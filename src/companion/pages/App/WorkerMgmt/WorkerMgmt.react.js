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
    import ListView from "components/common/list/ListView";
import ListManagement from "components/common/list/ListManagement";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';

import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';

import exposeRouter from 'components/common/exposerouter';

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
                columnName: "action",
                displayName: "",
                customComponent:  ListManagement.toEditButton((row) => {
                    return {    to: "workerdisplay",
                                params: {workerId: row.get(keyColumn)}};
                })
            }
        ]);
        let {state} = props;
        this.columnsCursor  = state.cursor(["preferences", "workers", "table", "columns"]);
        this.columnSortSpecsCursor = state.cursor(["preferences", "workers", "table", "sortSpecs"]);

    }


    componentWillMount() {
        fetchWorkers();
    }

    render() {
        var rows = getWorkers();
        let title = "Manage Workers";
        return (
            <SingleCellLayout title={title}>
                <ListManagement
                        addButtonRoute="workernew"

                        columnMetadata={this.columnMetadata}
                        results={rows}
                            keyColumn={keyColumn}
                        columns={this.columnsCursor}
                        sortSpecs={this.columnSortSpecsCursor} />
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
