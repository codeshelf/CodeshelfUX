import React from "react";
import Icon from "react-fa";
import {DropdownButton, NavItem, Button, MenuItem} from "react-bootstrap";
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import {loggedout, rememberCredentials} from "data/auth/actions";
import {getEmail, isCredentialsStored} from "data/user/store";

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
        loggedout();
    }


    renderTitle() {
        let email = getEmail();
        let userTitle = email.replace(/@.*/, "");
        return (<span><Icon name="user"/> {userTitle} </span>);
    }

    render() {
        let {credentialsStored} = isCredentialsStored();
        return (
            <DropdownButton bsStyle="link" title={this.renderTitle()} pullRight="true">
                <MenuItem className="disabled"><Icon name="briefcase" onClick={rememberCredentials}/> Remember Credentials
                {
                    (credentialsStored) ?
                        <Icon name="check" style={{marginLeft: "1em"}}/>
                        :
                        null
                }
                </MenuItem>
                <MenuItem onClick={this.handleLogoutClick.bind(this)}><Icon name="sign-out" />Log out</MenuItem>
            </DropdownButton>
        );
    }

}

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
