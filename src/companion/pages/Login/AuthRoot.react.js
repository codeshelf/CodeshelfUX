import React from 'react';
//temp old store
import {state} from 'data/state';

export default class AuthRoot extends React.Component {

    componentDidMount() {
      // Return to codebase if we see problems on older devices
      // http://developer.telerik.com/featured/300-ms-click-delay-ios-8/
      //require('fastclick').attach(document.body);

      state.on('change', (newState, path) => {
        /*eslint-disable no-console */
        console.time('whole app rerender');
        this.forceUpdate(() => {
          console.timeEnd('whole app rerender');
        });

        /*eslint-enable */
      });
    }

    componentWillUnmount() {
      state.removeAllListeners();
    }

    render() {
        return (
          React.cloneElement(this.props.children, { state: state })
        );
    }
};
