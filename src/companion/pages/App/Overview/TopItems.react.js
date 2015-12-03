var React = require('react');
var _ = require('lodash');
var $ = require('jquery');
var Rx = require('rx');

import csapi from 'data/csapi';
var {StatusSummary} = require('data/types');
var el = React.createElement;

import ibox from 'components/common/IBox';
import SummaryList from 'components/common/SummaryList';
var IBox = ibox.IBox;
var IBoxData = ibox.IBoxData;
var IBoxTitleBar = ibox.IBoxTitleBar;
var IBoxTitleText = ibox.IBoxTitleText;
var IBoxSection = ibox.IBoxSection;

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
        var summaryList = _.map(items, (item) => {
            let summary = {
                id: item.id,
                label: `${item.sku} ${item.uom}`,
                description: item.description,
                quantity: item.planQuantity
            };
            return summary;
        });
        return (

                <IBox>
                    <IBoxTitleBar>
                        <IBoxTitleText>
                            Top {items.length} Items
                        </IBoxTitleText>
                    </IBoxTitleBar>
                    <div className="ibox-content">
                    <SummaryList list={summaryList} />
                </div>
                </IBox>
        );}});






module.exports = TopItems;
