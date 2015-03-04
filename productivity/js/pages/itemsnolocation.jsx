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

var Row = React.createClass({
    render: function() {
        var {data} = this.props;
        var cells = data.split(",");
        var i = 0;
        return (
                            <tr>
                                {

                                    cells.map(function(value) {
                                        return (<td key={i++}>{value}</td>);
                                    })

                                }
                            </tr>

        );
    }
});

var Header = React.createClass({
    render: function() {
        var {data} = this.props;
        var cells = data.split(",");
        var i = 0;
        return (
                <thead>
                    <tr>
                {

                    cells.map(function(value) {
                        return (<th key={i++}>{value}</th>);
                    })

                }
            </tr>
            </thead>

        );
    }
});

var BlockedWorkItem = React.createClass({
    render: function() {
        var {
            index,
            sku,
            uom,
            description,
            lines,
            total
        } = this.props;
        var ref = "faq" + sku;
        var href = "#" + ref;
        return (
            <div className="faq-item">
              <div className="row">
                                <div className="col-md-8">
                      <a data-toggle="collapse" href={href} className="faq-question">{sku} {uom}</a>
                                  <small>{description}</small>
                                </div>
                                <div className="col-md-4 text-right">
                                  Lines: <span className="badge">{lines}</span>
                                  Total: <span className="badge">{total}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div id={ref} className="panel-collapse faq-answer collapse">
                                <table className="table table-striped">

                            <Header data="Order Id, Order Detail Id, Quantity, Order Date, Due Date, Shipper, Customer" />
                            <tbody>
                <Row data="251935,251935.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,FEDEX,Arcu Eu Odio Corp."/>
                <Row data="251970,251970.3,1,3/2/2015 12:00:00,3/2/2015 12:00:00,UPS,Placerat Eget Inc."/>
                <Row data="251969,251969.2,1,3/2/2015 12:00:00,3/2/2015 12:00:00,ENVCO,Est Nunc Ullamcorper Corporation"/>
                <Row data="251584,251584.23,15,3/2/2015 12:00:00,3/2/2015 12:00:00,LANDB,Libero Morbi Accumsan Company"/>
                             </tbody>
                        </table>

                                    </div>
                                </div>
                            </div>
</div>
);
    }
});


var ItemNoLocationPage = React.createClass({
render: function() { return (<IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                         Items without Location
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                      <BlockedWorkItem sku="KN-PS-6" uom="CS" description="Knife 6in." lines="4" total="18" />
                      <BlockedWorkItem sku="BO-PA-12-P" uom="PK" description="12 OZ PAPER BOWL - 50/pack" lines="1" total="1" />
                      <BlockedWorkItem sku="BO-PA-16-P" uom="PK" description="16 OZ PAPER BOWL - 50/pack" lines="2" total="2" />
                      </div>
                      </IBox>
);}});






module.exports = ItemNoLocationPage;
