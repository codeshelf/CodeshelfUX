var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var csapi = require('data/csapi');
var el = React.createElement;

var ibox = require('components/ibox');
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;

var {Table} = require('components/table');

var ShortedWork = React.createClass({
    orderDetailsWithItem: function(sku, uom) {
        return [
            "251935,251935.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,FEDEX,Arcu Eu Odio Corp.",

            "251970,251970.3,1,3/2/2015 12:00:00,3/2/2015 12:00:00,UPS,Placerat Eget Inc.",
            "251969,251969.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,ENVCO,Est Nunc Ullamcorper Corporation",
            "251584,251584.23,15,3/2/2015 12:00:00,3/2/2015 12:00:00,LANDB,Libero Morbi Accumsan Company"
        ];
    },
    render: function() {
        var {
            index,
            sku,
            uom,
            description,
            orderId,
            actualQuantity,
            planQuantity,
            location,
            lines,
            total
        } = this.props;
        var ref = "faq" + sku;
        var href = "#" + ref;
        var rows = this.orderDetailsWithItem(sku, uom);
        return (
                <div className="faq-item">
                <div className="row">
                <div className="col-md-4">
                <a data-toggle="collapse" href={href} className="faq-question">
                <div>{actualQuantity} of {planQuantity} {sku} {uom}</div>
                <div>{orderId}</div>
                </a>
                <small>{description}</small>
                </div>
                <div className="col-md-4">
                {location}
            </div>
                <div className="col-md-4 text-right">
                Lines: <span className="badge">{lines}</span>
                Total: <span className="badge">{total}</span>
                </div>
                </div>
                <div className="row">
                <div className="col-lg-12">
                <div id={ref} className="panel-collapse faq-answer collapse">
                <Table caption="Other orders with item" rows={rows}/>
                </div>
                </div>
                </div>
                </div>);

    }
});


var ShortedWorkList = React.createClass({
    getInitialState: function() {
        return {
            "shortedworklist": []
        };
    },
    componentDidMount: function() {
        var {apiContext, type} = this.props;
        apiContext.getBlockedWork(type).then(
            function(items) {
                if (this.isMounted()) {
                    this.setState({
                        "shortedworklist" : items
                    });
                }
            }.bind(this)
        );
    },
    render: function() {
        var {shortedworklist} = this.state;
        return (
                   <IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                         Shorted Work
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                      {
                          shortedworklist.map(function(shortedwork){
                              return (<ShortedWork key={shortedwork["sku"]}{...shortedwork} />);
                          })
                      }
                      </div>
                      </IBox>
);}});






module.exports = ShortedWorkList;
