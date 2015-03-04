var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var csapi = require('data/csapi');
var el = React.createElement;

var OrderDetailIBox = require('components/orderdetailibox');
var OrderSummaryIBox = require('components/ordersummaryibox');

var pollingPeriod = 20000;

var OrderDetailsPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Activity";
        }
    },

    getDefaultProps:function(){
        return {
            "endpoint" : "",
            "facility" : {}
        };
    },

    getInitialState: function() {
        return {
            "productivity" : {},
            "activeRuns": {}
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var {endpoint, facility} = nextProps;
        var facilityId = facility['persistentId'];

        var pollerStream = Rx.Observable.timer(0, pollingPeriod /*ms*/);
        //Create stream of productivity updates for the facility
        var productivityStream = pollerStream.flatMapLatest(function() {
            return Rx.Observable.fromPromise(csapi.getProductivity (endpoint, facilityId)).catch(Rx.Observable.empty());
        });

        //Create stream of productivity updates for the facility
        var activeRunsStream = pollerStream.flatMapLatest(function() {
            return Rx.Observable.fromPromise(csapi.getCheRuns(endpoint, facilityId)).catch(Rx.Observable.empty());
        });


        //Render updates of productivity
        var productivitySubscription = productivityStream.subscribe(function(productivityUpdate) {
            console.debug("received productivityupdate", productivityUpdate);
            this.setState({"productivity": productivityUpdate});
        }.bind(this));



        var activeRunsSubscription = activeRunsStream.subscribe(function(activeRunsUpdate) {
            console.debug("received active Runs updated", activeRunsUpdate);
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
                <div className="col-sm-6 col-md-4" key={groupName}>
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

        return (
                <div className="row orderdetails">
                {this.renderOrderDetailComponents(this.state.productivity, this.state.activeRuns)}
            </div>
);
    }
});


module.exports = OrderDetailsPage;
