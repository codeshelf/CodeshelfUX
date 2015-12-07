import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {DateDisplay} from "../../DateDisplay.react.js";
import Icon from 'react-fa';
import {SettingsRow} from "../common/SettingsRow.react.js";
import {Settings} from '../common/Settings.react.js';

import {PROPERTY_VISIBILITY_OVERVIEW, PROPERTY_VISIBILITY_DETAIL} from '../store';

import {fieldToDescription} from "./intl";

// TODO add which properties should be shown
const propertiesToDisplay = [
  "dueDate", "status", "orderDate", "customerId", "containerId", "shipperId",
  "destinationId", "orderLocationAliasIds", "groupUi",
  "wallUi"
];

export class Header extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  generalPropertieRender(property, value) {
    if (typeof value === 'boolean') {
      value = value.toString();
    }
    if (property === "orderDate" || property === "dueDate") {
      value = <DateDisplay date={value} />;
    }
    return (
      <div key={property}>
        <div><small>{fieldToDescription[property]}</small></div>
        <h4>{value}</h4>
        <hr />
      </div>
    );
  }

  render() {
    const {order, expanded} = this.props;

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acExpand, acReloadTab} = this.props;

  const {order: fieldsOrder} = fieldSettings;
    const isVisible = (field) => fieldSettings[PROPERTY_VISIBILITY_OVERVIEW][field];
    return (
      <div>
        <SettingsRow onClickReload={acReloadTab} onClickSettings={acSettingOpen} />
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  showDetailCheckbox={false}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <hr />
        {fieldsOrder.map((field) =>
          (isVisible(field) &&
            this.generalPropertieRender(field, order[field]))
        )}
        <Row>
          <Button onClick={() => acExpand((!expanded)? true : null)}>
             Aditional fields
             {"  "}
             <Icon name={expanded? "chevron-circle-up" : "chevron-circle-down"} />
          </Button>
        </Row>
        {expanded && fieldsOrder.map((field) =>
            (!isVisible(field) &&
              this.generalPropertieRender(field, order[field]))
        )}
      </div>
    );
  }
}
