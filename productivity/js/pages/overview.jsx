var React = require('react');
var _ = require('lodash');
var $ = require('jquery');

var el = React.createElement;

var StatusSummaryIBox = require('components/statussummaryibox');

var OverviewPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Order Overview";
        }
    },

    getInitialState: function() {
        return {
            "filterOptions": {},
            "views" : []
        };
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
                "apiContext": apiContext,
                "filterOptions" : filterOptions,
                "views": views
            });
        }.bind(this));
    },

    render: function() {
        return (<div className="row orders">
                  {
                      _.map(this.state.views, function(view){
                          var stateKey = view["filterName"] + view["aggregate"];
                          return (<div className="col-sm-6 col-md-4" key={stateKey}>
                                      <StatusSummaryIBox apiContext={this.state.apiContext} view={view} filterOptions={this.state.filterOptions}/>
                                  </div>);
                      }.bind(this))
                  }
                </div>);
    }
});

module.exports = OverviewPage;
