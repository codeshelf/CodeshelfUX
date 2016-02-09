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
                // escaping is not working in currnet router 13.2 so if % is in url redirect to home
                if (nextPath.indexOf("%") !== -1) {
                  nextPath = "/";
                }
                console.log("will redirect to " + nextPath);
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
          const {location, params, router} = props;
          var currentPath = location.pathname+location.search;
          if (!isLoggedIn()) {
            var nextPath = currentPath;
            console.log("not authenticated to reach " + nextPath);
            // escaping is not working in currnet router 13.2 so if % is in url redirect to home
            if (nextPath.indexOf("%") !== -1) {
              nextPath = "/";
            }
            console.log("will redirect to " + nextPath);
            router.push({pathname: "/login", query: {nextPath: nextPath}});
          }
        }

        render() {
            return isLoggedIn() && <Component {...this.props} />;
        }
    };

    return exposeRouter(Authn);

}


export function isAuthorized(permission) {
    let result =  hasPermission(permission);
    return result;
}

export function authz(Component) {
  if(typeof Component !== 'string' && typeof Component !== 'function') {
    console.error("Unable to wrap " + Component);
  }

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
