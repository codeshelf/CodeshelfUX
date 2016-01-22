import React, {Component} from 'react';
import exposeRouter from 'components/common/exposerouter';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {Detail} from "../Detail/Detail.react.js";

import {TAB_DETAIL, TAB_ITEMS, TAB_PICKS, TAB_IMPORTS, ALL_TABS} from './store';
import {acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
    acSettingOpen, acSettingClose, acSetFilter, acSearch} from './store';
import {getOrderDetailMutable} from "./get";

import {Header} from "./Header/Header.react.js";
import {fieldToDescription} from "./Header/intl";
import {Items} from "./Items/Items.react.js";
import {Picks} from "./Picks/Picks.react.js";
import {Imports} from "./Imports/Imports.react.js";
import _ from "lodash";

const tabToComponent = {
  [TAB_DETAIL]: Header,
  [TAB_ITEMS]: Items,
  [TAB_PICKS]: Picks,
  [TAB_IMPORTS]: Imports,
}

const tabToHeaderText = {
  [TAB_DETAIL]: "Order",
  [TAB_ITEMS]: "Lines",
  [TAB_PICKS]: "History",
  [TAB_IMPORTS]: "Imports",
}

class TitleComponent2 extends Component {

  render() {
    const output = this.props.order.map((key) => {
      const value = this.props.values[key];
      return [(<dt key={key}>{key}</dt>),
              (<dd key={key + "-v"}>{value}</dd>)];
    });
    return (
      <dl className={this.props.className}>
        {
            output
        }
      </dl>
    );
  }

}

class TitleCol extends Component {

  render() {
      const {property, value, className} = this.props;
      return (
          <dl className={className}>
            <dt>{property}</dt>
              <dd property={property + "-v"}>
                {value}
              </dd>
          </dl>);
  }
}

class TitleComponent extends Component {

  render() {
    return (
      <Row className={this.props.className}>
        <Col xs={6}>
          {this.props.children[0]}
        </Col>
        <Col xs={6} style={{}}>
          {this.props.children[1]}
        </Col>
      </Row>
    );
  }

}

// is called inide render of Detail component so have access to props
function getTitleComponent(props, itemId) {
  let [leftValue, rightValue] = [itemId, null];
  if (props && props[TAB_DETAIL] && props[TAB_DETAIL].data) {
    const {orderId, status} = props[TAB_DETAIL].data;
    leftValue = orderId;
    rightValue = status;
  }
  return (<TitleComponent className="detail-title">
              <TitleCol property={fieldToDescription.orderId} value={leftValue} />
              <TitleCol property={fieldToDescription.status} value={rightValue} />
          </TitleComponent>);
}

export class OrderDetail extends Component {
  render() {
    return (
      <Detail {...this.props} {...{
        ALL_TABS,
        tabToComponent,
        tabToHeaderText,
        getTitleComponent,
      }} />
    );
  }
}

function mapDispatch(dispatch) {
  return bindActionCreators({acSelectTab, acExpand, acSetFieldVisibility, acSetFieldOrder,
      acSettingOpen, acSettingClose, acSetFilter, acSearch}, dispatch);
}

export default exposeRouter(connect(getOrderDetailMutable, mapDispatch)(OrderDetail));
