import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';

import {GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS} from './store';

export class Items extends Component {
  renderItem(item) {
    // {"orderId":"2105497471","orderDetailId":"2105497471.1","uom":"EA","itemId":"F2277401","description":"SHU FAUX CILS SMOKY LAYERS SUB","planQuantity":1,"status":"INPROGRESS"},
    const {itemId, orderDetailId, uom, description, planQuantity, status} = item;
    return (
      <div>
        <Row onClick={() => this.props.acExpandItem(orderDetailId)}>
          <Col xs={10}>
            <div key="itemId">{itemId}</div>
            <div key="status-quantity">{status} - planned quantity {planQuantity}</div>
          </Col>
          <Col xs={2}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  rederExpandedItem(item) {
    // {"orderId":"2105497471","orderDetailId":"2105497471.1","uom":"EA","itemId":"F2277401","description":"SHU FAUX CILS SMOKY LAYERS SUB","planQuantity":1,"status":"INPROGRESS"},
    const {itemId, orderDetailId, uom, description, planQuantity, status} = item;
    return (
      <div>
        <Row onClick={() => this.props.acExpandItem(null)}>
          <Col xs={10}>
            <div key="itemId">Item id: {itemId}</div>
            <div key="status-plannedQuantity">Status - {status}</div>
            <div key="planQuantity">Planned quantity {planQuantity}</div>
            <div key="orderDetailId">orderDetailId {orderDetailId}</div>
            <div key="uom">uom - {uom}</div>
            <div key="description">description - {description}</div>
          </Col>
          <Col xs={2}>
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
            this.rederExpandedItem(item)
            :
            this.renderItem(item)
        )}
        {/*JSON.stringify(this.props.items)*/}
      </div>
    );
  }
}