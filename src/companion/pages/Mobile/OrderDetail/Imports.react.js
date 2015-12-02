import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {DateDisplay} from "../DateDisplay.react.js";

const fieldToDescription = {
  completed: "Completed",
  domainId: "Domain id",
  filename: "Filename",
  gtins: "Gtitns",
  itemIds: "Items ids",
  linesFailed: "Lines failed",
  linesProcessed: "Lines processed",
  orderIds: "Orders ids",
  ordersProcessed: "Orders Processed",
  persistentId: "Persistent id",
  received: "Recived",
  status: "Status",
  transportType: "Transport type",
  username: "Username",
}

export class Imports extends Component {
  /* One import
    {
      completed: 1447943430477
      domainId: "Import-Thu Nov 19 14:30:30 UTC 2015"
      filename: "ordersOnePerDay.csv"
      gtins: null
      itemIds: "CUL-CS-16,CUL-CS-10,CUL-CS-12,CUL-CS-6"
      linesFailed: 0
      linesProcessed: 8
      orderIds: "444444,22222,555555,33333,11111"
      ordersProcessed: 5
      persistentId: "1c434091-3f0e-4c16-aed7-4715177b9a69"
      received: 1447943430225
      status: "Completed"
      transportType: "APP"
      username: "mfedak@gmail.com"
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

  renderImport({persistentId, filename, status, received, completed}) {
    const  {renderValue, dateFormater} = this;
    return (
      <div key={persistentId}>
        <Row onClick={() => this.props.acExpandImport(persistentId)}>
          <Col xs={9}>
            {renderValue("received", received, dateFormater)}
            {renderValue("filename", filename)}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  renderExpandedImport({persistentId, filename, status, received, completed,
      domainId, gtins, itemIds, orderIds, linesFailed, linesProcessed, ordersProcessed,
      transportType, username}) {
    const  {renderValue, dateFormater} = this;
    return (
      <div key={persistentId}>
        <Row onClick={() => this.props.acExpandImport(null)}>
          <Col xs={9}>
            {renderValue("received", received, dateFormater)}
            {renderValue("filename", filename)}
            {/* aditional fields */}
            {/*renderValue("completed", completed, dateFormater)*/}
            {/*renderValue("domainId", domainId)*/}
            {/*renderValue("gtins", gtins)*/}
            {/*renderValue("orderIds", orderIds)*/}
            {/*renderValue("itemIds", itemIds)*/}
            {renderValue("status", status)}
            {renderValue("linesProcessed", linesProcessed)}
            {renderValue("linesFailed", linesFailed)}
            {renderValue("ordersProcessed", ordersProcessed)}
            {renderValue("transportType", transportType)}
            {renderValue("username", username)}
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
    this.props.acExpandImport(null);
  }

  render() {
    const {imports, expandedImport} = this.props;
    const count = imports.length;
    if (count === 0) {
      return <div>No imports for this order</div>;
    }

    return (
      <div>
        <hr />
        {imports.map((oneImport) =>
          (expandedImport && oneImport.persistentId === expandedImport)?
            this.renderExpandedImport(oneImport)
            :
            this.renderImport(oneImport)
        )}
        {/*JSON.stringify(this.props.items)*/}
      </div>
    );
  }
}