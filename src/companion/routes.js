import Root from './Root.react.js';
import App from './pages/App/App.react.js';
import NotFound from 'pages/NotFound';
import React from 'react';
import Overview from './pages/App/Overview/Overview.react.js';
import BlockedWork from './pages/App/BlockedWork/BlockedWork.react.js';
import NoLocation from './pages/App/BlockedWork/NoLocation.react.js';
import Shorted from './pages/App/BlockedWork/Shorted.react.js';
import WorkResults from './pages/App/WorkResults/WorkResults.react.js';
import {Route, DefaultRoute, NotFoundRoute, RouteHandler, Redirect} from 'react-router';
import auth from './components/common/auth.js';
import Login from './pages/Login/Login.react.js';

export default (
  <Route handler={Root} path="/">
      <Redirect from="/" to="/app" />
      <Route handler={auth(App)} path="app">
        <DefaultRoute handler={Overview} name="overview" />
        <NotFoundRoute handler={NotFound} name="not-found" />
        <Route handler={BlockedWork} name="blockedwork">
            <Route handler={NoLocation} name="nolocation" />
            <Route handler={Shorted} name="shorted" />
        </Route>
        <Route handler={WorkResults} name="workresults" />
     </Route>
    <Route handler={Login} path="login" />
  </Route>
);
