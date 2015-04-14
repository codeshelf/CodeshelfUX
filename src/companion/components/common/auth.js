import React from 'react';
import exposeRouter from 'components/common/exposerouter';
import {isLoggedIn} from 'data/user/store';

// Higher order component.
// https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
export default function auth(Component) {

    class Auth extends React.Component {
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

    return Auth;

}
