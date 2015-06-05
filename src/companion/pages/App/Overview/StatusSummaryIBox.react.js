var React = require("react");
var Icon = require("react-fa");
var Rx = require('rx');

var {StatusSummary} = require("data/types");
var SummaryFilter = require("./SummaryFilter");
var SummaryList = require("components/common/SummaryList");
var DoughnutSummary = require("components/common/DoughnutSummary");
var ibox = require("components/common/IBox");
var IBox = ibox.IBox;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;
var IBoxData = ibox.IBoxData;



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

       return  pollPromiseProducer(function() {
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

        var summaryList = _.map(StatusSummary.Templates, (template) => {
            return {
                id: template.key,
                label: <div><Icon name="square" style={{color: template.color, marginRight: "1em"}}/>{template.label}</div>,
                quantity: statusSummary[template.key]
            };
        });
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
                <IBoxSection>
                    <SummaryList list={summaryList} />
                </IBoxSection>
               </IBox>);

    }
});

function toSummaryList(statusSummary) {

}

function pollPromiseProducer(promiseProducer, period /*ms*/) {
    return Rx.Observable.timer(0, period)
        .flatMapLatest(function(){
            return Rx.Observable.fromPromise(promiseProducer()).catch(Rx.Observable.empty());
        });
}

module.exports = StatusSummaryIBox; //Exports the class
