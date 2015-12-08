import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button, Modal} from 'react-bootstrap';
import Icon from 'react-fa';
import {FieldRenderer} from "../common/FieldRenderer.react.js";
import {SettingsRow} from "../common/SettingsRow.react.js";
import {Settings} from '../common/Settings.react.js';

import {fieldToDescription} from "./intl";

export class Items extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  renderItem(expanded, fieldSettings, itemData) {
    const {orderDetailId} = itemData;
    const {order: fieldsOrder} = fieldSettings;
    const inOverview = (field) => fieldsOrder.indexOf(field) < fieldsOrder.indexOf("-");
    const isVisible = (field) => fieldSettings["visibility"][field] && (expanded || inOverview(field)) ;
    return (
      <div key={orderDetailId}>
        <Row onClick={() => this.props.acExpand((!expanded)? orderDetailId : null)}>
          <Col xs={9}>
            {fieldsOrder.filter((f) => f !== "-").map((field) =>
              (isVisible(field) &&
                <FieldRenderer key={field}
                               description={fieldToDescription[field]}
                               value={itemData[field]} />)
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
    const {items, expanded, groupBy, sortingOrder} = this.props;
    const count = items.length;
    if (count === 0) {
      return <div> Not item in this order</div>;
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
        {items.map((item) =>
          (expanded && item.orderDetailId === expanded)?
            this.renderItem(true, fieldSettings, item)
            :
            this.renderItem(false, fieldSettings, item)
        )}
      </div>
    );
  }
}
