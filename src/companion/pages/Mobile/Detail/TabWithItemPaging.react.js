import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {dateFormater} from "../DateDisplay.react.js";
import {FieldRenderer} from "./common/FieldRenderer.react.js";
import {SettingsRow} from "./common/SettingsRow.react.js";
import {Settings} from './common/Settings.react.js';

// need fieldToDescription, fieldFormater, getIdFromItem,
export class TabWithItemPaging extends Component {

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  renderItem(expanded, fieldSettings, id, itemData) {
    const {order: fieldsOrder} = fieldSettings;
    const inOverview = (field) => fieldsOrder.indexOf(field) < fieldsOrder.indexOf("-");
    const isVisible = (field) => fieldSettings["visibility"][field] && (expanded || inOverview(field)) ;
    return (
      <div key={id}>
        <Row onClick={() => this.props.acExpand((!expanded)? id : null)}>
          <Col xs={9}>
            {fieldsOrder.filter((f) => f !== "-").map((field) =>
              (isVisible(field) &&
                <FieldRenderer key={field}
                               description={this.props.fieldToDescription[field]}
                               value={itemData[field]}
                               formater={this.props.fieldFormater[field]} />)
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
    const {data: items, expanded, additionalDataLoading} = this.props;
    const {fieldToDescription} = this.props;
    const {getIdFromItem} = this.props;
    const count = items.total;
    if (count === 0) {
      return <div>this.props.noEntriesText</div>;
    }

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acReloadTab, acSearchAdditional} = this.props;
    const {next} = items;
    return (
      <div>
        <SettingsRow onClickReload={acReloadTab} onClickSettings={acSettingOpen}>
        </SettingsRow>
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <hr />
        {items.results.map((oneItem) =>
          this.renderItem(
            (expanded && getIdFromItem(oneItem) === expanded),
            fieldSettings,
            getIdFromItem(oneItem),
            oneItem
          )
        )}
        {additionalDataLoading &&
          <Icon name="spinner " />
        }
        {(next && !additionalDataLoading) &&
            <Button bsStyle="primary" bsSize="xs" onClick={() => acSearchAdditional(next)}>
              <Icon name="long-arrow-right" />
            </Button>
        }
      </div>
    );
  }
}
