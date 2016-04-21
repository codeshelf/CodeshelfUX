import React from 'react';
import {Route, IndexRoute, NotFoundRoute, RouteHandler, Redirect, IndexRedirect} from 'react-router';
import Root from './Root.react.js';
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
import PrintingTemplates from './pages/App/PrintingTemplates/PrintingTemplates.react.js';
import TemplateDisplay from './pages/App/PrintingTemplates/TemplateDisplay.react.js';
import Import from './pages/App/Import/Import.react.js';
import EDIGateways from './pages/App/Import/EDIGateways.react.js';
import EDIGatewayEdit from './pages/App/Import/EDIGatewayEdit.react.js';
import CartSearch from './pages/App/CartSearch/CartSearch.react.js';
import WorkerSearch from './pages/App/WorkerSearch/WorkerSearch.react.js';
import OrderSearch from './pages/App/OrderSearch/OrderSearch.react.js';
import {authn} from './components/common/auth.js';
import Login from './pages/Login/Login.react.js';
import Users from './pages/Users/Users.react.js';
import UserAdd from './pages/Users/UserAdd.react.js';
import UserEdit from './pages/Users/UserEdit.react.js';
import AuthRoot from './pages/Login/AuthRoot.react.js';
import SetupPassword from './pages/SetupPassword/SetupPassword.react.js';
import ChangePassword from './pages/ChangePassword/ChangePassword.react.js';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword.react.js';
import RecoverSuccess from './pages/RecoverSuccess/RecoverSuccess.react.js';

import Maintenance from './pages/App/Maintenance/Maintenance.react.js';
import TestScript from './pages/App/TestScript/TestScript.react.js';
import ExtensionPointsPage from "./pages/App/ExtensionPoints/ExtensionPointsPage.react.js";
import ExtensionPointEdit from "./pages/App/ExtensionPoints/ExtensionPointEdit.react.js";
import ExtensionPointAdd from "./pages/App/ExtensionPoints/ExtensionPointAdd.react.js";
import ScheduledJobs from "./pages/App/Maintenance/ScheduledJobs.react.js";
import ScheduledJobEdit from "./pages/App/Maintenance/ScheduledJobsEdit.react.js";
import ScheduledJobAdd from "./pages/App/Maintenance/ScheduledJobAdd.react.js";

// Redirect to mobile or to desktop web
import DetectMobile from "./components/common/DetectMobile.react.js";

//Mobile components
import mApp from './pages/Mobile/App.react.js';
import mHomeSearch from  './pages/Mobile/HomeSearch/HomeSearch.react.js';
import mOrderSearch from './pages/Mobile/OrderSearch/OrderSearch.react.js';
import OrderDetail from './pages/Detail/OrderDetail/OrderDetail.react.js';
import mWorkerSearch from './pages/Mobile/WorkerSearch/WorkerSearch.react.js';
import WorkerDetail from './pages/Detail/WorkerDetail/WorkerDetail.react.js';
import mCartSearch from './pages/Mobile/CartSearch/CartSearch.react.js';
import CartDetail from './pages/Detail/CartDetail/CartDetail.react.js';
import mWorkerPickCharts from './pages/Mobile/WorkerPickCharts/WorkerPickCharts.react.js';

import LoadContext from './pages/Facility/LoadContext.react.js';
import ContextWrapper from './pages/Facility/ContextWrapper.react.js';
import ReduxMobile from './pages/Mobile/Mobile.react.js';
import ReduxFacility from './pages/App/ReduxFacility.react.js';
import {reduxAdmin} from './pages/App/Admin/ReduxAdmin.react.js';

export default (
  <Route component={Root} path="/">
    {/* Redirect to mobile or desktop web component */}
    <IndexRoute component={DetectMobile} />
    <Route component={authn(ReduxFacility)} path="facilities"> //ensure auth and default facility
      <IndexRoute component={LoadContext} />
      <Route component={ContextWrapper} path=":facilityName/customers/:customerName">
        <Route component={Facility}>
          <IndexRedirect to="workresults" />

          <Route component={WorkResults} path="workresults" />
          <Route component={Orders} path="orders" />
          <Route component={WorkInstructions} path="workinstructions" />
          <Route component={BlockedWork} path="blockedwork" />
          <Route component={Overview} path="overview" />
          <Route component={Import} path="import" />
          <Route component={EDIGateways} path="edigateways">
            <Route component={EDIGatewayEdit} path=":id"/>
          </Route>
          <Route component={WorkerMgmt} path="workers">
            <Route component={WorkerDisplay} path="new" />
            <Route component={WorkerDisplay} path=":workerId" />
          </Route>
          <Route component={PrintingTemplates} path="templates">
            <Route component={TemplateDisplay} path="new" />
            <Route component={TemplateDisplay} path=":templateId" />
          </Route>
          <Route component={Maintenance} path="maintenance">
            <Route component={ExtensionPointEdit} path="parameterset/:parameterType" />
          </Route>
          <Route component={ScheduledJobs} path="scheduledjobs">
           <Route component={ScheduledJobAdd} path="new" />
           <Route component={ScheduledJobEdit} path=":type" />
          </Route>
          <Route component={TestScript} path="testscript" />
          <Route component={OrderSearch} path="ordersearch" />
          <Route component={OrderDetail} path="orders/:id">
            <IndexRedirect to="detail" />
            <Route component={OrderDetail} path=":tab" />
          </Route>
          <Route component={WorkerSearch} path="workersearch" />
          <Route component={WorkerDetail} path="worker/:id">
            <IndexRedirect to="detail" />
            <Route component={WorkerDetail} path=":tab" />
          </Route>
          <Route component={CartSearch} path="cartsearch" />
          <Route component={CartDetail} path="carts/:id">
            <IndexRedirect to="detail" />
            <Route component={CartDetail} path=":tab" />
          </Route>
          <Route component={ExtensionPointsPage} path="extensionpoints">
            <Route component={ExtensionPointAdd} path="new" />
            <Route component={ExtensionPointEdit} path=":extensionPointId" />
          </Route>
          <Route component={NotFound} path="*" />
       </Route>
      </Route>
    </Route>

    // Rotues for mobile version

    <Redirect from="/mobile" to="/mobile/facilities" />
    <Redirect from="/mobile/" to="mobile/facilities" />
    <Redirect from="/mobile/facilities/" to="/mobile/facilities" />

    <Route component={authn(ReduxMobile)} path="mobile/facilities">
      <IndexRoute component={LoadContext} />
      <Route component={ContextWrapper} path=":facilityName/customers/:customerName">
        <Route component={mApp}>
          <IndexRedirect to="events" />
          <Route component={mWorkerPickCharts}  path="events"/>
          <Route component={mOrderSearch} path="orders" />
          <Route component={OrderDetail} path="orders/:id">
            <IndexRedirect to="order" />
            <Route component={OrderDetail} path=":tab" />
          </Route>
          <Route component={mWorkerSearch} path="workers" />
          <Route component={WorkerDetail} path="workers/:id">
            <IndexRedirect to="detail" />
            <Route component={WorkerDetail} path=":tab" />
          </Route>
          <Route component={mCartSearch} path="carts" />
          <Route component={CartDetail} path="carts/:id">
            <IndexRedirect to="detail" />
            <Route component={CartDetail} path=":tab" />
          </Route>
        </Route>
      </Route>
    </Route>

    // Routes from admin panel
    <Route component={authn(reduxAdmin(Admin))} path="admin">
      <Route component={Users} path="users">
        <Route component={UserAdd} path="new"/>
        <Route component={UserEdit} path=":userId"/>
      </Route>
    </Route>
    // Routes for user credentials

    <Route component={AuthRoot}>
      <Route component={Login} path="login" />
      <Route component={SetupPassword} path="password/setup" />
      <Route component={ChangePassword} path="password/change" />
      <Route component={RecoverPassword} path="password/recover" />
      <Route component={RecoverSuccess} path="password/success" />
    </Route>
  </Route>
);
