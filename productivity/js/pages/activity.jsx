var React = require('react');
var _ = require('lodash');
var Navbar = require('components/nav').Navbar;
var NavbarTop = require('components/nav').NavbarTop;
var Breadcrumbs = require('components/breadcrumb');
var OrderDetailIBox = require('components/orderdetailibox');
var $ = require('jquery');
var Rx = require('rx');
var csapi = require('data/csapi');

var el = React.createElement;

var ActivityPage = React.createClass({

    getInitialState: function() {
        return {
            "productivity" : {},
            "activeRuns": {}
        };
    },

    componentWillMount: function () {
        //Render updates of productivity
        var productivitySubscription = this.props.productivityStream.subscribe(function(productivityUpdate) {
            console.log("received productivityupdate", productivityUpdate);
            this.setState({"productivity": productivityUpdate});
        }.bind(this));

        var activeRunsSubscription = this.props.activeRunsStream.subscribe(function(activeRunsUpdate) {
            /*var activeRuns = [
                { label: "1",
                  summary: {
                      "complete": 20,
                      "short": 5,
                      "remaining": 4
                  }
                },
                { label: "2",
                  summary: {
                      "complete": 1,
                      "short": 0,
                      "remaining": 5
                  }
                }
            ];*/
            console.log("received active Runs updated", activeRunsUpdate);
            this.setState({"activeRuns": activeRunsUpdate});
        }.bind(this));


    },

    renderOrderDetailComponents: function(productivityUpdate, activeRunsUpdate) {
        var productivityByGroup = productivityUpdate["groups"];
        var runsByGroup = activeRunsUpdate["runsByGroup"];
        //Render an order detail component fro each group
        var orderDetailComponents = [];
        for(var groupName in productivityByGroup) {
            var orderDetailSummaryData = productivityByGroup[groupName];
            var activeRuns = (_.has(runsByGroup, groupName)) ? runsByGroup[groupName] : [];

            //Render Order Detail for order group
            orderDetailComponents.push(
                <div className="col-lg-3" key={groupName}>
                  <OrderDetailIBox groupName={groupName}
                                   orderDetailSummaryData={orderDetailSummaryData}
                                   pickRate={orderDetailSummaryData["picksPerHour"]}
                                   activeRuns={activeRuns}/>
                </div>
            );
        }
        return orderDetailComponents;
    },

    render: function() {
        var organization = this.props.organization;
        var facility = this.props.facility;
        var navMenus = [
            {"key": "activity",
             "label": "Activity",
             "icon": "fa-bar-chart-o",
             "menuItems": [
                 {"href": "#", key: "all", "label": "All" },
                 {"href": "#", key: "chill", "label": "Chill" },
                 {"href": "#", key: "dry", "label": "Dry" },
                 {"href": "#", key: "produce", "label": "Produce" }
             ]
            }];

        var breadcrumbs = [
            {"label": facility['domainId'], "href": "#"     },
            {"label": "Activity", "href": "#"},
            {"label": "Chill", "href": "#"}

        ];

        return (
            <div id="wrapper">
              <Navbar facility={facility} organization={organization} navMenus={navMenus} />
              <div id="page-wrapper" className="gray-bg dashboard-1">
                <NavbarTop />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className="row">
                  <div className="col-lg-12">
                    <div className="wrapper wrapper-content">
                       <div className="row orderdetails">
                         {this.renderOrderDetailComponents(this.state.productivity, this.state.activeRuns)}
                       </div>
                    </div>
                    <div className="footer">
                       <div className="pull-right">
                       </div>
                       <div>
                         <strong>Copyright</strong> Codeshelf &copy; 2014-2015
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>);
    }
});


module.exports = ActivityPage;
