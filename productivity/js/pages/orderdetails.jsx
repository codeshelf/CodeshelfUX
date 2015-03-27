var React = require('react');
var _ = require('lodash');
var Rx = require('rx');

var PickerEventsIBox = require('components/pickereventsibox');
var OrderDetailIBox = require('components/orderdetailibox');

var pollingPeriod = 20000;

var OrderDetailsPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Work Results";
        }
    },

    getInitialState: function() {
        return {
            "productivity" : {},
            "activeRuns": {}
        };
    },

    updateViews: function(props) {
        var {apiContext} = props;

        var pollerStream = Rx.Observable.timer(0, pollingPeriod /*ms*/);
        //Create stream of productivity updates for the facility
        var productivityStream = pollerStream.flatMapLatest(function() {
            return Rx.Observable.fromPromise(apiContext.getProductivity()).catch(Rx.Observable.empty());
        });

        //Create stream of productivity updates for the facility
        var activeRunsStream = pollerStream.flatMapLatest(function() {
            return Rx.Observable.fromPromise(apiContext.getCheRuns()).catch(Rx.Observable.empty());
        });
        this.setState(
            {
                productivityStream: productivityStream,
                activeRunsStream: activeRunsStream
            }
        );

        //Render updates of productivity
        var productivitySubscription = productivityStream.subscribe(function(productivityUpdate) {
            console.debug("received productivityupdate", productivityUpdate);
            if (!this.isMounted()) {
                return;
            }
            this.setState({"productivity": productivityUpdate});
        }.bind(this));



        var activeRunsSubscription = activeRunsStream.subscribe(function(activeRunsUpdate) {
            console.debug("received active Runs updated", activeRunsUpdate);
            if (!this.isMounted()) {
                return;
            }
            this.setState({"activeRuns": activeRunsUpdate});
        }.bind(this));

        this.setState({
            "productivitySubscription" : productivitySubscription,
            "activeRunsSubscription": activeRunsSubscription
        });

    },
    componentWillReceiveProps: function (nextProps) {
        this.updateViews(nextProps);
    },

    componentDidMount: function() {
        console.log("mounting od");
        this.updateViews(this.props);

    },
    componentWillUnmount: function() {
        console.log("unmounting od");
        var {productivitySubscription, activeRunsSubscription}  = this.state;
        if (productivitySubscription) {
            productivitySubscription.dispose();
        }

        if(activeRunsSubscription) {
            activeRunsSubscription.dispose();
        }
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
    setStartTimestamp: function(startTimestamp) {
        this.setState({startTimestamp: startTimestamp});
    },
    render: function() {
        var {productivity, activeRuns, startTimestamp, endTimestamp} = this.state;
        var {apiContext} = this.props;
        return (<div>
                    <div className="row orderdetails">
                        <div className="col-sm-12">
                            <PickerEventsIBox apiContext={apiContext} />
                        </div>
                    </div>
                    <div className="row orderdetails">
                        {this.renderOrderDetailComponents(productivity, activeRuns)}
                    </div>
                </div>
        );
    }
});


module.exports = OrderDetailsPage;
