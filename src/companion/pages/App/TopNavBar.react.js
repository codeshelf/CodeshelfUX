import React from "react";
import Icon from "react-fa";
import { DropdownButton, Nav, NavItem, Button, MenuItem } from "react-bootstrap";
import { NavItemLink, MenuItemLink, ButtonLink } from '../links.js';
import { loggedout } from "data/auth/actions";
//todo turn clearStoredCredentials into an action
import { getEmail, isCredentialsStored, clearStoredCredentials } from "data/user/store";
import { authz } from 'components/common/auth';

function clearCredentials() {
  clearStoredCredentials();
  loggedout(false);
}

const AuthzButtonLink = authz(ButtonLink);

export default class TopNavBar extends React.Component {

  handleNavbarMinimalize( e ) {
    e.preventDefault();
    document.body.classList.toggle("mini-navbar");
  }

  render() {
    let {title, selected, user} = this.props;
    return (
      <div className="header">
        <div className="pull-left sm-table">
          <div className="header-inner hidden-sm hidden-xs">
            <div className="brand inline">
            </div>
          </div>
        </div>
        <div className="pull-right">
          {(selected) ?
             <AuthzButtonLink id="admin"
                              permission="user:edit"
                              bsStyle="link"
                              to="/admin/users"
                              shouldHaveFacility={false}>
               Admin
             </AuthzButtonLink>
             :
             <ButtonLink bsStyle="link"
                         to="/facilities"
                         id="home"
                         name="home">
               <Icon name="home" size="lg" />
             </ButtonLink>}
          <span>{title}</span>
          <UserProfileMenu user={user} />
        </div>
      </div>
      );
  }
}
;

class UserProfileMenu extends React.Component {
  constructor( props ) {
    super(props);
  }

  handleLogoutClick( e ) {
    e.preventDefault();
    clearCredentials();
  }


  renderTitle() {
    let email = getEmail();
    let userTitle = email.replace(/@.*/, "");
    return (<span><Icon name="user"/> {userTitle}</span>);
  }

  render() {

    return (
      <DropdownButton bsStyle="link"
                      className="userprofile"
                      title={this.renderTitle()}
                      pullRight={true}
                      id="topNavBar">
        <AuthzCredentialsStore permission="companion:savecredentials" notPermission="companion:nosavecredentials" />
        <MenuItemLink title="changepassword"
                      to="/password/change"
                      id="changepassword"
                      shouldHaveFacility={false}>
          <Icon name="edit" />Change Password
        </MenuItemLink>
        <MenuItem title="logout"
                  onSelect={this.handleLogoutClick.bind(this)}
                  id="logout"
                  shouldHaveFacility={false}>
        <Icon name="sign-out" />Log out
        </MenuItem>
      </DropdownButton>
      );
  }

}

class CredentialsStore extends React.Component {

  handleStoreCredentialsClick( credentialsStored, e ) {
    e.preventDefault();
    if ( credentialsStored ) {
      clearCredentials();
    } else {
      //logout and capture credentials
      loggedout(true);
    }
  }

  render() {
    let credentialsStored = isCredentialsStored();
    return (
      <MenuItem onClick={this.handleStoreCredentialsClick.bind(this, credentialsStored)}>
      {(credentialsStored) ?
         <span><Icon name="trash" /> Clear Credentials</span>
         :
         <span><Icon name="briefcase" /> Remember Credentials</span>}
      </MenuItem>
      );
  }
}
const AuthzCredentialsStore = authz(CredentialsStore);
