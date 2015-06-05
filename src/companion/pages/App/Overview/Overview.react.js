import React from 'react';
import DocumentTitle from 'react-document-title';
import {PageGrid, Row, Col} from 'components/common/pagelayout';
import {IBox, IBoxBody, IBoxTitleBar, IBoxTitleText} from "components/common/IBox";
import _ from 'lodash';
import  {getFacilityContext} from 'data/csapi';
import StatusSummaryIBox from "./StatusSummaryIBox";
import OrderList from "./OrderList";
import TopItems from "./TopItems";

var el = React.createElement;

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
                /*{
                    totalLabel: "Lines",
                    totalLabelSingular: "Line",
                    filterName: filterOptions[0],
                    aggregate: "OrderDetail"
                },*/
                {
                    totalLabel: "Each Picks",
                    totalLabelSingular: "Each Pick",
                    filterName: filterOptions[0],
                    aggregate: "Each"
                },/*
                {
                    totalLabel: "Cases",
                    totalLabelSingular: "Case",
                    filterName: filterOptions[0],
                    aggregate: "Case"
                }*/
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
        var status = "RELEASED";
        return ( <DocumentTitle title="Overview">
                   <PageGrid>
                       <Row>
                       {
                           _.map(views, function(view){
                               var stateKey = view["filterName"] + view["aggregate"];
                               return (<Col sm={6} md={4} key={stateKey}>
                                         <StatusSummaryIBox apiContext={apiContext} view={view} filterOptions={filterOptions}/>
                                       </Col>);
                           }.bind(this))
                       }
                       <Col key="topItems" sm={6} md={4}>
                           <TopItems  apiContext={apiContext} />
                       </Col>
                       </Row>
                        <Row>
                            <Col key="topItems" sm={12}>
                                <IBox>
                                    <IBoxTitleBar>
                                        <IBoxTitleText>Orders List</IBoxTitleText>
                                    </IBoxTitleBar>
                                    <IBoxBody>
                                        <OrderList status={status}/>
                                    </IBoxBody>
                                </IBox>
                            </Col>
                        </Row>
                   </PageGrid>
                 </DocumentTitle>);
    }
});

module.exports = OverviewPage;
