import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';
import {Checkbox} from 'components/common/Form';

import {GROUP_ITEMS_WORKER, GROUP_ITEMS_TIMESTAMS, GROUP_ITEMS_STATUS, PROPERTY_VISIBILITY_OVERVIEW} from './store';


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

  state = {
    modalOpen: false
  };
  openModal() {
    this.setState({modalOpen: true});
  }
  closeModal() {
    this.setState({modalOpen: false});
  }

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

  renderItem({orderDetailId, itemId, status, planQuantity, uom, gtin, preferredLocation, description}) {
    const {renderValue, dateFormater} = this;
    const visibleField = this.getVisibleProperties();
    const isVisible = (field) => visibleField.indexOf(field) !== -1;
    return (
      <div key={orderDetailId}>
        <Row onClick={() => this.props.acExpandItem(orderDetailId)}>
          <Col xs={9}>
            {isVisible("itemId") && renderValue("itemId", itemId)}
            {isVisible("status") && renderValue("status", status)}
            {isVisible("planQuantity") && renderValue("planQuantity", planQuantity)}
            {/* Adtitional fields */}
            {isVisible("uom") && renderValue("uom", uom)}
            {isVisible("gtin") && renderValue("gtin", gtin)}
            {isVisible("preferredLocation") && renderValue("preferredLocation", preferredLocation)}
            {isVisible("orderDetailId") && renderValue("orderDetailId", orderDetailId)}
            {isVisible("description") && renderValue("description", description)}
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

  renderModal() {
    const {acSetFieldVisibility} = this.props;
    const visibleProperties = this.getVisibleProperties();
    const isVisible = (propertie) => visibleProperties.indexOf(propertie) !== -1;
    return (
      <Modal
          show={this.state.modalOpen}
          onHide={() => this.closeModal()}
          dialogClassName="custom-modal-items">
        <Modal.Header closeButton>
          <Modal.Title>Setting of visibility of properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Some title</h4>
          {/*id, label, value, onChange, name*/}

          {Object.keys(fieldToDescription).map((field) => {
            const visible = isVisible(field);
            return (
             <Checkbox name={field} label={fieldToDescription[field]} value={visible} onChange={() => acSetFieldVisibility(true, field, !visible)} />
            )
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.closeModal()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  getVisibleProperties() {
    const {settings: {properties: {[PROPERTY_VISIBILITY_OVERVIEW]: visibleProperties}}} = this.props;
    return visibleProperties;
  }

  render() {
    const {items, expandedItem, groupBy, sortingOrder} = this.props;
    const count = items.length;
    if (count === 0) {
      return <div> Not item in this order</div>;
    }

    return (
      <div>
        <Button onClick={() => this.openModal()}>Setting</Button>
        {this.renderModal()}
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