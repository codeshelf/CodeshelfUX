/** @jsx React.DOM */

var React = require("react");
var Rx = require('rx');

var ibox = require("./ibox.jsx");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IBoxData = ibox.IBoxData;
var SummaryFilter = require("./summaryfilter.jsx");
var DoughnutSummary = require("./doughnutsummary.jsx");

var pollingPeriod = 20000;

var StatusSummaryIBox = React.createClass({

    getDefaultProps: function() {
        return {
            "apiContext": {},
            "view": {},
            "filterOptions": []
        };
    },

    getInitialState : function() {
        return {
            view: this.props.view,
            statusSummary: {}
        };
    },

    componentDidMount: function() {
        var subscription = this.setupViewStream(this.props.apiContext, this.state.view);
        this.setState({subscription: subscription});
    },

    componentWillUnmount: function() {
        if (this.state.subscription) {
            this.state.subscription.dispose();
        }
    },

    handleFilterChange: function(filter){
        this.setupViewStream(this.props.apiContext, this.state.view);
        this.state.view["filterName"] = filter;
        this.setState({view: this.state.view});
    },

    setupViewStream: function(apiContext, view){
        var subscription = this.state.subscription;
        if (subscription != null) {
            subscription.dispose();
        }

        pollPromiseProducer(function() {
            //produce promise on every tick of poller
            return apiContext.getSummarySnapshot(view);}, pollingPeriod)
        .subscribe(
            function(statusSummary) {
                if (this.isMounted()) {
                    this.setState({statusSummary: statusSummary});
                }
            }.bind(this),
            function(error) {
                console.log(error);
            });
    },

    render: function() {
        var {
            totalLabel,
            totalLabelSingular
        } = this.props.view;

        var filterName = this.state.view["filterName"];
        var statusSummary = this.state.statusSummary;
        var filterOptions = this.props.filterOptions;
        var title = `${filterName} ${totalLabel} Burn Down`;
        return (<IBox>
                  <IBoxTitleBar>
                    <IBoxTitleText>
                        {title}
                    </IBoxTitleText>
                    <SummaryFilter filters={filterOptions}
                                   onChange={this.handleFilterChange}/>
                  </IBoxTitleBar>
                <IBoxSection>
                    <DoughnutSummary summaryData={statusSummary}
                                     totalLabelSingular={totalLabelSingular}
                                     totalLabel={totalLabel} />
                </IBoxSection>
               </IBox>);

    }
});

function pollPromiseProducer(promiseProducer, period /*ms*/) {
    return Rx.Observable.timer(0, period)
        .flatMapLatest(function(){
            return Rx.Observable.fromPromise(promiseProducer()).catch(Rx.Observable.empty());
        });
}

module.exports = StatusSummaryIBox; //Exports the class
