import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {DateDisplay} from "../DateDisplay.react.js";

export class Picks extends Component {
  /* One pick
    {
      "completed": 1448899968039,
      "status": "COMPLETE",
      "itemMasterId": "930-00020",
      //-------------------------------------------------------------
      "pickInstructionUi": "L18",
      "pickerName": "K3WAMQ6ZUINX",
      "assignedCheName": "Lunera 2",
      "planQuantity": 1,
      "actualQuantity": 1,
      "description": "HN-V-G24D-26W-4000-G2",
      //---- fields not shown in first iteration --------------------
    };
  */

  renderPick({persistentId, completed, status, itemMasterId}) {
    return (
      <div>
        <Row onClick={() => this.props.acExpandPick(persistentId)}>
          <Col xs={10}>
            <div key="status">{status}</div>
            <div key="itemMasterId">itemMasterId: {itemMasterId}</div>
            <div key="completed">completed: <DateDisplay date={completed} /></div>
          </Col>
          <Col xs={2}>
            <Button bsStyle="primary" ><Icon name="chevron-circle-down"/></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  renderExpandedPick({persistentId, completed, status, itemMasterId,
      pickInstructionUi, pickerName, assignedCheName, planQuantity, actualQuantity,
      description}) {
    return (
      <div>
        <Row onClick={() => this.props.acExpandPick(null)}>
          <Col xs={10}>
            <div key="status">{status}</div>
            <div key="itemMasterId">itemMasterId: {itemMasterId}</div>
            <div key="completed">completed: <DateDisplay date={completed} /></div>
            {/* aditional fields */}
            <div key="pickInstructionUi">pickInstructionUi: {pickInstructionUi}</div>
            <div key="pickerName">pickerName: {pickerName}</div>
            <div key="assignedCheName">assignedCheName: {assignedCheName}</div>
            <div key="planQuantity">planQuantity: {planQuantity}</div>
            <div key="actualQuantity">actualQuantity: {actualQuantity}</div>
            <div key="description">description: {description}</div>
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