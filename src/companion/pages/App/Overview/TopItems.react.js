var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

var csapi = require('data/csapi');
var {StatusSummary} = require('data/types');
var el = React.createElement;

var ibox = require('components/common/IBox');
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;

var {ListGroup, ListGroupItem, Badge} = require('react-bootstrap');

var TopItems = React.createClass({
    getInitialState: function() {
        return {
            "items" : []
        };
    },

    updateViews: function(props) {
        var {apiContext} = props;
        if (!apiContext) {
            return;
        }
        apiContext.getTopItems().then(
            function(items) {
                if (this.isMounted()) {
                    this.setState({
                        "items": items
                    });
                }
            }.bind(this)
        );
    },
    componentWillReceiveProps: function(nextProps) {
        this.updateViews(nextProps);
    },
    componentDidMount: function() {
        this.updateViews(this.props);
    },
    componentWillUnmount: function() {},
    show: function(type) {
        this.setState({"selectedtype" : type});
    },

    render: function() {
        var {items} = this.state;
        return (

                <IBox>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            Top {items.length} Items
                        </IBoxTitleText>
                    </IBoxTitleBar>
                    <div className="ibox-content">
                    <ListGroup>
                    {
                        _.map(items, function(item) {
                            var {id, sku, uom, description, planQuantity} = item;
                            return <ListGroupItem
                                        key={id}
                                        active={false} >
                                        <Badge className="text-right">{planQuantity}</Badge>
                                        <div>
                                            <div>{sku} {uom} </div>
                                            <div><small>{description}</small></div>
                                        </div>
                                   </ListGroupItem>;
                        }.bind(this))
                    }
                    </ListGroup>
                </div>
                </IBox>
        );}});






module.exports = TopItems;
