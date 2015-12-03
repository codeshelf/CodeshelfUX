import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';

import {GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS, PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

import {Settings} from './Settings.react.js';
import {fieldToDescription} from "./intl";

export class Items extends Component {

  constructor() {
    super();
  }

  state = {
    modalOpen: false
  };
  openModal() {
    this.setState({modalOpen: true});
  }
  closeModal() {
    this.setState({modalOpen: false});
  }

  dateFormater(date) {
    return <DateDisplay date={date} />;
  }

  renderValue(key, val, formater) {
    return (
      <div key={key}>
        {fieldToDescription[key]} - {!formater? val : formater(val)}
      </div>
    );
  }


  renderItem(expanded, fieldsOrder, itemData) {
    const {orderDetailId} = itemData;
    const {renderValue, dateFormater} = this;
    const visibleField = this.getVisibleProperties();
    const isVisible = (field) => visibleField[(expanded)? PROPERTY_VISIBILITY_DETAIL: PROPERTY_VISIBILITY_OVERVIEW][field];
    return (
      <div key={orderDetailId}>
        <Row onClick={() => this.props.acExpandItem((!expanded)? orderDetailId : null)}>
          <Col xs={9}>
            {fieldsOrder.map((field) =>
              isVisible(field) && renderValue(field, itemData[field])
            )}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" ><Icon name={expanded? "chevron-circle-up" : "chevron-circle-down"} /></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  componentWillUnmount() {
    this.props.acExpandItem(null);
  }

  getVisibleProperties() {
    const {settings: {properties: visibleProperties}} = this.props;
    return visibleProperties;
  }

  render() {
    const {items, expandedItem, groupBy, sortingOrder} = this.props;
    const count = items.length;
    if (count === 0) {
      return <div> Not item in this order</div>;
    }
    const fieldsOrder = this.getVisibleProperties()["order"];
    return (
      <div>
        <Button onClick={() => this.openModal()}>Setting</Button>
        <Settings visible={this.state.modalOpen} onClose={() => this.closeModal()}
            acSetFieldVisibility={this.props.acSetFieldVisibility}
            acSetFieldOrder={this.props.acSetFieldOrder}
            visibleProperties={this.getVisibleProperties()} />
        <hr />
        {items.map((item) =>
          (expandedItem && item.orderDetailId === expandedItem)?
            this.renderItem(true, fieldsOrder, item)
            :
            this.renderItem(false, fieldsOrder, item)
        )}
        {/*JSON.stringify(this.props.items)*/}
      </div>
    );
  }
}