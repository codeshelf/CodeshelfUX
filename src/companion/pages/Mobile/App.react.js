import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';
import Icon from "react-fa";
import {Grid, Row, Col, DropdownButton, MenuItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink, SidebarLink} from './links';
import {clearStoredCredentials} from "data/user/store";
import {loggedout} from "data/auth/actions";
import Sidebar from './Sidebar/Sidebar.react';
import exposeRouter from 'components/common/exposerouter';


class NavigationMenu extends Component {

  render() {
    console.log("Render navigation menu", this.props.facility);
    return (
      <div className="header" style={{height: 48}}>
{/**
       <div className="pull-left full-height">
          <div className="sm-action-bar">
            <ButtonLink bsStyle="link" to="facility" id="home" name="home">
              <Icon name="home" size="lg"/>
            </ButtonLink>
          </div>
        </div>
  **/}
        <div className="pull-right full-height">
          <div className="sm-action-bar">
            <ButtonLink bsStyle="link"
              to="mobile-facility"
              id="mobile-facility"
              name="mobile-facility">
                <Icon name="home" size="lg"/>
            </ButtonLink>
        </div>
        </div>
        <div className="pull-right sm-table">
          <div className="header-inner" style={{height: 48}}>
            <div className="brand inline">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}



class App extends Component {

  handleLogoutClick(e) {
      e.preventDefault();
      clearStoredCredentials();
      loggedout(false);
  }

  getSidebarContent() {
    return (
      <div>
        <FacilitySelector {...this.props} />
        <SidebarLink
          to="mobile-events"
          id="mobile-events"
          name="mobile-events"
          onclick={() => this.props.acToggleSidebar(false)}
          label="Productivity"
        />
        <SidebarLink
          to="mobile-search-orders"
          id="mobile-search-orders"
          name="mobile-search-orders"
          onclick={() => this.props.acToggleSidebar(false)}
          label="Orders"
        />
        <SidebarLink
          to="mobile-search-workers"
          id="mobile-search-workers"
          name="mobile-search-workers"
          onclick={() => this.props.acToggleSidebar(false)}
          label="Workers"
        />
        <MenuItem
          onSelect={() => {
            const currentPath = this.props.router.getCurrentPath();
            this.props.acToggleSidebar(false);
            this.props.router.transitionTo("changepassword", {}, {nextPath: currentPath});
          }}
          id="changepassword">
            <Icon name="edit" />Change Password
        </MenuItem>
        <MenuItem
          onSelect={(e) => {
            this.props.acToggleSidebar(false);
            this.handleLogoutClick(e);
          }}
          id="logout">
            <Icon name="sign-out" />Log out
        </MenuItem>
      </div>
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
                width: 280,
              },
              overlay: {
                zIndex: 998,
              }
            }}/>
          <div id="page-wrapper" className="page-container" style={{backgroundColor: "rgb(245, 245, 245)"}}>
              <NavigationMenu facility={this.props.facility}>
                <div
                  style={{position: 'absolute', left: 0}}
                  onClick={() => this.props.acToggleSidebar(true)}>
                    <Icon name="bars" size="lg"/>
                </div>
              </NavigationMenu>
              <div className="page-content-wrapper">
                <div className="content">
                  <Grid fluid className="sm-padding-10">
                    <RouteHandler />
                  </Grid>
                </div>
              </div>
          </div>
        </div>
    );
  }
}

export default exposeRouter(App);



class FacilitySelector extends React.Component {

    renderDropdownLabel(facility) {
        if (facility) {
          const {description, timeZoneDisplay} = facility;
            return (<span><Icon name="building" />{description}({timeZoneDisplay})</span>);
        } else {
            return null;
        }
    }

    render() {
        let {facility, availableFacilities} = this.props;
        return (<DropdownButton className="facility-dropdown" bsStyle="link" title={this.renderDropdownLabel(facility)}>
                {
                    availableFacilities.map((facility) => {
                        const {name, persistentId, domainId, description} = facility;

                        return <SidebarLink key={domainId}
                                             to="mobile-facility"
                                             params={{facilityName: domainId}}
                                             data-persistentid={persistentId}
                                             onclick={() => this.props.acToggleSidebar(false)}
                                             label={description}/>;
                    })
               }
        </DropdownButton>);
    }
}
