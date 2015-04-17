import React from 'react';
import {isLoggedIn, hasPermission} from 'data/user/store';

// Higher order component.
// https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
export function authn(Component) {

    class Authn extends React.Component {
        static willTransitionTo(transition) {
            if (!isLoggedIn()) {
                var nextPath = transition.path;
                console.log("not authenticated to reach " + nextPath);
                transition.redirect('/login', {}, {nextPath: nextPath});
            }
        }

        render() {
            return <Component {...this.props} />;
        }
    };

    return Authn;

}

export function authz(Component) {

    class Authz extends React.Component {
        render() {
            let {permission} = this.props;
            return ((permission == null || hasPermission(permission)) ?
                       <Component {...this.props} />
                       :
                       null);
        }
    };
    return Authz;

};
