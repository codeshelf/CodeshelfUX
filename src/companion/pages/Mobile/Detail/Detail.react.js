import React, {Component} from 'react';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {TimeFromNow} from "../DateDisplay.react.js";
import _ from "lodash";

import * as csapi from 'data/csapi';
import "./Detail.styl";

export class Detail extends Component {

  constructor() {
    super();
  }

  itemId = null;
  previousUrl = null;

  componentWillMount() {
    this.previousUrl = this.props.router.getCurrentParams();
    const {id: itemId, tab} = this.props.router.getCurrentParams();
    this.itemId = itemId;
    const selectTab = this.props.convertTab.fromURL[tab] || this.props.defaultSelectTab || 0;
    this.props.acSelectTab(selectTab, itemId, true);
  }

  componentWillReceiveProps(nextProps) {
    const {id: itemId, tab} = nextProps.router.getCurrentParams();
    if (!_.isEqual(this.previousUrl, nextProps.router.getCurrentParams())) {
      this.previousUrl = nextProps.router.getCurrentParams();
      this.props.acSelectTab(this.props.convertTab.fromURL[tab], itemId, true);
    }
  }


  renderTabs(activeTab, loadedTime) {
    return (
      <Tabs
        className="nav-tabs-simple"
        activeKey={activeTab}
        onSelect={(tab) => {
          this.props.router.transitionTo(this.props.transitionTo,
            {
              facilityName: this.props.router.getCurrentParams().facilityName,
              id: this.props.router.getCurrentParams().id,
              tab: this.props.convertTab.toURL[tab],
            }
          )
        }}
        tabWidth={1}>
        {this.props.ALL_TABS.map(tab =>
          <Tab key={tab} eventKey={tab} title={this.props.tabToHeaderText[tab]}>
            {loadedTime && "loaded "}
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
    if (this.props[tab].filter === null) return null;
    const {[tab]: {loadedTime}} = this.props;
    const {whatIsLoading, whatIsLoaded, error} = this.props[tab];
    const showLoading = (whatIsLoading !== null || whatIsLoaded === null);
    const showError = (error !== null);
    let contentElement = null;

    if (showError) {
      const acReloadTab = () => this.props.acSelectTab(tab, this.itemId, true);
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
            <Button bsStyle="primary" bsSize="xs" onClick={acReloadTab}><Icon name="refresh" /></Button>
          </Col>
        </Row>
      );
    } else if (showLoading) {
      contentElement = <div> Loading ... </div>;
    } else {
      const {[tab]: {settings, expanded, additionalDataLoading, filter, error, whatIsLoading, whatIsLoaded,}} = this.props;
      // creacte closures over action creators for selected tab
      const acSetFilter = (filter) => this.props.acSetFilter(tab, filter);
      const acSettingOpen = () => this.props.acSettingOpen(tab);
      const acSettingClose = () => this.props.acSettingClose(tab);
      const acSetFieldVisibility = (f, v) => this.props.acSetFieldVisibility(tab, f, v);
      const acSetFieldOrder = (f, v) => this.props.acSetFieldOrder(tab, f, v);
      const acExpand = (i) => this.props.acExpand(tab, i);
      const acReloadTab = () => this.props.acSelectTab(tab, this.itemId, true);
      const acSearchAdditional = (filter) => this.props.acSearchAdditional(tab, filter);
      const acSearch = (forceLoad) => this.props.acSearch(tab, forceLoad);
      const commonProps = {
        //data
        //error, whatIsLoading, whatIsLoaded, just temporary Productiviy tab needs them
        error,
        whatIsLoading,
        whatIsLoaded,
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
        acSearch,
        acSetFilterAndRefresh: this.props.acSetFilterAndRefresh,
        id: itemId,
      };
      const Component = this.props.tabToComponent[tab];
      contentElement = <Component {...commonProps}/>
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

export class TitleCol extends Component {

  render() {
    const {property, value, className} = this.props;
    return (
        <dl className={className}>
        <dt>{property}</dt>
        <dd property={property + "-v"}>
        {value}
      </dd>
        </dl>);
  }
}

export class TitleComponent extends Component {

  render() {
    return (
        <Row className={this.props.className}>
        <Col xs={6}>
        {this.props.children[0]}
      </Col>
        <Col xs={6} style={{}}>
        {this.props.children[1]}
      </Col>
        </Row>
    );
  }

}
