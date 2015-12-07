import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {dateFormater} from "../../DateDisplay.react.js";
import {FieldRenderer} from "../common/FieldRenderer.react.js";
import {Settings} from '../common/Settings.react.js';

import {PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

import {fieldToDescription} from "./intl";

const fieldFormater = {
    received: dateFormater,
    completed: dateFormater,
};

export class Imports extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  renderImport(expanded, fieldSettings, importData) {
    const {persistentId} = importData;
    const  {renderValue, dateFormater} = this;
    const isVisible = (field) => fieldSettings[(expanded)? PROPERTY_VISIBILITY_DETAIL: PROPERTY_VISIBILITY_OVERVIEW][field];
    const {order: fieldsOrder} = fieldSettings;
    return (
      <div key={persistentId}>
        <Row onClick={() => this.props.acExpand((!expanded)? persistentId : null)}>
          <Col xs={9}>
            {fieldsOrder.map((field) =>
              (isVisible(field) &&
                <FieldRenderer key={field}
                               description={fieldToDescription[field]}
                               value={importData[field]}
                               formater={fieldFormater[field]} />)
            )}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" bsSize="xs"><Icon name={expanded? "chevron-circle-up" : "chevron-circle-down"} /></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  render() {
    const {imports, expanded} = this.props;
    const count = imports.length;
    if (count === 0) {
      return <div>No imports for this order</div>;
    }

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acRelaodTab} = this.props;

    return (
      <div>
        <Row>
          <Col xs={2} xsOffset={7}>
            <Button bsStyle="primary" bsSize="xs" onClick={acRelaodTab}><Icon name="refresh" /></Button>
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" bsSize="xs" onClick={acSettingOpen}><Icon name="gears" /></Button>
          </Col>
        </Row>
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <hr />
        {imports.map((oneImport) =>
          (expanded && oneImport.persistentId === expanded)?
            this.renderImport(true, fieldSettings, oneImport)
            :
            this.renderImport(false, fieldSettings, oneImport)
        )}
      </div>
    );
  }
}
