import React from "react";
import Icon from "react-fa";
import {DropdownButton, Nav, NavItem, Button, MenuItem} from "react-bootstrap";
import { NavItemLink, MenuItemLink, ButtonLink} from '../Mobile/links.js';
import {loggedout} from "data/auth/actions";
//todo turn clearStoredCredentials into an action
import {getEmail, isCredentialsStored, clearStoredCredentials} from "data/user/store";
import {authz} from 'components/common/auth';

function clearCredentials() {
    clearStoredCredentials();
    loggedout(false);
}

const AuthzButtonLink = authz(ButtonLink);

export default class TopNavBar extends React.Component {

    handleNavbarMinimalize(e) {
        e.preventDefault();
        document.body.classList.toggle("mini-navbar");
    }

    render() {
        let {title, facility, facilities, user} = this.props;
        return (
                <div className="header">
                    <div className="pull-left sm-table">
                        <div className="header-inner hidden-sm hidden-xs">
                            <div className="brand inline">
                                <h1>{title}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="pull-right">
                            {
                                (facilities) ?
                                    <AuthzButtonLink permission="user:edit" bsStyle="link" to="users" >Admin</AuthzButtonLink> :
                                    <ButtonLink bsStyle="link" to="facilities" id="home" name="home">
                                        <Icon name="home" size="lg"/>
                                    </ButtonLink>
                            }
                            {(facilities) &&
                                <FacilitySelector facility={facility} facilities={facilities} />}
                                <UserProfileMenu user={user}/>
                            </div>
                </div>
        );
    }
};

class UserProfileMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLogoutClick(e) {
        e.preventDefault();
        clearCredentials();
    }


    renderTitle() {
        let email = getEmail();
        let userTitle = email.replace(/@.*/, "");
        return (<span><Icon name="user"/> {userTitle} </span>);
    }

    render() {

        return (
            <DropdownButton bsStyle="link" className="userprofile" title={this.renderTitle()} pullRight={true}>
                <AuthzCredentialsStore permission="companion:savecredentials" notPermission="companion:nosavecredentials"/>
            <MenuItemLink title="changepassword" to="changepassword" id="changepassword"><Icon name="edit" />Change Password</MenuItemLink>
                <MenuItem title="logout" onSelect={this.handleLogoutClick.bind(this)} id="logout"><Icon name="sign-out" />Log out</MenuItem>
            </DropdownButton>
        );
    }

}

class CredentialsStore extends React.Component {

    handleStoreCredentialsClick(credentialsStored, e) {
        e.preventDefault();
        if (credentialsStored) {
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
            {

                (credentialsStored) ?
                    <span><Icon name="trash" /> Clear Credentials</span>
                    :
                    <span><Icon name="briefcase" /> Remember Credentials</span>
            }
            </MenuItem>
        );
    }
}
const AuthzCredentialsStore = authz(CredentialsStore);

class FacilitySelector extends React.Component {

    renderDropdownLabel(facility) {
      let facilityName = (facility) ? facility.description : "";
        if (facility) {
            return (<span><Icon name="building" /> {facilityName}</span>);
        } else {
            return null;
        }
    }

    render() {
        let {facility, facilities} = this.props;
        return (<DropdownButton className="facility-dropdown" bsStyle="link" title={this.renderDropdownLabel(facility)}>
                {
                    facilities.map((facility) => {
                      let {persistentId, domainId, description} = facility;

                        return <MenuItemLink key={domainId}
                                             to={`/facilities/${domainId}`}
                                             data-persistentid={persistentId}>
                                         {description}
                               </MenuItemLink>;
                    })
               }
        </DropdownButton>);
    }
}
