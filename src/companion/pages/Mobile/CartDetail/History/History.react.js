import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {Link} from '../../links';

import {datetimeToSecondsFormater} from "../../DateDisplay.react.js";
import {TabWithItemList} from "../../Detail/TabWithItemList.react.js";

import {TopChart} from '../../WorkerPickCharts/TopChart.react.js';
import {SettingsRow} from "../../Detail/common/SettingsRow.react.js";
import {Settings} from '../../Detail/common/Settings.react.js';
import {renderField, deviceFormatter, orderLinkFormatter} from "../../Detail/common/FieldRenderer.react.js";

import {fieldToDescription} from "../../common/historyItemIntl";
import {acMoveGraphToLeft, acMoveGraphToRight} from '../store';
import moment from "moment";
import Icon from 'react-fa';

const fieldFormater = {
    createdAt: datetimeToSecondsFormater,
    orderId: orderLinkFormatter,
    "deviceName+deviceGuid": deviceFormatter
};

function getIdFromItem(data) {
  return data.persistentId;
};

const noEntriesText = "No history for this cart";

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
    //consume acReloadTab so that the list does not show Refresh button
    const {data: {events, histogram}, additionalDataLoading,
           filter, id, acReloadTab, acSearchAdditional, ...other} = this.props;

    if (filter === null) return null;
    const {next} = events;
    return (
      <div>
        <TopChart {...this.props}
          data={histogram}
        />
        <TabWithItemList data={events.results} {...{getIdFromItem, fieldToDescription, fieldFormater}} {...other}>
          {noEntriesText}
        </TabWithItemList>
        <Row>
          <Col>
            {additionalDataLoading &&
              <Icon name="spinner" spin />
            }
            {(events.results.length > 0 && next && !additionalDataLoading) &&
              <Button bsStyle="primary" bsSize="xs" onClick={() => acSearchAdditional({id, next})}>
                <Icon name="long-arrow-right" />
              </Button>
            }
          </Col>
        </Row>
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

export const History = connect(mapStateToProps, mapDispatch)(ProductivityDump);
