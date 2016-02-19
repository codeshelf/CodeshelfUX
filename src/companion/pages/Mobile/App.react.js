import React, {Component} from 'react';
import Icon from "react-fa";
import {authz} from 'components/common/auth';
import {Grid, Row, Col, DropdownButton, MenuItem, Button} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {FacilitySelector, renderFacilityLabel} from '../Facility/FacilitySelector';
import {loggedout} from "data/auth/actions";
import Sidebar from './Sidebar/Sidebar.react';
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

class NavMenuItem extends Component {
  render() {
    var classes = classnames(this.props.className, {
      "active": this.props.active
    });

    var propsToPass = _.clone(this.props);
    delete propsToPass.className; //pass everything but className

    return (<li className={classes}>
              {this.props.children}
            </li>
    );
  }
}

const AuthzNavMenuItem = authz(NavMenuItem);

function menuIcon(iconName) {
  return <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>;
}

function menuTitle(title) {
  return <span className="title">{title}</span>;
}

class PagesNavigation extends Component {
  render() {
    return (
        <nav className="page-sidebar visible" data-pages="sidebar">
          <div className="sidebar-header">
            <FacilitySelector {...this.props} />
          </div>
          <div className="m-t-30 sidebar-menu">
            <ul className="menu-items">
              {this.props.children}
            </ul>
          </div>
        </nav>
    );
  }
}

class App extends Component {

  sidebarLink(route, title) {
    return (
        <Link
         to={route}
         id={route}
         name={route}
         onClick={() => this.props.acToggleSidebar(false)}>
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

  getSidebarContent() {
    const domainId = this.props.facility.domainId;
    const basePath = "/mobile/facilities/" + domainId;
    return (
      <PagesNavigation {...this.props}>
        <AuthzNavMenuItem active={false}>
          {this.sidebarLink(`${basePath}/events`, "Productivity")}
          {menuIcon("bar-chart")}
        </AuthzNavMenuItem>
        <AuthzNavMenuItem active={false}>
          {this.sidebarLink(`${basePath}/orders`, "Orders")}
          {menuIcon("shopping-cart")}
        </AuthzNavMenuItem>
        <AuthzNavMenuItem active={false}>
          {this.sidebarLink(`${basePath}/workers`, "Workers")}
          {menuIcon("users")}
        </AuthzNavMenuItem>
        <AuthzNavMenuItem active={false}>
          {this.sidebarLink(`${basePath}/carts`, "Carts")}
          {menuIcon("shopping-cart")}
        </AuthzNavMenuItem>
        <AuthzNavMenuItem>
          {this.sidebarFunction(this.handleLogoutClick.bind(this), "Logout")}
          {menuIcon("sign-out")}
        </AuthzNavMenuItem>
      </PagesNavigation>
    )
  }

  render() {
    return (
        <div id="outer-wrapper">
          <Sidebar sidebar={this.getSidebarContent()}
            open={this.props.isOpen}
            docked={false}
            onSetOpen={(open) => this.props.acToggleSidebar(open)}
            style={{
              sidebar: {
                zIndex: 999,
                width: 250,
              },
              overlay: {
                zIndex: 998,
              }
            }}>
          </Sidebar>
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

