import React from 'react';
import DocumentTitle from 'react-document-title';
import AdminNavigation from './AdminNavigation';
import TopNavBar from '../TopNavBar.react';
import Footer from '../Footer.react.js';

//TODO remove when in redux store
import {getSelectedTenant} from 'data/user/store';

export default class Admin extends React.Component {

  render() {
    const tenant = getSelectedTenant();
    const tenantName = tenant && tenant.get("name");
    return (
      <DocumentTitle title='CS Companion Admin'>
        <div>
          <AdminNavigation title={tenantName} />
          <div id="page-wrapper" className="page-container">
            <TopNavBar title={tenantName} />
            <div className="page-content-wrapper">
              <div className="content">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>);
    }
};
