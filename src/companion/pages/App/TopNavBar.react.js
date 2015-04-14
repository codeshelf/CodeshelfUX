import React from 'react';
import Icon from 'react-fa';
import {NavItem} from 'react-bootstrap';
import {loggedout} from 'data/auth/actions';

//TODO show logout if logged in
export default class TopNavBar extends React.Component {

    handleLogoutClick(e) {
        e.preventDefault();
        loggedout();
    }

    render() {
        return (
                <div className="row border-bottom">
                    <nav style={{marginBottom: 0}} role="navigation" className="navbar navbar-static-top">
                        <div className="navbar-header">
                            <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.handleNavbarMinimalize} ><Icon name="bars" /> </a>

                        </div>
                        <ul className="nav navbar-top-links navbar-right">
                            <NavItem onClick={this.handleLogoutClick} ><Icon name="sign-out" />Log out</NavItem>
                        </ul>
                    </nav>

                </div>
        );
    }
};
