import React, {Component} from 'react';
import _ from 'lodash';
import DocumentTitle from 'react-document-title';
import {Modal, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import PureComponent from 'components/common/PureComponent';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {SingleCellIBox} from 'components/common/IBox';
import UploadForm from 'components/common/UploadForm';
import {toURL} from 'components/common/exposerouter';

import ListView from "components/common/list/ListView";
import ListManagement from "components/common/list/ListManagement";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import {Authz} from 'components/common/auth';


import {getAPIContext} from 'data/csapi';
import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';
import DateDisplay from "components/common/DateDisplay";
// new imports redux
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getWorkerMgmtMutable} from "./get";
import {acGetWorkers, acHandleImport} from "./store";

const keyColumn = "persistentId";

class WorkerMgmt extends Component{

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
                columnName: "domainId",
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
          return { to: toURL(this.props, "workers/" + row.get(keyColumn))};
        });
    }


    componentWillMount() {
        this.props.acGetWorkers({limit: 20});
    }

    handleImportSubmit(method, file) {
        var formData = new FormData();
        formData.append("file", file);
        return this.props.acHandleImport(method, formData);
    }

    render() {
        const {table, workers} = this.props;
        const title = "Manage Workers";
        return (
            <SingleCellLayout title={title}>
              <Authz permission="worker:import">
                  <UploadForm label="Workers"
                    onImportSubmit={(file) => this.handleImportSubmit("importWorkers", file)} />
              </Authz>
              { workers.get('loading')
                ? <div>Loading...</div>
                : <ListManagement
                    allowExport={true}
                    addButtonRoute={toURL(this.props, 'workers/new')}
                    columns={table.columns}
                    columnMetadata={this.columnMetadata}
                    sortSpecs={table.sortSpecs}
                    rowActionComponent={this.rowActionComponent}
                    results={workers.get('data')}
                    keyColumn={keyColumn}/>
              }
              {this.props.children && React.cloneElement(this.props.children, { formMetadata: this.columnMetadata})}
           </SingleCellLayout>);
    }


};

function mapDispatch(dispatch) {
  return bindActionCreators({acGetWorkers, acHandleImport}, dispatch);
}

export default connect(getWorkerMgmtMutable, mapDispatch)(WorkerMgmt);
