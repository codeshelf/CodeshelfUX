import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {DateDisplay} from "../DateDisplay.react.js";

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

  renderImport({persistentId, filename, status, received, completed}) {
    return (
      <div>
        <Row onClick={() => this.props.acExpandImport(persistentId)}>
          <Col xs={10}>
            <div key="filename">{filename}</div>
            <div key="status">{status}</div>
            <div key="received">Recived: <DateDisplay date={received} /></div>
            <div key="completed">Completed: <DateDisplay date={completed} /></div>
          </Col>
          <Col xs={2}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  renderExpandedImport({persistentId, filename, status, received, completed,
      domainId, gtins, itemIds, linesFailed, linesProcessed, ordersProcessed,
      transportType, username}) {
    return (
      <div>
        <Row onClick={() => this.props.acExpandImport(null)}>
          <Col xs={10}>
            <div key="filename">{filename}</div>
            <div key="status">{status}</div>
            <div key="received">Recived: <DateDisplay date={received} /></div>
            <div key="completed">Completed: <DateDisplay date={completed} /></div>
            {/* aditional fields */}
            <div key="domainId">domainId: {domainId}</div>
            <div key="gtins">gtins: {gtins}</div>
            <div key="itemIds">itemIds: {itemIds}</div>
            <div key="linesFailed">linesFailed: {linesFailed}</div>
            <div key="linesProcessed">linesProcessed: {linesProcessed}</div>
            <div key="ordersProcessed">ordersProcessed: {ordersProcessed}</div>
            <div key="transportType">transportType: {transportType}</div>
            <div key="username">username: {username}</div>
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