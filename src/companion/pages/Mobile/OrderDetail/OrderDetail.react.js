import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row} from 'react-bootstrap';

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS} from './store';
import {acSelectTab, acExpandItem, acExpandImport, acExpandPick} from './store';
import {getOrderDetail} from "./get";

import {Basics} from "./Basics.react.js";
import {Items} from "./Items.react.js";
import {Picks} from "./Picks.react.js";
import {Imports} from "./Imports.react.js";


function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpandItem, acExpandImport, acExpandPick}, dispatch);
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
      <Tabs activeKey={activeTab} onSelect={(tab) => this.props.acSelectTab(tab, this.orderId)} tabWidth={12}>
        <Tab eventKey={TAB_DETAIL} title="HDR">Basic info about order</Tab>
        <Tab eventKey={TAB_ITEMS} title="Lines">Lines for order</Tab>
        <Tab eventKey={TAB_PICKS} title="History">History for order</Tab>
        <Tab eventKey={TAB_IMPORTS} title="Imports">Imports for order</Tab>
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
      contentElement = <Basics order={this.props[tab].data} />
    } else if (tab === TAB_ITEMS) {
      contentElement = <Items items={this.props[tab].data}
                              expandedItem={this.props[tab].expandedItem}
                              acExpandItem={this.props.acExpandItem}
                              groupBy={this.props[tab].groupBy}
                              sortingOrder={this.props[tab].sortingOrder} />
    } else if (tab === TAB_IMPORTS) {
      contentElement = <Imports imports={this.props[tab].data}
                              expandedImport={this.props[tab].expandedImport}
                              acExpandImport={this.props.acExpandImport} />
    } else if (tab === TAB_PICKS) {
      contentElement = <Picks picks={this.props[tab].data}
                              expandedPick={this.props[tab].expandedPick}
                              acExpandPick={this.props.acExpandPick} />
    }
    return (
      <Row>
        <h1>Order Id: {this.orderId}</h1>
        {this.renderTabs(tab)}
        <div style={{"padding-left": "15px"}}>
          {contentElement}
        </div>
      </Row>
    );
  }
}

export default exposeRouter(OrderDetail);