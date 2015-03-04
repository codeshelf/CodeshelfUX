/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');
var Router = require('react-router');;
var Route = Router.Route, DefaultRoute = Router.DefaultRoute,
    Link=Router.Link, RouteHandler = Router.RouteHandler;

var App = require('app');
var OrdersPage = require('pages/orders');
var OrderDetailsPage = require('pages/orderdetails');
var OverviewPage = require('pages/overview');
var ItemsNoLocationPage = require('pages/itemsnolocation');
var BlockedWorkPage = require('pages/blockedwork');
var SuspectGTINPage = require('pages/suspectgtin');

var routes = (
        <Route name="app" path="/" handler={App}>
            <Route name="orderdetails" path="orderdetails" handler={OrderDetailsPage} />
            <Route name="blockedwork" path="blockedwork" handler={BlockedWorkPage} />
            <Route name="itemsnolocation" path="itemsnolocation" handler={ItemsNoLocationPage} />
            <Route name="suspectgtin" path="suspectgtin" handler={SuspectGTINPage} />
            <DefaultRoute name="overview" handler={OverviewPage}/>
        </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, $('#page').get(0));
});
