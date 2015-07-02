/*eslint strict:0 */

import DocumentTitle from 'react-document-title';
import React from 'react';
import {RouteHandler} from 'react-router';
import {state} from './data/state';

require('imports?this=>window!assets/plugins/modernizr.custom.js');
require("imports?classie=assets/plugins/classie/classie.js!pages/js/pages");

export default class Root extends React.Component {

    componentDidMount() {
        document.addEventListener('keypress', this.onDocumentKeypress);

        // Must be required here because there is no DOM in Node.js. Remember,
        // mocking DOM in Node.js is an anti-pattern, because it can confuse
        // isomorphic libraries. TODO: Wait for iOS fix, then remove.
        // http://developer.telerik.com/featured/300-ms-click-delay-ios-8/
        require('fastclick').attach(document.body);

        state.on('change', () => {
            /*eslint-disable no-console */
            console.time('whole app rerender');
            this.forceUpdate(() => {
                console.timeEnd('whole app rerender');
            });
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
