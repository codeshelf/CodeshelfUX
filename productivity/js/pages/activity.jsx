var React = require('react');
var Navbar = require('components/nav').Navbar;
var NavbarTop = require('components/nav').NavbarTop;
var Breadcrumbs = require('components/breadcrumb');
var OrderDetailIBox = require('components/orderdetailibox');
var $ = require('jquery');
var Rx = require('rx');
var csapi = require('data/csapi');

var el = React.createElement;

var ActivityPage = React.createClass({
    getCheRuns : function() {
        //Render Che Runs
        var facilityId = facility['persistentId'];
        csapi.getCheRuns(endpoint, facilityId).then(function(runs) {
            console.log("The che runs", runs);
        });

    },

    getInitialState: function() {
        return {
            "productivity" : {}
        };
    },

    componentWillMount: function () {
        //Render updates of productivity
        var subscription = this.props.productivityStream.subscribe(function(productivityUpdate) {
            console.log("received productivityupdate", productivityUpdate);
            this.setState({"productivity": productivityUpdate});
        }.bind(this));

    },

    renderOrderDetailComponents: function(productivityUpdate) {
        var groups = productivityUpdate["groups"];
        //Render an order detail component fro each group
        var orderDetailComponents = [];
        for(var groupName in groups) {
            var orderDetailSummaryData = groups[groupName];

            //Render Order Detail for order group
            orderDetailComponents.push(
                <div className="col-lg-3" key={groupName}>
                  <OrderDetailIBox groupName={groupName} 
                                   orderDetailSummaryData={orderDetailSummaryData}
                                   pickRate={orderDetailSummaryData["picksPerHour"]} />
                </div>
            );
        }
        return orderDetailComponents;
    },

    render: function() {

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
              <Navbar facility={facility} navMenus={navMenus} />
              <div id="page-wrapper" className="gray-bg dashboard-1">
                <NavbarTop />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className="row">
                  <div className="col-lg-12">
                    <div className="wrapper wrapper-content">
                       <div className="row orderdetails">
                         {this.renderOrderDetailComponents(this.state.productivity)}
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
