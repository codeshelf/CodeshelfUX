import React, {Component} from 'react';
import _ from 'lodash';
import {Modal, Input} from 'react-bootstrap';
import Icon from 'react-fa';
import Immutable from 'immutable';
import {SingleCellLayout, Row, Col} from 'components/common/pagelayout';
import {SingleCellIBox} from 'components/common/IBox';
import UploadForm from 'components/common/UploadForm';
import {toURL} from 'components/common/exposerouter';

import ListView from "components/common/list/ListView";
import ListManagement from "components/common/list/ListManagement";
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import DateDisplay from "components/common/DateDisplay";

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
                columnName: "name",
                displayName: "Name"
            },
            {
                columnName: "active",
                displayName: "Active"
            },
            {
                columnName: "template",
                displayName: "Template"
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
        const {templates} = this.props;
        const title = "Manage Templates";
        return (
            <SingleCellLayout title={title}>
              { templates.get('loading')
                ? <div>Loading...</div>
                : <ListManagement
                    allowExport={true}
                    addButtonRoute={toURL(this.props, 'templates/new')}
                    storeName={'printingTemplates'}
                    columnMetadata={this.columnMetadata}
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
