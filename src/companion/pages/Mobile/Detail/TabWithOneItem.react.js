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
    return (
      <div key={property}>
        <div><small>{this.props.fieldToDescription[property]}</small></div>
        <h4>{!renderer? (!value? value : value.toString()) : renderer(value)}</h4>
        <hr />
      </div>
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
        {fieldsOrder.map((field) =>
          (isVisibleOverview(field) &&
            this.generalPropertieRender(field, item[field]))
        )}
        <Row>
          <Button onClick={() => acExpand((!expanded)? true : null)}>
             Additional fields
             {"  "}
             <Icon name={expanded? "chevron-circle-up" : "chevron-circle-down"} />
          </Button>
        </Row>
        {expanded && fieldsOrder.map((field) =>
            (isVisibleDetail(field) &&
              this.generalPropertieRender(field, item[field]))
        )}
      </div>
    );
  }
}
