var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var el = React.createElement;

var OrderSummaryIBox = require('components/ordersummaryibox');

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
        var orderSummaryStream = Rx.Observable.just({"released": 1,
                                                     "inprogress": 4,
                                                     "complete": 5,
                                                     "short": 3}); //test data


        var orderSummarySubscription  = orderSummaryStream.subscribe(function(orderSummary) {
            console.debug("received orderSummary update", orderSummary);
            this.setState({"orderSummary": orderSummary});
        }.bind(this));
    },

    render: function() {

        return (
                <div className="row orders">
                <div className="col-sm-6 col-md-4">
                     <OrderSummaryIBox orderSummary={this.state.orderSummary} />
                </div>
            </div>
);
    }
});


module.exports = OrdersPage;
