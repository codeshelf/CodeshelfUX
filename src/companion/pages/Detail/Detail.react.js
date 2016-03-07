import React, {Component} from 'react';
import {Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import Icon from 'react-fa';
import {TimeFromNow} from "../DateDisplay.react.js";
import _ from "lodash";
import URI from 'urijs';

import * as csapi from 'data/csapi';
import "./Detail.styl";

export class Detail extends Component {

  constructor() {
    super();
  }

  itemId = null;
  previousUrl = null;

  componentWillMount() {
    this.previousUrl = this.props.params;
    const {id: itemId, tab} = this.props.params;
    this.itemId = itemId;
    const selectTab = this.props.convertTab.fromURL[tab] || this.props.defaultSelectTab || 0;
    this.props.acSelectTab(selectTab, itemId, true);
  }

  componentWillReceiveProps(nextProps) {
    const {id: itemId, tab} = nextProps.params;
    if (!_.isEqual(this.previousUrl, nextProps.params)) {
      this.previousUrl = nextProps.params;
      this.props.acSelectTab(this.props.convertTab.fromURL[tab], itemId, true);
    }
  }


  renderTabs(activeTab, loadedTime) {
    return (
      <Tabs
        className="nav-tabs-simple"
        activeKey={activeTab}
        onSelect={(tab) => {
          const {convertTab, router, location} = this.props;
          const tabFragment = convertTab.toURL[tab];
          const newUri = new URI(tabFragment);
          const tabURL = newUri.absoluteTo(location.pathname+location.search).toString();
          router.push(tabURL);
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
    const {id: itemId} = this.props.params;
    this.itemId = itemId;
    const {tab} = this.props;
    if (this.props[tab].filter === null) return null;
    const {[tab]: {loadedTime}} = this.props;
    const {whatIsLoading, whatIsLoaded, error} = this.props[tab];
    const showLoading = (whatIsLoading !== null || whatIsLoaded === null);
    const showError = (error !== null);
    let contentElement = null;

    if (showError) {
      let text = "Can't load request";
      if (error instanceof csapi.ConnectionError || error.message) {
        text = error.message;
      }
      contentElement = (
        <Row>
          <Col xs={8}>
            Error: {text}
          </Col>
        </Row>
      );
    } else if (showLoading) {
      contentElement = <div> Loading ... </div>;
    } else {
      const {[tab]: {settings, expanded, additionalDataLoading, filter, error, whatIsLoading, whatIsLoaded,}} = this.props;
      // creacte closures over action creators for selected tab
      const acSetFilter = (filter) => this.props.acSetFilter(tab, itemId, filter);
      const acSettingOpen = () => this.props.acSettingOpen(tab);
      const acSettingClose = () => this.props.acSettingClose(tab);
      const acSetFieldVisibility = (f, v) => this.props.acSetFieldVisibility(tab, f, v);
      const acSetFieldOrder = (f, v) => this.props.acSetFieldOrder(tab, f, v);
      const acExpand = (i) => this.props.acExpand(tab, i);
      const acSearchAdditional = (filter) => this.props.acSearchAdditional(tab, filter);
      const acSearch = (forceLoad) => this.props.acSearch(tab, forceLoad);
      const acSetFilterAndRefresh = (filter) => this.props.acSetFilterAndRefresh(tab, itemId, filter);
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
        acSearchAdditional,
        acSetFilter,
        acSearch,
        acSetFilterAndRefresh,
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
