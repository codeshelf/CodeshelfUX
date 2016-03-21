import React from 'react';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {PageGrid} from 'components/common/pagelayout';
import FacilityNavigation from './FacilityNavigation.react.js';
import TopNavBar from '../TopNavBar.react';
import Footer from '../Footer.react.js';

//temp old store
import {state} from 'data/state';
import storage from 'lib/storage';
import {getSelectedTenant} from 'data/user/store';

export default class Facility extends React.Component {

    componentDidMount() {
      document.addEventListener('keypress', this.onDocumentKeypress);

      // Return to codebase if we see problems on older devices
      // http://developer.telerik.com/featured/300-ms-click-delay-ios-8/
      //require('fastclick').attach(document.body);

      state.on('change', (newState, path) => {
        /*eslint-disable no-console */
        console.time('whole app rerender');
        this.forceUpdate(() => {
          console.timeEnd('whole app rerender');
        });

        if (path != null && path.indexOf("preferences") >= 0) {
          storage.set("preferences", state.cursor(["preferences"])());
        }
  /*eslint-enable */
      });


    }

    componentWillUnmount() {
      state.removeAllListeners();
      document.removeEventListener('keypress', this.onDocumentKeypress);
    }

    onDocumentKeypress(e) {
      // Press shift+ctrl+s to save app state and shift+ctrl+l to load.
      if (!e.shiftKey || !e.ctrlKey) return;
        switch (e.keyCode) {
          case 19:
              window._appState = state.save();
              window._appStateString = JSON.stringify(window._appState);
              /*eslint-disable no-console */
              console.log('app state saved');
              console.log('copy the state to your clipboard by calling copy(_appStateString)');
              console.log('for dev type _appState and press enter');
              /*eslint-enable */
              break;
          case 12:
              const stateStr = window.prompt('Path the serialized state into the input'); // eslint-disable-line no-alert
              const newState = JSON.parse(stateStr);
              if (!newState) return;
              state.load(newState);
          break;
        }
    }


    render() {
        let {selected, availableFacilities, acToggleSidebar} = this.props;
        const tenant = getSelectedTenant();
        let tenantName = tenant.get("name");
        return (
            <DocumentTitle title='CS Companion'>
            {
                    selected ?
                          <div>
                              <FacilityNavigation title={tenantName} selected={selected} facilities={availableFacilities} acToggleSidebar={acToggleSidebar}/>
                              <div id="page-wrapper" className="page-container">
                                  <TopNavBar title={tenantName} selected={selected} availableFacilities={availableFacilities}/>
                                  <div className="page-content-wrapper">
                                      <div className="content">
                                        <PageGrid>
                                          { React.cloneElement(this.props.children, { state: state })}
                                        </PageGrid>
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
