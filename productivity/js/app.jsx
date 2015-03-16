/** this is the entry point that is transformed into bundle.js */

var React = require('react');
var $ = require('jquery');
var Rx = require('rx');



var csapi = require('data/csapi');
var urlparse = require('helpers/urlparse');

var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var RouteHandler = Router.RouteHandler;

var Navbar = require('components/nav').Navbar;
var NavbarTop = require('components/nav').NavbarTop;
var Breadcrumbs = require('components/breadcrumb');
var ActivityPage = require('pages/activity');


var App = React.createClass({
    mixins: [ Router.State ],
    getInitialState: function() {
        return {
            "endpoint": "",
            "organization": {},
            "facility": {}
        };
    },

    selectedFacility: function(endpoint, facility) {
        var endpointParser = document.createElement('a');
        endpointParser.href = endpoint;
        var organization = {"domainId": endpointParser.hostname};


        this.setState({
            "endpoint": endpoint,
            "organization": organization,
            "facility": facility
        });
    },

    componentWillMount: function() {
        var params = urlparse.parseParameters(window.location);
        var endpoint = params['endpoint'];
        if (endpoint !== undefined) {
            if (endpoint.indexOf("http") < 0 && endpoint.indexOf("//") < 0) {
                endpoint = "//admin.codeshelf.com/" + endpoint;
            }
        } else {
            //synchronous call to get hosts.json
            var config = (function(){
                var config = {};
                $.ajax({
                    url: "config/hosts.json",
                    success: function(data) {
                        config = data;
                    },
                    dataType: "json",
                    async:false
                });
                return config;})();


            endpoint = config["endpoint"];
        }

        var el = React.createElement;

        csapi.getFacilities(endpoint).then(function(facilities) {
            this.selectedFacility(endpoint, facilities[0]);

        }.bind(this));
    },

    getLeafTitle: function() {
        var route = _.last(this.getRoutes());
        var handlerClass = route.handler;
        if (handlerClass.getTitle) {
            return handlerClass.getTitle();
        } else {
            return  "";
        }
    },

    render: function() {
        var apiContext = null;
        var {
            organization,
            facility,
            endpoint} = this.state;

        var navMenus = [
            {"key": "activity",
             "label": "Activity",
             "icon": "fa-bar-chart-o",
             "menuItems": []
            }];

        var breadcrumbs = [
            {"label": facility['domainId'], "href": "#"     },
            {"label": "Activity", "href": "#"}
        ];

        if (facility && endpoint) {
           apiContext = csapi.getFacilityContext(endpoint, facility);
        }

        return (
            <div id="wrapper">
                <div className="row">
                <div className="col-md-12"                >
                <Navbar title={facility['domainId']} navMenus={navMenus} />
                <div id="page-wrapper" className="gray-bg dashboard-1">
                <NavbarTop title={this.getLeafTitle()}/>
                {/**
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    **/}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper wrapper-content">
                                {
                                   (apiContext) ?
                                       <RouteHandler
                                           endpoint={endpoint}
                                           facility={facility}
                                           apiContext={apiContext} /> : null
                                }

                            </div>
                            <div className="footer">
                                <div className="pull-right"> </div>
                                <strong>Copyright</strong> Codeshelf &copy; 2014-2015
                            <div>

                        </div>
                    </div>
                </div>
            </div>
           </div>

                </div>
                </div>
           </div>);
    }

});

module.exports = App;
