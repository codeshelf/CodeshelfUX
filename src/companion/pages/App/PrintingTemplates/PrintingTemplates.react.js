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


import {getFacilityContext} from 'data/csapi';
import {fetchWorkers} from 'data/workers/actions';
import {getWorkers} from 'data/workers/store';
import DateDisplay from "components/common/DateDisplay";

// new imports redux 
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getPrintingTemplatesMutable} from "./get";
import {acGetTemplates} from "./store";

const keyColumn = "persistentId";

class PrintingTemplates extends Component{

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
          return { to: toURL(this.props, "templates/" + row.get(keyColumn))};
        });
    }

    componentWillMount() {
        this.props.acGetTemplates({limit: 20});
    }

    render() {
        const {table, templates} = this.props;
        const title = "Manage Templates";
        return (
            <SingleCellLayout title={title}>
              { templates.get('loading')
                ? <div>Loading...</div>
                : <ListManagement
                    allowExport={true}
                    addButtonRoute={toURL(this.props, 'templates/new')}
                    columns={table.columns}
                    columnMetadata={this.columnMetadata}
                    sortSpecs={table.sortSpecs}
                    rowActionComponent={this.rowActionComponent}
                    results={templates.get('data')}
                    keyColumn={keyColumn}/>
              }
              {this.props.children && React.cloneElement(this.props.children, { formMetadata: this.columnMetadata})}
           </SingleCellLayout>);
    }


};

function mapDispatch(dispatch) {
  return bindActionCreators({acGetTemplates}, dispatch);
}

export default connect(getPrintingTemplatesMutable, mapDispatch)(PrintingTemplates);
