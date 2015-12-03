import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';

import {GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS, PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

import {fieldToDescription} from "./intl";

export class Settings extends Component {

  renderOneProperty({first, last, field, visibleOverview, visibleDetail, acSetFieldVisibility, acSetFieldOrder}) {
    return (
      <Row key={field}>
        <Col xs={1}>
          <div className="checkbox check-primary" >
            <input id={field} type="checkbox" checked={visibleOverview} onChange={() => acSetFieldVisibility(true, field, !visibleOverview)} />
            <label style={{"margin-right": "0px"}} htmlFor={field}></label>
          </div>
        </Col>
        <Col xs={1}>
          <div className="checkbox check-primary" >
            <input id={"detail" + field} name={"detail" + field} type="checkbox" checked={visibleDetail} onChange={() => acSetFieldVisibility(false, field, !visibleDetail)} />
            <label style={{"margin-right": "0px"}} htmlFor={"detail" + field}></label>
          </div>
        </Col>
        <Col xs={5}>
          {fieldToDescription[field]}
        </Col>
        <Col xs={1}>
          {!first && <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFieldOrder(field, -1)}>
            <Icon name="arrow-circle-up"/>
          </Button>}
        </Col>
        <Col xs={1}>
          {!last && <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFieldOrder(field, +1)}>
            <Icon name="arrow-circle-down"/>
          </Button>}
        </Col>
      </Row>
    );
  }


  render() {
    const {visible, onClose, visibleProperties} = this.props;
    const {acSetFieldVisibility, acSetFieldOrder} = this.props;
    const {order} = visibleProperties;
    if (!visible) return null;
    return (
      <Modal
          show={visible}
          onHide={onClose}
          dialogClassName="custom-modal-items">
        <Modal.Header closeButton>
          <Modal.Title>Set Property Display</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Some title</h4>
          {/*id, label, value, onChange, name*/}

          {order.map((field, index) => {
            const visibleOverview = visibleProperties[PROPERTY_VISIBILITY_OVERVIEW][field];
            const visibleDetail = visibleProperties[PROPERTY_VISIBILITY_DETAIL][field];
            const first = index === 0;
            const last = index === order.length - 1;
            return this.renderOneProperty({first, last, field, visibleOverview, visibleDetail, acSetFieldVisibility, acSetFieldOrder})
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
