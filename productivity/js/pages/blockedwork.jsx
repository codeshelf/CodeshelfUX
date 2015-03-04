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

var {ListGroup, ListGroupItem, Badge} = require('react-bootstrap');

var BlockedWorkPage = React.createClass({
    statics: {
        getTitle: function() {
            return "Blocked Work";
        }
    },

    render: function() { return (
                     <IBox>
                      <IBoxTitleBar>
                      <IBoxTitleText>
                         Blocked Work
                      </IBoxTitleText>
                      </IBoxTitleBar>
                      <div className="ibox-content">
                      <ListGroup>
                          <ListGroupItem href="#/itemsnolocation">Items without Location<Badge>3</Badge></ListGroupItem>
                          <ListGroupItem>Shorted Work<Badge>5</Badge> </ListGroupItem>
                          <ListGroupItem>Suspect Order Lines<Badge>2</Badge> </ListGroupItem>
                          <ListGroupItem>Suspect UPC<Badge>8</Badge>  </ListGroupItem>
                          <ListGroupItem>Unsequenced Work<Badge>3</Badge> </ListGroupItem>
                      </ListGroup>
                      </div>
                      </IBox>
);}});






module.exports = BlockedWorkPage;
