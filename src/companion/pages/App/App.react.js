import DocumentTitle from 'react-document-title';
import React from 'react';
import {Link, RouteHandler} from 'react-router';
import {state} from 'data/state';
//import {createAnimationFrameTask} from '../../lib/closure';
import Navigation from './Navigation.react.js';
import TopNavBar from './TopNavBar.react';
import Footer from './Footer.react.js';
import {fetchFacilities} from 'data/facilities/actions';

// Leverage webpack require goodness for feature toggle based dead code removal.
require('assets/css/app.styl');

export default class App extends React.Component {

  componentDidMount() {
    fetchFacilities();
  }

  render() {
      const facility = state.cursor(["selectedFacility"])();
      return (<DocumentTitle title='CS Companion'>
                  <div id="wrapper">
                      <Navigation title={facility.get("domainId")}/>
                      <div id="page-wrapper" className="gray-bg">
                          <TopNavBar />
                          <RouteHandler />
                          <Footer />
                      </div>
                  </div>
              </DocumentTitle>);
  }
};
