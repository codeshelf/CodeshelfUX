import React from 'react';
import {isLoggedIn, hasPermission} from 'data/user/store';
import exposeRouter from 'components/common/exposerouter';

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

        componentWillMount() {
            this.handleRouting(this.props);
        }

        componentWillReceiveProps(nextProps) {
            this.handleRouting(nextProps);
        }

        handleRouting(props) {
            var router = props.router;
            var currentPath = router.getCurrentPath();
            var params = router.getCurrentParams();
            if (!isLoggedIn()) {
                var nextPath = currentPath;
                console.log("not authenticated to reach " + nextPath);
                router.transitionTo("login", {}, {nextPath: nextPath});
            }
        }

        render() {
            return isLoggedIn() && <Component {...this.props} />;
        }
    };

    return exposeRouter(Authn);

}




export function authz(Component) {

    class AuthzWrapper extends React.Component {
        render() {
            let {permission, notPermission} = this.props;
            var permit = true;
            if (permission != null) {
                permit = hasPermission(permission);
            }
            if (notPermission != null) {
                permit = !hasPermission(notPermission);
            }
            return ((permit) ?
                       <Component {...this.props} />
                       :
                       null);
        }
    };
    return AuthzWrapper;

};

export class Authz extends React.Component {
    render() {
        let {permission, notPermission} = this.props;
        var permit = true;
        if (permission != null) {
            permit = hasPermission(permission);
        }
        if (notPermission != null) {
            permit = !hasPermission(notPermission);
        }
        return ((permit) ?
                <div>{this.props.children}</div>
                :
                null);
    }
};
