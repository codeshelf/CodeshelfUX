import DocumentTitle from 'react-document-title';

var React = require('react');
var _ = require('lodash');

var el = React.createElement;

var StatusSummaryIBox = require('./StatusSummaryIBox');
var TopItems = require('./TopItems');
import  {getFacilityContext} from 'data/csapi';

var OverviewPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Work Overview";
        }
    },

    getInitialState: function() {
        return {
            "filterOptions": {},
            "views" : []
        };
    },

    updateViews: function(props) {
        var apiContext = getFacilityContext();
        var promise = apiContext.getFilters();
        promise.then(function(filterOptions){
            if (!this.isMounted()) {
                return;
            }
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
    componentWillReceiveProps: function(nextProps) {
        this.updateViews(nextProps);
    },
    componentDidMount: function () {
        this.updateViews(this.props);
    },

    render: function() {
        var {views, apiContext, filterOptions} = this.state;
        return ( <DocumentTitle title="Overview">
                 <div className="wrapper wrapper-content">

                 <div className="row orders">
                 {
                     _.map(views, function(view){
                         var stateKey = view["filterName"] + view["aggregate"];
                         return (<div className="col-sm-6 col-md-4" key={stateKey}>
                                 <StatusSummaryIBox apiContext={apiContext} view={view} filterOptions={filterOptions}/>
                                 </div>);
                     }.bind(this))
                 }
                 </div>
                 <div className="row">
                 <div className="col-sm-6 col-md-4" key="topitems">
                 <TopItems apiContext={apiContext} />
                 </div>
                 </div>

                 </div>
                 </DocumentTitle>);
    }
});

module.exports = OverviewPage;
