import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';

import {PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

export class Settings extends Component {
  static defaultProps = {
    showDetailCheckbox: true,
  }

  renderHeader(showDetailCheckbox) {
    return (
      <Row>
        <Col xs={1}>
          <Icon name="minus" />
        </Col>
        <Col xs={1}>
          {showDetailCheckbox &&
              <Icon name="reorder" />
          }
        </Col>
        <Col xs={5}>
          FIELD
        </Col>
        <Col xs={1}>
        </Col>
        <Col xs={1}>
        </Col>
      </Row>);
  }

  renderOneProperty(showDetailCheckbox, {first, last, field, visibleOverview, visibleDetail, acSetFieldVisibility, acSetFieldOrder}) {
    return (
      <Row key={field}>
        <Col xs={1}>
          <div className="checkbox check-primary" >
            <input id={field} type="checkbox" checked={visibleOverview} onChange={() => acSetFieldVisibility(true, field, !visibleOverview)} />
            <label style={{"margin-right": "0px"}} htmlFor={field}></label>
          </div>
        </Col>
        <Col xs={1}>
          {showDetailCheckbox &&
            <div className="checkbox check-primary" >
              <input id={"detail" + field} name={"detail" + field} type="checkbox" checked={visibleDetail} onChange={() => acSetFieldVisibility(false, field, !visibleDetail)} />
              <label style={{"margin-right": "0px"}} htmlFor={"detail" + field}></label>
            </div>
          }
        </Col>
        <Col xs={5}>
          {this.props.fieldToDescription[field]}
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
    const {visible, onClose, fieldSettings, showDetailCheckbox} = this.props;
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
          {this.renderHeader(showDetailCheckbox)}
          {order.map((field, index) => {
            const visibleOverview = fieldSettings[PROPERTY_VISIBILITY_OVERVIEW][field];
            const visibleDetail = fieldSettings[PROPERTY_VISIBILITY_DETAIL] && fieldSettings[PROPERTY_VISIBILITY_DETAIL][field];
            const first = index === 0;
            const last = index === order.length - 1;
            return this.renderOneProperty(showDetailCheckbox, {first, last, field, visibleOverview, visibleDetail, acSetFieldVisibility, acSetFieldOrder})
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
