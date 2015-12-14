import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';

export class Settings extends Component {

  renderHeader() {
    return (
      <Row>
        <Col xs={1}>
          <Icon name="eye" />
        </Col>
        <Col xs={6}>
          FIELD
        </Col>
        <Col xs={1}>
        </Col>
        <Col xs={1}>
        </Col>
      </Row>);
  }

  renderOneProperty({first, last, field, visible, acSetFieldVisibility, acSetFieldOrder}) {
    return (
      <Row key={field}>
        <Col key="visibility" xs={1}>
          <div className="checkbox check-primary" >
            <input id={field} type="checkbox" checked={visible} onChange={() => acSetFieldVisibility(field, !visible)} />
            <label style={{"margin-right": "0px"}} htmlFor={field}></label>
          </div>
        </Col>
        <Col key="desc" xs={6}>
          {this.props.fieldToDescription[field]}
        </Col>
        <Col key="movedown" xs={1}>
          {!first && <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFieldOrder(field, -1)}>
            <Icon name="arrow-circle-up"/>
          </Button>}
        </Col>
        <Col key="moveup" xs={1}>
          {!last && <Button bsStyle="primary" bsSize="xs" onClick={() => acSetFieldOrder(field, +1)}>
            <Icon name="arrow-circle-down"/>
          </Button>}
        </Col>
      </Row>
    );
  }

  render() {
    const {visible, onClose, fieldSettings} = this.props;
    const {acSetFieldVisibility, acSetFieldOrder} = this.props;
    const {order} = fieldSettings;
    if (!visible) return null;
    return (
      <Modal
          show={visible}
          onHide={onClose}
          dialogClassName="custom-modal-items">
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderHeader()}
          {order.map((field, index) => {
            if (field === "-") {
              return <hr />;
            }
            const visible = fieldSettings["visibility"][field];
            const first = index === 0;
            const last = index === order.length - 1;
            return this.renderOneProperty({first, last, field, visible, acSetFieldVisibility, acSetFieldOrder})
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
