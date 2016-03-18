import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import {EditButtonLink, AddButtonLink} from 'components/common/TableButtons';
import ListManagement from 'components/common/list/ListManagement';
import ListView from 'components/common/list/ListView';
import exposeRouter, {toURL} from 'components/common/exposerouter';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getEdiGatewayMutable} from './get';
import {acUpdateEdiGatewayForm, acLoadEdiGateway, acAddEdiGateway,
  acEditEdiGateway, acStoreSelectedEdiGatewayForm} from './store';

const keyColumn = 'domainId';

class EdiGateways extends Component {

  constructor(props) {
    super(props);
    this.columnMetadata = ListView.toColumnMetadata([
      {columnName: 'domainId',
       displayName: 'ID'},
      {columnName: "gatewayState",
       displayName: "State"},
      {columnName: "provider",
       displayName: "Provider"},
      {columnName: "hasCredentials",
        displayName: "Has Creds"},
      {columnName: "active",
       displayName: "Active"}
    ])
    this.rowActionComponent = ListManagement.toEditButton((row) => {
      return { to: toURL(this.props, 'edigateways/' + row.get(keyColumn))};
    });
  }

  componentWillMount() {
    this.props.acLoadEdiGateway({limit: 20});
  }

  flatten(data) {
    if (!data) return data;
    for (let obj in data) {
      if (!data[obj]['providerCredentials']) continue;
      const blob = JSON.parse(data[obj]['providerCredentials']);
      for (let key in blob) {
        data[obj][key] = blob[key];
      }
    }
    return data;
  }

  render() {
    return (
      <DocumentTitle title={"EDI Gateways"}>
        <div>
          <ListManagement
            results={this.flatten(this.props.items.get('data'))}
            keyColumn={keyColumn}
            storeName={"ediGateways"}
            columnMetadata={this.columnMetadata}
            rowActionComponent={this.rowActionComponent}
          />
          {this.props.children && React.cloneElement(this.props.children, {formMetaData: this.columnMetadata})}
        </div>
      </DocumentTitle>
    );
  }

};

function mapDispatch(dispatch) {
  return bindActionCreators({acUpdateEdiGatewayForm, acLoadEdiGateway,
    acAddEdiGateway, acEditEdiGateway, acStoreSelectedEdiGatewayForm}, dispatch);
}

export default connect(getEdiGatewayMutable, mapDispatch)(EdiGateways);
