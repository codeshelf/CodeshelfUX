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

export default (
  <Route handler={Root} path="/">
    <Redirect from="/" to="/facilities" />
    <Route handler={authn(App)} name="facilities"> //ensure auth and default facility
        <Route handler={Facility} name="facility" path=":facilityName">
        <DefaultRoute handler={Overview} name="overview" />
            <NotFoundRoute handler={NotFound} name="not-found" />
            <Route handler={Orders} name="orders"></Route>
            <Route handler={WorkInstructions} name="workinstructions"></Route>
            <Route handler={BlockedWork} name="blockedwork"></Route>
            <Route handler={WorkResults} name="workresults" />
            <Route handler={Import} name="import" />
            <Route handler={EDIGateways} name="edigateways">
                <Route handler={EDIGatewayEdit} name="edigatewayedit" path=":id"/>
            </Route>
            <Route handler={WorkerMgmt} name="workermgmt">
                <Route handler={WorkerDisplay} name="workernew" path="new" />
                <Route handler={WorkerDisplay} name="workerdisplay" path=":workerId" />
            </Route>
            <Route handler={Maintenance} name="maintenance">
                <Route handler={ExtensionPointEdit} name="parametersetedit" path="parametersset/:extensionPointId" />
            </Route>
            <Route handler={TestScript} name="testscript" />
            <Route handler={ExtensionPointsPage} name="extensionpoints">
                <Route handler={ExtensionPointAdd} name="extensionpointadd" path="new" />
                <Route handler={ExtensionPointEdit} name="extensionpointedit" path=":extensionPointId" />
            </Route>

        </Route>
    </Route>
    <Route handler={authn(Admin)} name="admin" path="admin">
        <Route handler={Users} name="users">
            <Route handler={UserAdd} name="usernew" path="new"/>
            <Route handler={UserEdit} name="useredit" path=":userId"/>
        </Route>
    </Route>

    <Route handler={Login} name="login" />
    <Route handler={SetupPassword} name="setuppassword" path="setuppassword"/>
    <Route handler={ChangePassword} name="changepassword" />
    <Route handler={RecoverPassword} name="recoverpassword" />
    <Route handler={RecoverSuccess} name="recoversuccess" />
  </Route>
);
