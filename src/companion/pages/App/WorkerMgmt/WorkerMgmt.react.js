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
import {Checkbox, changeState} from 'components/common/Form';
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
import {acGetWorkers, acHandleImport, acMoveColumns, acSortColumn} from "./store";

const keyColumn = "persistentId";


class WorkerUploadForm extends React.Component {
  constructor() {
    super();
    this.state = {
      append: true
    };
    this.handleChange = (e) => {
      changeState.bind(this)("append", e.target.checked);
    };
  }

  render() {
    const {append} = this.state;
    return (
        <UploadForm
            label="Workers"
            onImportSubmit={({file}) => this.props.onImportSubmit({file, append})}>
      <Checkbox id="append" name="append" label="Leave checked to add to existing workers or uncheck to replace all workers at this facility with this file." value={append} onChange={this.handleChange} />
      </UploadForm>);
  }
}

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
        let formData = new FormData();
        formData.append("file", file);
        return this.props.acHandleImport(method, formData);
    }

    render() {
        const {table, items} = this.props;
        const title = "Manage Workers";

        return (
            <SingleCellLayout title={title}>
              <Authz permission="worker:import">
                  <WorkerUploadForm label="Workers"
                    onImportSubmit={(file) => this.handleImportSubmit("importWorkers", file)} />
              </Authz>
              { items.get('loading')
                ? <div>Loading...</div>
                : <ListManagement
                    allowExport={true}
                    addButtonRoute={toURL(this.props, 'workers/new')}
                    storeName={'workersManagement'}
                    columnMetadata={this.columnMetadata}
                    rowActionComponent={this.rowActionComponent}
                    results={items.get('data')}
                    keyColumn={keyColumn}/>
              }
              {this.props.children && React.cloneElement(this.props.children, { formMetadata: this.columnMetadata})}
           </SingleCellLayout>);
    }


};

function mapDispatch(dispatch) {
  return bindActionCreators({acGetWorkers, acHandleImport, acMoveColumns, acSortColumn}, dispatch);
}

export default connect(getWorkerMgmtMutable, mapDispatch)(WorkerMgmt);
