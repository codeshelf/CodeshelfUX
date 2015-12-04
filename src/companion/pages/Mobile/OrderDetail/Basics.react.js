import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {DateDisplay} from "../DateDisplay.react.js";

import Icon from 'react-fa';

const propertiesDisplayName = {
 "persistentId": "Persistent Id",
 "orderId": "Order",
 "customerId": "Customer",
 "shipperId": "Shipper",
 "destinationId": "Destination",
 "containerId": "Container",
 "status": "Status",
 "orderLocationAliasIds": "Order location alias id",
 "groupUi": "Group Ui",
 "active": "Active",
 "fullDomainId": "Full Domain Id",
 "wallUi": "Wall Ui",
 "orderType": "Order Type",
 "dueDate": "Due Date",
 "orderDate": "Order Date"
};

// TODO add which properties should be shown
const propertiesToDisplay = [
  "dueDate", "status", "orderDate", "customerId", "containerId", "shipperId",
  "destinationId", "orderLocationAliasIds", "groupUi",
  "wallUi"
];

export class Basics extends Component {

  generalPropertieRender(property, value) {
    if (!value) return null;
    if (typeof value === 'boolean') {
      value = value.toString();
    }
    if (property === "orderDate" || property === "dueDate") {
      value = <DateDisplay date={value} />;
    }
    return (
      <div key={property}>
        <div><small>{propertiesDisplayName[property]}</small></div>
        <h4>{value}</h4>
        <hr />
      </div>
    );
  }

  render() {
    const {order} = this.props;
    return (
      <div>
        <hr />
        {propertiesToDisplay.map((p) => {
          return this.generalPropertieRender(p, order[p]);
        })}
      </div>
    );
  }
}
