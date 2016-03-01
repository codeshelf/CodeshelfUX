import React, {Component} from 'react';
import Icon from "react-fa";
import {authz} from 'components/common/auth';
import {Grid, Row, Col, DropdownButton, MenuItem, Button} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {FacilitySelector, renderFacilityLabel} from '../Facility/FacilitySelector';
import {loggedout} from "data/auth/actions";
import {Navigation, AuthzNavMenuItem, AuthzMenuItem} from '../Sidebar/Navigation';
import exposeRouter from 'components/common/exposerouter';
import classnames from 'classnames';

class Header extends Component {
  render() {
    return (
        <div className="header ">
          <div className="">
            <div className="pull-left full-height visible-sm visible-xs" style={{zIndex: 10, position: "relative"}}>
              <div className="header-inner">
                {this.props.children}
              </div>
            </div>
            <div className="pull-center">
              <div className="header-inner">
                <div className="brand inline">
                  {renderFacilityLabel(this.props.facility)}
                </div>
              </div>
            </div>

            <div className="pull-right full-height visible-sm visible-xs">
              <div className="header-inner">
              </div>

            </div>
          </div>
        </div>
    );
  }
}

function menuIcon(iconName) {
  return <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>;
}

function menuTitle(title) {
  return <span className="title">{title}</span>;
}

class App extends Component {

  sidebarLink(route, title) {
    return (
        <Link
         to={route}
         id={route}
         name={route}
         onClick={() => this.props.acToggleSidebar(false)}
         shouldHaveFacility={true}>
      {menuTitle(title)}
    </Link>
    );
  }

  sidebarFunction(onClick, title) {
    return (
      <a onClick={onClick} href="#">{menuTitle(title)}</a>
    );
  }

  handleLogoutClick(e) {
      e.preventDefault();
      this.props.acToggleSidebar(false);
      clearStoredCredentials();
      loggedout(false);
  }

  render() {
    const domainId = this.props.facility.domainId;
    const basePath = "/mobile/facilities/" + domainId;
    return (
        <div id="outer-wrapper">
          <Navigation
            facility={this.props.facility}
            availableFacilities={this.props.availableFacilities}
            isOpen={this.props.isOpen}
            docked={false}
            acToggleSidebar={this.props.acToggleSidebar}
            >
              <AuthzMenuItem permission="event:view" to={`${basePath}/events`} title="Productivity"
                onClick={() => this.props.acToggleSidebar(false)}
                iconName="bar-chart" />
              <AuthzMenuItem permission="event:view" to={`${basePath}/orders`} title="Orders"
                onClick={() => this.props.acToggleSidebar(false)}
                iconName="shopping-basket" />
              <AuthzMenuItem permission="event:view" to={`${basePath}/workers`} title="Workers"
                onClick={() => this.props.acToggleSidebar(false)}
                iconName="users" />
              <AuthzMenuItem permission="event:view" to={`${basePath}/carts`} title="Carts"
                onClick={() => this.props.acToggleSidebar(false)}
                iconName="shopping-cart" />
              <AuthzMenuItem permission="event:view" title="Logout"
                onClick={(e) => this.handleLogoutClick(e)}
                iconName="sign-out" />
          </Navigation>
          <div id="page-wrapper" className="page-container" style={{backgroundColor: "rgb(245, 245, 245)"}}>
              <Header facility={this.props.facility}>
                <Button
                    bsStyle="link"
                    className="visible-sm-inline-block visible-xs-inline-block padding-5"
                    onClick={() => this.props.acToggleSidebar(true)}>
                      <Icon name="bars" size="lg"/>
                </Button>
              </Header>
              <div className="page-content-wrapper">
                <div className="content">
                  <Grid fluid className="sm-padding-10">
                    {this.props.children}
                  </Grid>
                </div>
              </div>
          </div>
        </div>
    );
  }
}

export default exposeRouter(App);

