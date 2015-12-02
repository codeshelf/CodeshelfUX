import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {DateDisplay} from "../DateDisplay.react.js";

const fieldToDescription = {
  "createdAt": "Created at",
  "type": "Type",
  "itemId": "Item id",
  "itemLocation": "Item location",
  "wiPlanQuantity": "Plan quantity",
  "wiActualQuantity": "Actual quantity",
  "itemUom": "Item uom",
  "itemDescription": "Item description",
  "workerName": "Worker name",
  "deviceGuid": "Device GUID",
  "persistentId": "Persistent id",
  "orderId": "Order id",
  "devicePersistentId": "Device persistent id",
  "workerId": "Worker id",
  "orderDetailId": "Order detail id",
  "workInstructionId": "Worker instruction Id",
  "resolved": "Resolved",
  "resolvedAt": "Resolved at",
  "resolvedBy": "Resolved by"
}

export class Picks extends Component {
  /* One pick
    {
      "createdAt": 1447714271474,
      "type": "COMPLETE",
      "itemId": "883929463862",
      "itemLocation": "P2001721",
      "wiPlanQuantity": 1,
      "wiActualQuantity": 1,
      "itemUom": "EA",
      "itemDescription": "",
      "workerName": "008, CSLGO ",
      "deviceGuid": "0x0000021d",
      "persistentId": "d3e28f6c-e8d6-4da3-bc76-3c9c74faf100",
      "orderId": "42910564",
      "devicePersistentId": "0a7c4291-c47e-4ac9-9e01-ff1a19f81c04",
      "workerId": "CSLGO008",
      "orderDetailId": "6af21da7-6a3c-4947-87a8-a1a1aa5538af",
      "workInstructionId": "c19de6b5-6531-41bd-80d9-2695b42dd48c",
      "resolved": false,
      "resolvedAt": null,
      "resolvedBy": null
    }
  */

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

  renderPick({persistentId, createdAt, type, itemId}) {
    const {renderValue, dateFormater} = this;
    return (
      <div key={persistentId}>
        <Row onClick={() => this.props.acExpandPick(persistentId)}>
          <Col xs={9}>
            {renderValue("createdAt", createdAt, dateFormater)}
            {renderValue("type", type)}
            {renderValue("itemId", itemId)}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  renderExpandedPick({persistentId, createdAt, type, itemId,
      itemLocation, wiPlanQuantity, wiActualQuantity, itemUom, itemDescription, workerName, deviceGuid}) {
    const {renderValue, dateFormater} = this;
    return (
      <div key={persistentId}>
        <Row onClick={() => this.props.acExpandPick(null)}>
          <Col xs={9}>
            {renderValue("createdAt", createdAt, dateFormater)}
            {renderValue("type", type)}
            {renderValue("itemId", itemId)}
            {/* aditional fields */}
            {renderValue("itemLocation", itemLocation)}
            {renderValue("wiPlanQuantity", wiPlanQuantity)}
            {renderValue("wiActualQuantity", wiActualQuantity)}
            {renderValue("itemUom", itemUom)}
            {renderValue("itemDescription", itemDescription)}
            {renderValue("workerName", workerName)}
            {renderValue("deviceGuid", deviceGuid)}
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
    this.props.acExpandPick(null);
  }

  render() {
    const {picks, expandedPick} = this.props;
    const count = picks.length;
    if (count === 0) {
      return <div>No history for this order</div>;
    }

    return (
      <div>
        <hr />
        {picks.map((onePick) =>
          (expandedPick && onePick.persistentId === expandedPick)?
            this.renderExpandedPick(onePick)
            :
            this.renderPick(onePick)
        )}
        {/*JSON.stringify(this.props.picks)*/}
      </div>
    );
  }
}