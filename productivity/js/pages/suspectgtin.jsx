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
               <a className="list-group-item" href="#/itemsnolocation">    
                                    <span className="badge badge-primary">{total}</span>
                                {description}
                            </a>
               );
    }
});


var SuspectGTINPage = React.createClass({
render: function() { return (
                     <IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                         Blocked Work
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                      <div className="list-group">
                          <BlockedWorkItem description="Items without Location" total="3" />
                          <BlockedWorkItem description="Shorted Work" total="5" />
                          <BlockedWorkItem description="Invalid Line Items" total="2" />
                          <BlockedWorkItem description="Suspect UPC" total="8" />    
                          <BlockedWorkItem description="Unsequenced Work" total="3" />
                        </div>
                      </div>
                      </IBox>
);}});






module.exports = SuspectGTINPage;
