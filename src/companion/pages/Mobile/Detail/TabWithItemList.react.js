import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {renderField} from "./common/FieldRenderer.react.js";
import {SettingsRow} from "./common/SettingsRow.react.js";

import {Settings} from './common/Settings.react.js';

// need fieldToDescription, fieldFormater, getIdFromItem,
export class TabWithItemList extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  renderItem(expanded, fieldSettings, id, itemData) {
    const {order: fieldsOrder} = fieldSettings;
    const inOverview = (field) => fieldsOrder.indexOf(field) < fieldsOrder.indexOf("-");
    const isVisible = (field) => fieldSettings["visibility"][field] && (expanded || inOverview(field));
    return (
      <div key={id}>
        <hr style={{marginTop: "0.5em", marginBottom: "0.5em"}}/>
        <Row onClick={() => this.props.acExpand((!expanded)? id : null)}>
          <Col xs={9}>
            <dl className="inline">
            {fieldsOrder.filter((f) => f !== "-").map((field) => {
              if (field.indexOf("+") === -1) {
                // normal field
                return (isVisible(field) &&
                    renderField(this.props.fieldToDescription[field], itemData[field], this.props.fieldFormater[field]));
              } else {
                // multi field
                const formater = this.props.fieldFormater[field];
                if (!formater) throw "Missing formater for multifield" + field;
                const values = {};
                 field.split("+").forEach((oneField) => values[oneField] = itemData[oneField]);
                return isVisible(field) &&
                renderField(this.props.fieldToDescription[field], values, formater);
              }
            })}
            </dl>
          </Col>
          <Col xs={3} >
            <Icon className="pull-right" name={expanded? "chevron-up" : "chevron-down"}/>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const {data: items, expanded} = this.props;
    const {fieldToDescription} = this.props;
    const {getIdFromItem} = this.props;
    const count = items.length;

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acReloadTab} = this.props;

    return (
      //TODO same structure as TabWithOneItem
      <div>
        <SettingsRow onClickReload={acReloadTab} onClickSettings={acSettingOpen} />
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <Row>
          <Col xs={12} style={{paddingLeft: "0px"}}>
          { count === 0
            ? this.props.children
            :
              items.map((oneItem) =>
                this.renderItem(
                  (expanded && getIdFromItem(oneItem) === expanded),
                  fieldSettings,
                  getIdFromItem(oneItem),
                  oneItem
                )
              )
          }
          </Col>
        </Row>
      </div>
    );
  }
}
