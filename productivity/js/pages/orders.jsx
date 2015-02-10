var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var el = React.createElement;

var OrderSummaryIBox = require('components/ordersummaryibox');

var filterNames = ["All", "UPS/Fedex", "Trucking"];
var OrdersPage = React.createClass({

    getDefaultProps:function(){
        return {
            "orderSummaryStream" : Rx.Observable.empty()
        };
    },

    getInitialState: function() {
        return {
            "orderSummary": {}
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var apiContext = nextProps.apiContext;
        _.forEach(filterNames, function(filterName) {
            this.setupViewStream(apiContext, filterName);
        }.bind(this));
    },

    render: function() {

        return (<div className="row orders">
                  {
                      _.map(filterNames, function(filterName){
                          var title = `${filterName} Order Burn Down`;
                          return (<div className="col-sm-6 col-md-4" key={filterName}>
                                      <OrderSummaryIBox title={title} orderSummary={this.state[filterName]}/>
                                  </div>);
                      }.bind(this))
                  }
                </div>);
    },

    setupViewStream: function(apiContext, filterName){
        viewStream(apiContext, {"aggregate": "OrderHeader", "filterName": filterName}).subscribe(
            function(orderSummary) {
                var newPartialState = {};
                newPartialState[filterName] = orderSummary;
                this.setState(newPartialState);
            }.bind(this),
            function(error) {
                console.log(error);
            });
    }
});

function viewStream(apiContext, viewSpec) {
    return pollPromiseProducer(function() { return apiContext.getViewSnapshot(viewSpec);}, 5000);
}

function pollPromiseProducer(promiseProducer, period /*ms*/) {
    return Rx.Observable.timer(0, period)
        .flatMapLatest(function(){
                return Rx.Observable.fromPromise(promiseProducer()).catch(Rx.Observable.empty());
        });
}

module.exports = OrdersPage;
