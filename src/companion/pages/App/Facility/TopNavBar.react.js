import React from "react";
import Icon from "react-fa";
import {DropdownButton, NavItem, Button} from "react-bootstrap";
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import {loggedout} from "data/auth/actions";

//TODO show logout if logged in
export default class TopNavBar extends React.Component {

    handleLogoutClick(e) {
        e.preventDefault();
        loggedout();
    }

    handleNavbarMinimalize(e) {
        e.preventDefault();
        document.body.classList.toggle("mini-navbar");
    }

    render() {
        let {title, facility, facilities} = this.props;
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
                <Button bsStyle='link' onClick={this.handleLogoutClick}><Icon name="sign-out" />Log out</Button>
                        </div>
                </div>
        );
    }
};

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
