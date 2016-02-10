import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import FacilityNavigation from './FacilityNavigation.react.js';
import TopNavBar from '../TopNavBar.react';
import Footer from '../Footer.react.js';

//temp old store
import {getSelectedTenant} from 'data/user/store';
import {state} from 'data/state';

export default class Facility extends React.Component {
    componentWillMount() {
      document.body.classList.add("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
    }

    componentWillUnmount() {
      document.body.classList.remove("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
    }

    render() {
        let {facility, availableFacilities} = this.props;
        const tenant = getSelectedTenant();
        let tenantName = tenant.get("name");
        return (
            <DocumentTitle title='CS Companion'>
            {
                    facility ?
                          <div>
                              <FacilityNavigation title={tenantName} facility={facility} facilities={availableFacilities} />
                              <div id="page-wrapper" className="page-container">
                                  <TopNavBar title={tenantName} facility={facility} facilities={availableFacilities}/>
                                  <div className="page-content-wrapper">
                                      <div className="content">
                                        { React.cloneElement(this.props.children, { state: state })}
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
