import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {dateFormater} from "../../DateDisplay.react.js";
import {FieldRenderer} from "../common/FieldRenderer.react.js";
import {SettingsRow} from "../common/SettingsRow.react.js";
import {Settings} from '../common/Settings.react.js';

import {PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

import {fieldToDescription} from "./intl";

const fieldFormater = {
    createdAt: dateFormater,
    resolvedAt: dateFormater,
};

export class Picks extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  renderPick(expanded, fieldSettings, pickData) {
    const {persistentId} = pickData;
    const {renderValue, dateFormater} = this;
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
                               value={pickData[field]}
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
    const {picks, expanded} = this.props;
    const count = picks.length;
    if (count === 0) {
      return <div>No history for this order</div>;
    }

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acReloadTab} = this.props;

    return (
      <div>
        <SettingsRow onClickReload={acReloadTab} onClickSettings={acSettingOpen} />
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <hr />
        {picks.map((onePick) =>
          (expanded && onePick.persistentId === expanded)?
            this.renderPick(true, fieldSettings, onePick)
            :
            this.renderPick(false, fieldSettings, onePick)
        )}
      </div>
    );
  }
}
