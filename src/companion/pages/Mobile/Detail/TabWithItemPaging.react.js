import React, {Component} from 'react';

import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {FieldRenderer} from "./common/FieldRenderer.react.js";
import {SettingsRow} from "./common/SettingsRow.react.js";
import {Settings} from './common/Settings.react.js';

import moment from "moment";

// need fieldToDescription, fieldFormater, getIdFromItem,
export class TabWithItemPaging extends Component {

  constructor() {
    super()
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onReload = this.onReload.bind(this);
  }

  componentWillMount() {
    if (this.props.filter === null) {
      this.props.acSetFilter(moment().format("YYYY/MM/DD HH:mm"));
    }
  }

  componentWillUnmount() {
    if (this.props.expanded) {
      this.props.acExpand(null);
    }
  }

  onChangeFilter(e) {
    this.props.acSetFilter(e.target.value);
  }

  renderItem(expanded, fieldSettings, id, itemData) {
    const {order: fieldsOrder} = fieldSettings;
    const inOverview = (field) => fieldsOrder.indexOf(field) < fieldsOrder.indexOf("-");
    const isVisible = (field) => fieldSettings["visibility"][field] && (expanded || inOverview(field)) ;
    return (
      <div key={id}>
        <Row onClick={() => this.props.acExpand((!expanded)? id : null)}>
          <Col xs={9}>
            {fieldsOrder.filter((f) => f !== "-").map((field) => {
              if (field.indexOf("+") === -1) {
                // normal field
                return (isVisible(field) &&
                  <FieldRenderer key={field}
                               description={this.props.fieldToDescription[field]}
                               value={itemData[field]}
                               formater={this.props.fieldFormater[field]} />
                );
              } else {
                // multi field
                const formater = this.props.fieldFormater[field];
                if (!formater) throw "Missing formater for multifield" + field;
                const values = {};
                 field.split("+").forEach((oneField) => values[oneField] = itemData[oneField]);
                return isVisible(field) && formater(values);
              }
            })}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" bsSize="xs"><Icon name={expanded? "chevron-circle-up" : "chevron-circle-down"} /></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  onReload() {
    this.props.acSetFilter(moment().format("YYYY/MM/DD HH:MM"));
    this.props.acReloadTab();
  }

  render() {
    const {data: items, expanded, additionalDataLoading, filter} = this.props;
    const {fieldToDescription} = this.props;
    const {getIdFromItem} = this.props;
    const count = items.total;
    if (count === 0) {
      return <div>{this.props.noEntriesText}</div>;
    }

    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acReloadTab, acSearchAdditional, acSearchFilter} = this.props;
    const {next} = items;
    return (
      <div>
        <SettingsRow onClickReload={this.onReload} onClickSettings={acSettingOpen}>
        </SettingsRow>
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        <input type="text" value={filter} onChange={this.onChangeFilter}/>
        <Button bsStyle="primary" bsSize="xs" onClick={() => acSearchFilter(filter)}>
          <Icon name="search" />
        </Button>
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
