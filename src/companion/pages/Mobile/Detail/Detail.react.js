import React, {Component} from 'react';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {TimeFromNow} from "../DateDisplay.react.js";

import * as csapi from 'data/csapi';

export class Detail extends Component {

  constructor() {
    super();
  }

  itemId = null;

  componentWillMount() {
    const {id: itemId} = this.props.router.getCurrentParams();
    this.itemId = itemId;
    const defaultSelectTab = this.props.defaultSelectTab || 0;
    this.props.acSelectTab(defaultSelectTab, itemId, true);
  }


  renderTabs(activeTab, loadedTime) {
    return (
      <Tabs className="nav-tabs-simple" activeKey={activeTab} onSelect={(tab) => this.props.acSelectTab(tab, this.itemId)} tabWidth={1}>
        {this.props.ALL_TABS.map(tab =>
          <Tab eventKey={tab} title={this.props.tabToHeaderText[tab]}>
            {this.props.tabToDescriptionText[tab]}
            {loadedTime && " - loaded "}
            <TimeFromNow time={loadedTime}/>
          </Tab>
        )}
      </Tabs>
    );
  }

  render() {
    const {id: itemId} = this.props.router.getCurrentParams();
    this.itemId = itemId;
    const {tab} = this.props;
    const {[tab]: {loadedTime}} = this.props;
    const {whatIsLoading, whatIsLoaded, error} = this.props[tab];
    const showLoading = (whatIsLoading !== null || whatIsLoaded === null);
    const showError = (error !== null);
    let contentElement = null;

    if (showError) {
      const acRelaodTab = () => this.props.acSelectTab(tab, this.itemId, true);
      let text = "Can't load request";
      if (error instanceof csapi.ConnectionError || error.message) {
        text = error.message;
      }
      contentElement = (
        <Row>
          <Col xs={8}>
            Error: {text}
          </Col>
          <Col xs={4}>
            <Button bsStyle="primary" bsSize="xs" onClick={acRelaodTab}><Icon name="refresh" /></Button>
          </Col>
        </Row>
      );
    } else if (showLoading) {
      contentElement = <div> Loading ... </div>;
    } else {
      const {[tab]: {settings, expanded, additionalDataLoading, filter}} = this.props;
      // creacte closures over action creators for selected tab
      const acSetFilter = (filter) => this.props.acSetFilter(tab, filter);
      const acSettingOpen = () => this.props.acSettingOpen(tab);
      const acSettingClose = () => this.props.acSettingClose(tab);
      const acSetFieldVisibility = (f, v) => this.props.acSetFieldVisibility(tab, f, v);
      const acSetFieldOrder = (f, v) => this.props.acSetFieldOrder(tab, f, v);
      const acExpand = (i) => this.props.acExpand(tab, i);
      const acReloadTab = () => this.props.acSelectTab(tab, this.itemId, true);
      const acSearchAdditional = (token) => this.props.acSearchAdditional(tab, token);
      const acSearchFilter = (filter) => this.props.acSearch(tab, {id: itemId, filter});
      const commonProps = {
        //data
        expanded,
        filter,
        additionalDataLoading,
        settings,
        data: this.props[tab].data,
        //action creators
        acExpand,
        acSetFieldVisibility,
        acSetFieldOrder,
        acSettingOpen,
        acSettingClose,
        acReloadTab,
        acSearchAdditional,
        acSetFilter,
        acSearchFilter,
        id: itemId,
      };
      const Component = this.props.tabToComponent[tab];
      contentElement = <Component {...commonProps} />
    }
    return (
      <div>
        <Row>
          <Col xs={12}>
            {(this.props.getTitleComponent && this.props.getTitleComponent(this.props, this.itemId))}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {this.renderTabs(tab, loadedTime)}
            <div style={{"paddingLeft": "15px"}}>
              {contentElement}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}