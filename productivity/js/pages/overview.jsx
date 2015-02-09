var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var el = React.createElement;

var StatusSummaryIBox = require('components/statussummaryibox');

var OverviewPage = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentWillReceiveProps: function (nextProps) {
        var apiContext = nextProps.apiContext;
        var promise = apiContext.getFilters();
        promise.then(function(filterOptions){
            var views = [
                {
                    totalLabel: "Orders",
                    totalLabelSingular: "Order",
                    filterName: filterOptions[0],
                    aggregate: "OrderHeader"
                },
                {
                    totalLabel: "Lines",
                    totalLabelSingular: "Line",
                    filterName: filterOptions[0],
                    aggregate: "OrderDetail"
                },
                {
                    totalLabel: "Cases",
                    totalLabelSingular: "Case",
                    filterName: filterOptions[0],
                    aggregate: "Case"
                }
            ];
            this.setState({
                "filterOptions" : filterOptions,
                "views": views
            });
            _.forEach(views, function(view) {
                this.setupViewStream(apiContext, view);
            }.bind(this));
        }.bind(this));
    },

    render: function() {

        return (<div className="row orders">
                  {
                      _.map(this.state.views, function(view){
                          var {
                              filterName,
                              totalLabel,
                              totalLabelSingular

                          } = view;
                          var title = `${filterName} ${totalLabel} Burn Down`;
                          var stateKey = view["filterName"] + view["aggregate"];
                          return (<div className="col-sm-6 col-md-4" key={title}>
                                      <StatusSummaryIBox title={title} statusSummary={this.state[stateKey]} totalLabel={totalLabel} totalLabelSingular={totalLabelSingular} filterOptions={this.state.filterOptions}/>
                                  </div>);
                      }.bind(this))
                  }
                </div>);
    },

    setupViewStream: function(apiContext, view){
        viewStream(apiContext, view).subscribe(
            function(statusSummary) {
                var stateKey = view["filterName"] + view["aggregate"];
                var newPartialState = {};
                newPartialState[stateKey] = statusSummary;
                this.setState(newPartialState);
            }.bind(this),
            function(error) {
                console.log(error);
            });
    }
});

function viewStream(apiContext, viewSpec) {
    return pollPromiseProducer(function() { return apiContext.getSummarySnapshot(viewSpec);}, 5000);
}

function pollPromiseProducer(promiseProducer, period /*ms*/) {
    return Rx.Observable.timer(0, period)
        .flatMapLatest(function(){
                return Rx.Observable.fromPromise(promiseProducer()).catch(Rx.Observable.empty());
        });
}

module.exports = OverviewPage;
