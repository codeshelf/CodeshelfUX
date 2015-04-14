import React from 'react';
import DocumentTitle from 'react-document-title';
import exposeRouter from 'components/common/exposerouter';

import {Link, RouteHandler} from 'react-router';
import Navigation from './Navigation.react.js';
import TopNavBar from './TopNavBar.react';
import Footer from './Footer.react.js';
import {fetchFacilities} from 'data/facilities/actions';
import {getSelectedFacility} from 'data/facilities/store';

// Leverage webpack require goodness for feature toggle based dead code removal.
require('assets/css/app.styl');

class Facility extends React.Component {

  render() {
      const facility = getSelectedFacility();
      return (<DocumentTitle title='CS Companion'>
                  {
                    facility ?
                          <div id="wrapper">
                          <Navigation title={facility.get("domainId")}/>
                          <div id="page-wrapper" className="gray-bg">
                          <TopNavBar />
                          <RouteHandler />
                          <Footer />
                          </div>
                           </div>
                      :
                          <span>Selecting Facility...</span>
                  }
              </DocumentTitle>);
  }
};

export default exposeRouter(Facility);
