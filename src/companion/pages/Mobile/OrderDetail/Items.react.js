import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';

import {GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS} from './store';


const fieldToDescription = {
  "itemId": "Item id",
  "status": "Status",
  "planQuantity": "Plan quantity",
  "uom": "Uom",
  "gtin": "Gtin",
  "preferredLocation": "Preferred location",
  "orderDetailId": "Order detail id",
  "description": "Description",
};

export class Items extends Component {

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

  renderItem({orderDetailId, itemId, status, planQuantity}) {
    const {renderValue, dateFormater} = this;
    return (
      <div key={orderDetailId}>
        <Row onClick={() => this.props.acExpandItem(orderDetailId)}>
          <Col xs={9}>
            {renderValue("itemId", itemId)}
            {renderValue("status", status)}
            {renderValue("planQuantity", planQuantity)}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  renderExpandedItem({orderDetailId, itemId, status, planQuantity, uom, gtin, preferredLocation, description}) {
    const {renderValue, dateFormater} = this;
    return (
      <div key={orderDetailId}>
        <Row onClick={() => this.props.acExpandItem(null)}>
          <Col xs={9}>
            {renderValue("itemId", itemId)}
            {renderValue("status", status)}
            {renderValue("planQuantity", planQuantity)}
            {/* Adtitional fields */}
            {renderValue("uom", uom)}
            {renderValue("gtin", gtin)}
            {renderValue("preferredLocation", preferredLocation)}
            {renderValue("orderDetailId", orderDetailId)}
            {renderValue("description", description)}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-up"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  componentWillUnmount() {
    this.props.acExpandItem(null);
  }

  render() {
    const {items, expandedItem, groupBy, sortingOrder} = this.props;
    const count = items.length;
    if (count === 0) {
      return <div> Not item in this order</div>;
    }

    return (
      <div>
        <hr />
        {items.map((item) =>
          (expandedItem && item.orderDetailId === expandedItem)?
            this.renderExpandedItem(item)
            :
            this.renderItem(item)
        )}
        {/*JSON.stringify(this.props.items)*/}
      </div>
    );
  }
}