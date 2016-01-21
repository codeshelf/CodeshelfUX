import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {DateDisplay} from "../DateDisplay.react.js";
import Icon from 'react-fa';
import {SettingsRow} from "./common/SettingsRow.react.js";
import {Settings} from './common/Settings.react.js';

export class TabWithOneItem extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  generalPropertieRender(property, value) {
    const renderer = this.props.fieldFormater[property];
    const label = this.props.fieldToDescription[property];
    const stringValue = (value) ? value.toString() : value;
    const renderedValue = (!renderer ) ? stringValue :  renderer(value);
    return (
      [
        (<dt key={label}>{label}</dt>),
        (<dd key={label + "-v"}>{renderedValue}</dd>)
      ]
    );
  }

  render() {
    const {data: item, expanded, fieldToDescription} = this.props;

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acExpand, acReloadTab} = this.props;

    const {order: fieldsOrder} = fieldSettings;
    const inOverview = (field) => fieldsOrder.indexOf(field) < fieldsOrder.indexOf("-");
    const isVisibleOverview = (field) => fieldSettings["visibility"][field] && (inOverview(field)) ;
    const isVisibleDetail = (field) => fieldSettings["visibility"][field] && field !== "-" && (!inOverview(field)) ;
    const isVisible = (field) => isVisibleOverview(field) || isVisibleDetail(field);
    return (
      //TODO same structure as TabWithItemList
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
            <hr />
            <dl>
              {fieldsOrder.map((field) =>
               (isVisible(field) &&
               this.generalPropertieRender(field, item[field]))
              )}
            </dl>
          </Col>
        </Row>
      </div>
    );
  }
}
