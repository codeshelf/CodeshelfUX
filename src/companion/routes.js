import Root from './Root.react.js';
import App from './pages/App/App.react.js';
import Facility from './pages/App/Facility/Facility.react.js';
import NotFound from 'pages/NotFound';
import React from 'react';
import Overview from './pages/App/Overview/Overview.react.js';
import BlockedWork from './pages/App/BlockedWork/BlockedWork.react.js';
import WorkResults from './pages/App/WorkResults/WorkResults.react.js';
import WorkerMgmt from './pages/App/WorkerMgmt/WorkerMgmt.react.js';
import WorkerDisplay from './pages/App/WorkerMgmt/WorkerDisplay.react.js';
import Import from './pages/App/Import/Import.react.js';
import {Route, DefaultRoute, NotFoundRoute, RouteHandler, Redirect} from 'react-router';
import {authn} from './components/common/auth.js';
import Login from './pages/Login/Login.react.js';

export default (
  <Route handler={Root} path="/">
    <Redirect from="/" to="/app" />
    <Route handler={authn(App)} name="app"> //ensure auth and default facility
        <Route  handler={Facility} name="facility" path=":facilityName">
	        <DefaultRoute handler={Overview} name="overview" />
	        <NotFoundRoute handler={NotFound} name="not-found" />
	        <Route handler={BlockedWork} name="blockedwork"></Route>
	        <Route handler={WorkResults} name="workresults" />
	        <Route handler={Import} name="import" />
	        <Route handler={WorkerMgmt} name="workermgmt">
	            <Route handler={WorkerDisplay} name="workerdisplay" path=":workerId" />
	        </Route>
	     </Route>
       </Route>
    <Route handler={Login} name="login" />
  </Route>
);
