import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col} from 'react-bootstrap';

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose} from './store';
import {getOrderDetail} from "./get";

import {Header} from "./Header/Header.react.js";
import {Items} from "./Items/Items.react.js";
import {Picks} from "./Picks/Picks.react.js";
import {Imports} from "./Imports/Imports.react.js";

class OrderDetail extends Component {

  constructor() {
    super();
  }

  orderId = null;

  componentWillMount() {
    const {id: orderId} = this.props.router.getCurrentParams();
    this.orderId = orderId;
    this.props.acSelectTab(TAB_DETAIL, orderId, true);
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
    } else {
      const {[tab]: {settings, expanded}} = this.props;
      // creacte closures over action creators for selected tab
      const acSettingOpen = () => this.props.acSettingOpen(tab);
      const acSettingClose = () => this.props.acSettingClose(tab);
      const acSetFieldVisibility = (o, f, v) => this.props.acSetFieldVisibility(tab, o, f, v);
      const acSetFieldOrder = (f, v) => this.props.acSetFieldOrder(tab, f, v);
      const acExpand = (i) => this.props.acExpand(tab, i);
      const commonProps = {
        expanded,
        acExpand,
        settings,
        acSetFieldVisibility,
        acSetFieldOrder,
        acSettingOpen,
        acSettingClose,
      };
      if (tab === TAB_DETAIL) {
        contentElement = <Header order={this.props[tab].data}
                                 {...commonProps} />
      } else if (tab === TAB_ITEMS) {
        contentElement = <Items items={this.props[tab].data}
                                {...commonProps} />
      } else if (tab === TAB_IMPORTS) {
        contentElement = <Imports imports={this.props[tab].data}
                                  {...commonProps} />
      } else if (tab === TAB_PICKS) {
        contentElement = <Picks picks={this.props[tab].data}
                                {...commonProps} />
     }
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
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
      acSettingOpen, acSettingClose}, dispatch);
}

export default exposeRouter(connect(getOrderDetail, mapDispatch)(OrderDetail));
