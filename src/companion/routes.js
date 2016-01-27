import React from 'react';
import {Route, DefaultRoute, NotFoundRoute, RouteHandler, Redirect} from 'react-router';
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
import mWorkerPickCharts from './pages/Mobile/WorkerPickCharts/WorkerPickCharts.react.js';
import LoadFacility from './pages/Mobile/Facility/LoadFacility.react.js';
import FacilityWrapper from './pages/Mobile/Facility/FacilityWrapper.react.js';
import Mobile from './pages/Mobile/Mobile.react.js';

export default (
  <Route handler={Root} path="/">
    {/* Redirect to mobile or desktop web component */}
    <DefaultRoute handler={DetectMobile} />
    <Route handler={authn(App)} name="facilities"> //ensure auth and default facility
      <Route handler={Facility} name="facility" path=":facilityName">
        <DefaultRoute handler={WorkResults} name="workresults" />
        <NotFoundRoute handler={NotFound} name="not-found" />
        <Route handler={Orders} name="orders" />
        <Route handler={WorkInstructions} name="workinstructions" />
        <Route handler={BlockedWork} name="blockedwork" />
        <Route handler={Overview} name="overview" />
        <Route handler={Import} name="import" />
        <Route handler={EDIGateways} name="edigateways">
          <Route handler={EDIGatewayEdit} name="edigatewayedit" path=":id"/>
        </Route>
        <Route handler={WorkerMgmt} name="workermgmt">
          <Route handler={WorkerDisplay} name="workernew" path="new" />
          <Route handler={WorkerDisplay} name="workerdisplay" path=":workerId" />
        </Route>
        <Route handler={Maintenance} name="maintenance">
          <Route handler={ExtensionPointEdit} name="parametersetedit" path="parametersset/:parameterType" />
          <Route handler={ScheduledJobAdd} name="scheduledjobadd" path="newscheduledjob" />
          <Route handler={ScheduledJobEdit} name="scheduledjobedit" path="scheduledjobs/:type" />
        </Route>
        <Route handler={TestScript} name="testscript" />
        <Route handler={ExtensionPointsPage} name="extensionpoints">
          <Route handler={ExtensionPointAdd} name="extensionpointadd" path="new" />
          <Route handler={ExtensionPointEdit} name="extensionpointedit" path=":extensionPointId" />
        </Route>
      </Route>
    </Route>

    // Rotues for mobile version

    <Redirect from="/mobile" to="mobile" />
    <Redirect from="/mobile/" to="mobile" />
    <Redirect from="/mobile/facilities/" to="mobile" />

    <Route handler={authn(Mobile)} name="mobile" path="mobile/facilities">
      <DefaultRoute handler={LoadFacility} />
      <Route handler={FacilityWrapper} name="mobile-facility" path=":facilityName">
        <Route handler={mApp}>
          <Route handler={mOrderSearch} name="mobile-search-orders" path="search/order" />
          <Route handler={mOrderDeatil} name="mobile-order-datail" path="orderDetail/:id" />
          <Route handler={mWorkerSearch} name="mobile-search-workers" path="search/worker" />
          <Route handler={mWorkerDetail} name="mobile-worker-datail" path="workerDetail/:id" />
          <DefaultRoute handler={mWorkerPickCharts} name="mobile-events" path="events" />
        </Route>
      </Route>
    </Route>

    // Routes from admin panel

    <Route handler={authn(Admin)} name="admin" path="admin">
      <Route handler={Users} name="users">
        <Route handler={UserAdd} name="usernew" path="new"/>
        <Route handler={UserEdit} name="useredit" path=":userId"/>
      </Route>
    </Route>

    // Routes for user credentials

    <Route handler={Login} name="login" />
    <Route handler={SetupPassword} name="setuppassword" path="setuppassword"/>
    <Route handler={ChangePassword} name="changepassword" />
    <Route handler={RecoverPassword} name="recoverpassword" />
    <Route handler={RecoverSuccess} name="recoversuccess" />
  </Route>
);
