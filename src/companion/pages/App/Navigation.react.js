import React from 'react';
import { NavItemLink } from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'lib/purecomponent';

require('./navigation.styl');

class NavbarHeader extends PureComponent {
    render() {
        var title = this.props.title;
        var facilityName = (title) ? title : "";
        return (<div className="nav-header">
                <div className="profile-element">
                <h1 className="block" style={{textOverflow: "ellipsis", overflow: "hidden"}}>{facilityName}</h1>
                <span className="block m-t-xs">
                <strong className="font-bold">{""}</strong>
                </span>
                </div>
                <div className="logo-element"> {/**when collapsed**/}
                CS
                </div>
                </div>);
    }
}

export default class Navigation extends PureComponent {

  render() {
    return (
        <nav className="navbar-default navbar-static-side" role="navigation">
            <div id="nav-container" className="sidebar-collapse">
            <ul className="nav" id="side-menu">
            <NavbarHeader title={this.props.title} />
            <NavItemLink to="overview"><Icon name="clock-o"></Icon>Work Overview</NavItemLink>
            <NavItemLink to="blockedwork"><Icon name="exclamation-circle"></Icon>Blocked Work</NavItemLink>
            <NavItemLink to="workresults"><Icon name="pie-chart"></Icon>Work Results</NavItemLink>
            <NavItemLink to="import"><Icon name="upload"></Icon>Import</NavItemLink>
            </ul>
            </div>
        </nav>
    );
  }

};
