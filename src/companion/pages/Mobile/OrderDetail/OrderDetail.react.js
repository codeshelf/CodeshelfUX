import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab} from 'react-bootstrap';

import {getOrderDetail, TAB_DETAIL, TAB_ITEMS, TAB_PICKS} from './store';
import {acSelectTab, acExpandItem} from './store';

import {Items} from "./Items.react.js";
import {Basics} from "./Basics.react.js";


function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpandItem}, dispatch);
}

@connect(getOrderDetail, mapDispatch)
class OrderDetail extends Component {

  orderId = null;

  componentWillMount() {
    const {id: orderId} = this.props.router.getCurrentParams();
    this.orderId = orderId;
    this.props.acSelectTab(TAB_DETAIL, orderId, true);
    console.log("After will mount");
  }


  renderTabs(activeTab) {
    return (
      <Tabs activeKey={activeTab} onSelect={(tab) => this.props.acSelectTab(tab, this.orderId)}>
        <Tab eventKey={TAB_DETAIL} title="Info">Basic info about order</Tab>
        <Tab eventKey={TAB_ITEMS} title="Items">Items for order</Tab>
        <Tab eventKey={TAB_PICKS} title="Picks" disabled>Picks for order</Tab>
      </Tabs>
    );
  }

  render() {
    console.log("OrderDetail render", this.props);
    const {id: orderId} = this.props.router.getCurrentParams();
    const {tab} = this.props;
    const {whatIsLoading, whatIsLoaded, error} = this.props[tab];
    const showLoading = (whatIsLoading !== null || whatIsLoaded === null);
    let contentElement = null;
    if (showLoading) {
      contentElement = <div> Loading ... </div>;
    } else if (tab === TAB_DETAIL) {
      contentElement = <Basics order={this.props[tab].order} />
    } else if (tab === TAB_ITEMS) {
      contentElement = <Items items={this.props[tab].items}
                              expandedItem={this.props[tab].expandedItem}
                              acExpandItem={this.props.acExpandItem}
                              groupBy={this.props[tab].groupBy},
                              sortingOrder={this.props[tab].sortingOrder} />
    }
    return (
      <div>
        <h1>Order Id: {this.orderId}</h1>
        {this.renderTabs(tab)}
        {contentElement}
      </div>
    );
  }
}

export default exposeRouter(OrderDetail);