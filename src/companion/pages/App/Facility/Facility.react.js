import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link, RouteHandler} from 'react-router';
import Navigation from './Navigation.react.js';
import TopNavBar from './TopNavBar.react';
import Footer from './Footer.react.js';
import {getSelectedTenant} from 'data/user/store';
import {fetchFacilities} from 'data/facilities/actions';
import {getSelectedFacility, getFacilities} from 'data/facilities/store';

// Leverage webpack require goodness for feature toggle based dead code removal.
require('assets/css/app.styl');

export default class Facility extends React.Component {
    componentWillMount() {
        document.body.classList.add("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
    }

    render() {
        let facility = getSelectedFacility();
        let facilities = getFacilities();
        let tenant = getSelectedTenant();
        let tenantName = tenant.get("name");
        return (
            <DocumentTitle title='CS Companion'>
            {
                    facility ?
                          <div>
                              <Navigation title={tenantName} facility={facility} facilities={facilities} />
                              <div id="page-wrapper" className="page-container">
                                  <TopNavBar title={tenantName}/>
                                  <div className="page-content-wrapper">
                                      <div className="content sm-gutter">
                                          <RouteHandler />
                                      </div>
                                  </div>
                              </div>
                           </div>
                      :
                          <span>Selecting Facility...</span>
            }
            </DocumentTitle>);
    }
};
