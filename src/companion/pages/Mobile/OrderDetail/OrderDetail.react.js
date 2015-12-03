import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col} from 'react-bootstrap';

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS} from './store';
import {acSelectTab, acExpandItem, acExpandImport, acExpandPick, acSetFieldVisibility, acSetFieldOrder} from './store';
import {getOrderDetail} from "./get";

import {Basics} from "./Basics.react.js";
import {Items} from "./Items/Items.react.js";
import {Picks} from "./Picks.react.js";
import {Imports} from "./Imports.react.js";

class OrderDetail extends Component {

  constructor() {
    super();
  }

  orderId = null;

  componentWillMount() {
    const {id: orderId} = this.props.router.getCurrentParams();
    this.orderId = orderId;
    this.props.acSelectTab(TAB_ITEMS, orderId, true);
    console.log("After will mount");
  }


  renderTabs(activeTab) {
    return (
      <Tabs className="nav-tabs-simple" activeKey={activeTab} onSelect={(tab) => this.props.acSelectTab(tab, this.orderId)} tabWidth={1}>
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
      const acSetFieldVisibility = (o, f, v) => this.props.acSetFieldVisibility(TAB_ITEMS, o, f, v);
      const acSetFieldOrder = (f, v) => this.props.acSetFieldOrder(TAB_ITEMS, f, v);
      contentElement = <Items items={this.props[tab].data}
                              settings={this.props[tab].settings}
                              acSetFieldVisibility={acSetFieldVisibility}
                              acSetFieldOrder={acSetFieldOrder}
                              expandedItem={this.props[tab].expandedItem}
                              acExpandItem={this.props.acExpandItem}

                              /*groupBy={this.props[tab].groupBy} NOT USED RIGHT NOW
                              sortingOrder={this.props[tab].sortingOrder}*/ />
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
      <div>
        <Row>
          <Col xs={12}>
            <h1>Order: {this.orderId}</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {this.renderTabs(tab)}
            <div style={{"padding-left": "15px"}}>
              {contentElement}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpandItem, acExpandImport,
      acExpandPick, acSetFieldVisibility, acSetFieldOrder}, dispatch);
}

export default exposeRouter(connect(getOrderDetail, mapDispatch)(OrderDetail));
