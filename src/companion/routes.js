import React from 'react';
import {Route, IndexRoute, NotFoundRoute, RouteHandler, Redirect, IndexRedirect} from 'react-router';
import Root from './Root.react.js';
import App from './pages/App/App.react.js';
import Admin from './pages/App/Admin/Admin.react.js';
import Facility from './pages/App/Facility/Facility.react.js';
import NotFound from 'pages/NotFound';
import Overview from './pages/App/Overview/Overview.react.js';
import Orders from './pages/App/Orders/Orders.react.js';
import WorkInstructions from './pages/App/WorkInstructions/WorkInstructions.react.js';
import BlockedWork from './pages/App/BlockedWork/BlockedWork.react.js';
import WorkResults from './pages/App/WorkResults/WorkResults.react.js';
import WorkerMgmt from './pages/App/WorkerMgmt/WorkerMgmt.react.js';
import WorkerDisplay from './pages/App/WorkerMgmt/WorkerDisplay.react.js';
import Import from './pages/App/Import/Import.react.js';
import EDIGateways from './pages/App/Import/EDIGateways.react.js';
import EDIGatewayEdit from './pages/App/Import/EDIGatewayEdit.react.js';
import {authn} from './components/common/auth.js';
import Login from './pages/Login/Login.react.js';
import Users from './pages/Users/Users.react.js';
import UserAdd from './pages/Users/UserAdd.react.js';
import UserEdit from './pages/Users/UserEdit.react.js';
import SetupPassword from './pages/SetupPassword/SetupPassword.react.js';
import ChangePassword from './pages/ChangePassword/ChangePassword.react.js';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword.react.js';
import RecoverSuccess from './pages/RecoverSuccess/RecoverSuccess.react.js';

import Maintenance from './pages/App/Maintenance/Maintenance.react.js';
import TestScript from './pages/App/TestScript/TestScript.react.js';
import ExtensionPointsPage from "./pages/App/ExtensionPoints/ExtensionPointsPage.react.js";
import ExtensionPointEdit from "./pages/App/ExtensionPoints/ExtensionPointEdit.react.js";
import ExtensionPointAdd from "./pages/App/ExtensionPoints/ExtensionPointAdd.react.js";
import ScheduledJobEdit from "./pages/App/Maintenance/ScheduledJobsEdit.react.js";
import ScheduledJobAdd from "./pages/App/Maintenance/ScheduledJobAdd.react.js";

// Redirect to mobile or to desktop web
import DetectMobile from "./components/common/DetectMobile.react.js";

//Mobile components
import mApp from './pages/Mobile/App.react.js';
import mHomeSearch from  './pages/Mobile/HomeSearch/HomeSearch.react.js';
import mOrderSearch from './pages/Mobile/OrderSearch/OrderSearch.react.js';
import mOrderDeatil from './pages/Mobile/OrderDetail/OrderDetail.react.js';
import mWorkerSearch from './pages/Mobile/WorkerSearch/WorkerSearch.react.js';
import mWorkerDetail from './pages/Mobile/WorkerDetail/WorkerDetail.react.js';
import mCartSearch from './pages/Mobile/CartSearch/CartSearch.react.js';
import mCartDetail from './pages/Mobile/CartDetail/CartDetail.react.js';
import mWorkerPickCharts from './pages/Mobile/WorkerPickCharts/WorkerPickCharts.react.js';
import LoadFacility from './pages/Mobile/Facility/LoadFacility.react.js';
import FacilityWrapper from './pages/Mobile/Facility/FacilityWrapper.react.js';
import Mobile from './pages/Mobile/Mobile.react.js';

export default (
  <Route component={Root} path="/">
    {/* Redirect to mobile or desktop web component */}
    <IndexRoute component={DetectMobile} />
    <Route component={authn(App)} path="facilities"> //ensure auth and default facility
      <Route component={Facility} path=":facilityName">
        <IndexRoute component={WorkResults} />
        <Route component={NotFound} path="*" />
        <Route component={Orders} path="orders" />
        <Route component={WorkInstructions} path="workinstructions" />
        <Route component={BlockedWork} path="blockedwork" />
        <Route component={Overview} path="overview" />
        <Route component={Import} path="import" />
        <Route component={EDIGateways} path="edigateways">
          <Route component={EDIGatewayEdit} path=":id"/>
        </Route>
        <Route component={WorkerMgmt} path="workermgmt">
          <Route component={WorkerDisplay} path="new" />
          <Route component={WorkerDisplay} path=":workerId" />
        </Route>
        <Route component={Maintenance} path="maintenance">
          <Route component={ExtensionPointEdit} path="parametersset/:parameterType" />
          <Route component={ScheduledJobAdd} path="newscheduledjob" />
          <Route component={ScheduledJobEdit} path="scheduledjobs/:type" />
        </Route>
        <Route component={TestScript} path="testscript" />
        <Route component={ExtensionPointsPage} path="extensionpoints">
          <Route component={ExtensionPointAdd} path="new" />
          <Route component={ExtensionPointEdit} path=":extensionPointId" />
        </Route>
      </Route>
    </Route>

    // Rotues for mobile version

    <Redirect from="/mobile" to="/mobile/facilities" />
    <Redirect from="/mobile/" to="mobile/facilities" />
    <Redirect from="/mobile/facilities/" to="/mobile/facilities" />

    <Route component={authn(Mobile)} path="mobile/facilities">
      <IndexRoute component={LoadFacility} />
      <Route component={FacilityWrapper} path=":facilityName">
        <Route component={mApp}>
          <IndexRedirect to="events" />
          <Route component={mWorkerPickCharts}  path="events"/>
          <Route component={mOrderSearch} path="orders" />
          <Route component={mOrderDeatil} path="orders/:id/:tab" />
          <Route component={mOrderDeatil} path="orders/:id" />
          <Route component={mWorkerSearch} path="workers" />
          <Route component={mWorkerDetail} path="workers/:id/:tab" />
          <Route component={mWorkerDetail} path="workers/:id" />
          <Route component={mCartSearch} path="carts" />
          <Route component={mCartDetail} path="carts/:id/:tab" />
          <Route component={mCartDetail} path="carts/:id" />
        </Route>
      </Route>
    </Route>

    // Routes from admin panel

    <Route component={authn(Admin)} path="admin">
      <Route component={Users} path="users">
        <Route component={UserAdd} path="new"/>
        <Route component={UserEdit} path=":userId"/>
      </Route>
    </Route>

    // Routes for user credentials

    <Route component={Login} path="login" />
    <Route component={SetupPassword} path="password/setup" />
    <Route component={ChangePassword} path="password/change" />
    <Route component={RecoverPassword} path="password/recover" />
    <Route component={RecoverSuccess} path="password/success" />
  </Route>
);
