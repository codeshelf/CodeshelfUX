import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {Link} from '../../links';

import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithOneItem} from "../../Detail/TabWithOneItem.react.js";
import {getWorkerDetailMutable} from '../get.js';

import {HistogramChart} from '../../WorkerPickCharts/HistogramChart.react.js';
import {TopChart} from '../../WorkerPickCharts/TopChart.react.js';
import {DurationPicker} from '../../WorkerPickCharts/TopChart.react.js';
import {SettingsRow} from "../../Detail/common/SettingsRow.react.js";
import {Settings} from '../../Detail/common/Settings.react.js';
import {renderField, deviceFormatter} from "../../Detail/common/FieldRenderer.react.js";

import {fieldToDescription} from "../../common/historyItemIntl";
import {acMoveGraphToLeft, acMoveGraphToRight} from '../store';
import moment from "moment";
import Icon from 'react-fa';


function orderIdComponent(orderId) {
  if (!orderId) return orderId;
  return (
    <Link to="mobile-order-datail-default" params={{id: orderId}}>
      {orderId}
    </Link>
  );
}

const fieldFormater = {
    createdAt: datetimeToSecondsFormater,
    orderId: orderIdComponent,
    'deviceName+deviceGuid': deviceFormatter,  
};

function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No history for this worker";

export class ProductivityDump extends Component {

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
        <Row onClick={() => this.props.acExpand((!expanded)? id : null)}>
          <Col xs={9}>
            {fieldsOrder.filter((f) => f !== "-").map((field) => {
              if (isVisible(field)) {
                return renderField(field, itemData, fieldToDescription, fieldFormater);
              } else {
                return null;
              }
            })}
          </Col>
          <Col xs={3}>
            <Button bsStyle="primary" bsSize="xs"><Icon name={expanded ? "chevron-circle-up" : "chevron-circle-down"} /></Button>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  render() {
    const {data: {events, histogram}, expanded, additionalDataLoading, filter, id} = this.props;
    if (filter === null) return null;
    const count = events.total;
    const {settings: {open: settingOpen, properties: fieldSettings}} = this.props;
    const {acSettingOpen, acSettingClose, acSetFieldVisibility,
     acSetFieldOrder, acReloadTab, acSearchAdditional, acSearch} = this.props;
    const {next} = events;
    return (
      <div>
        <TopChart {...this.props}
          data={histogram}
          title={"Worker Picks"}
        />
        <Button bsStyle="primary" bsSize="xs" onClick={acSettingOpen}><Icon name="gears" /></Button>
        <Settings title="Set field visibility"
                  visible={settingOpen}
                  onClose={acSettingClose}
                  {...{fieldToDescription,
                    fieldSettings,
                    acSetFieldVisibility,
                    acSetFieldOrder}} />
        { count === 0
          ? <div>{noEntriesText}</div>
          : <div>
              <hr />
              {events.results.map((oneItem) =>
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
                  <Button bsStyle="primary" bsSize="xs" onClick={() => acSearchAdditional({id, next})}>
                    <Icon name="long-arrow-right" />
                  </Button>
              }
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatch(dispatch) {
  return bindActionCreators({acMoveGraphToLeft, acMoveGraphToRight}, dispatch);
}

export const Productivity = connect(mapStateToProps, mapDispatch)(ProductivityDump);
