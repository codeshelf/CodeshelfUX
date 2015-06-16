import React from "react";
import Icon from "react-fa";
import {DropdownButton, NavItem, Button, MenuItem} from "react-bootstrap";
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import {loggedout, toggleStoredCredentials} from "data/auth/actions";
import {getEmail, isCredentialsStored} from "data/user/store";
import {authz} from 'components/common/auth';

//TODO show logout if logged in
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
                            <FacilitySelector facility={facility} facilities={facilities} />
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
        loggedout(false);
    }


    renderTitle() {
        let email = getEmail();
        let userTitle = email.replace(/@.*/, "");
        return (<span><Icon name="user"/> {userTitle} </span>);
    }

    render() {

        return (
            <DropdownButton bsStyle="link" title={this.renderTitle()} pullRight="true">
                <AuthzCredentialsStore permission="companion:savecredentials" notPermission="companion:nosavecredentials"/>
                <MenuItem onClick={this.handleLogoutClick.bind(this)}><Icon name="sign-out" />Log out</MenuItem>
            </DropdownButton>
        );
    }

}

class CredentialsStore extends React.Component {

    handleStoreCredentialsClick(credentialsStored, e) {
        e.preventDefault();
        if (credentialsStored) {
            loggedout(false);
        } else {
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
        let facilityName = (facility) ? facility.get("name") : "";
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
                        let {name, persistentId, domainId} = facility.toObject();

                        return <MenuItemLink key={domainId}
                                             to="facility"
                                             params={{facilityName: domainId}}
                                             data-persistentid={persistentId}>
                                         {name}
                               </MenuItemLink>;
                    })
               }
        </DropdownButton>);
    }
}
