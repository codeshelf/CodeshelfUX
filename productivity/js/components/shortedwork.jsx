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
    getDefaultProps: function() {
        return {
            "actualQuantity": 0
        };
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
            lineCount,
            total,
            details
        } = this.props;
        var ref = "faq" + sku;
        var href = "#" + ref;
        return (
                <div className="faq-item">
                <div className="row">
                <div className="col-md-4">
                <a data-toggle="collapse" href={href} className="faq-question">
                <div>{actualQuantity} of {total} {sku} {uom}</div>
                </a>
                <small>{description}</small>
                </div>
                <div className="col-md-4">
                {location}
            </div>
<div className="col-md-4 text-right">
                            <div className="row">
                                <div className="col-sm-6">
                Line Count:  <span className="badge">{lineCount}</span>

                                </div>
                                <div className="col-sm-6">
                Total Quantity: <span className="badge">{total}</span>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="row">
                <div className="col-lg-12">
                <div id={ref} className="panel-collapse faq-answer collapse">
                    <Table caption="Other orders with item" rows={details}/>
                </div>
                </div>
                </div>
                </div>);

    }
});


var ShortedWorkList = React.createClass({
    componentDidMount: function() {
    },
    render: function() {
        var {workDetails} = this.props;
        var grouped = this.groupByItem(workDetails);
        return (
                   <IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                         Shorted Order Lines By Item
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                      {
                          grouped.map(function(workDetail){
                              return (<ShortedWork key={workDetail["key"]}{...workDetail} />);
                          })
                      }
                      </div>
                      </IBox>
                      );
    },
    groupByItem: function(workDetails) {
        var groupedDetails = _.groupBy(workDetails, function(workDetail) {
            return (workDetail["sku"] + ":" + workDetail["uom"]);
        });
        var list = _.keys(groupedDetails).map(function(key) {
            var sameItems = groupedDetails[key];
            var first = sameItems[0];
            return {
                key: key,
                sku: first["sku"],
                uom: first["uom"],
                description: first["description"] ? first["description"]: "",
                lineCount: sameItems.length,
                total: _.reduce(sameItems, function(sum, orderDetail) {
                    return sum + orderDetail["planQuantity"];
                    }, 0),
                details: sameItems
            };
        });

        return list;
    }
});






module.exports = ShortedWorkList;
