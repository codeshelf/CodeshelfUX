/*eslint strict:0 */
import React from 'react';
import {RouteHandler} from 'react-router';
import {state} from './data/state';
import storage from 'lib/storage';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd/modules/backends/HTML5';

import 'bootstrap/less/bootstrap.less';
import 'pages/less/pages.less';
require('assets/css/app.styl');

require('imports?this=>window!assets/plugins/modernizr.custom.js');
require("imports?classie=assets/plugins/classie/classie.js!pages/js/pages.js");


class Root extends React.Component {

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
       return (<RouteHandler state={state}/>);

   }
};
export default DragDropContext(HTML5Backend)(Root);
