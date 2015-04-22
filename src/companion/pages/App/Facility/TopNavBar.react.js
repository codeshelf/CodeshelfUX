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

    handleNavbarMinimalize(e) {
        e.preventDefault();
        document.body.classList.toggle("mini-navbar");
    }

    render() {
        let {title} = this.props;
        return (
                <div className="header">
                    <div className="pull-left sm-table">
                        <div className="header-inner">
                            <div class="brand inline">
                                <h1>{title}</h1>
                            </div>
                        </div>
                    </div>
                        <div className="pull-right">
                            <a onClick={this.handleLogoutClick} ><Icon name="sign-out" />Log out</a>
                        </div>
                </div>
        );
    }
};
