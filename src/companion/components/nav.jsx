/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");
var _ = require("lodash");

var { NavItemLink } = require('react-router-bootstrap');


var Navbar = RClass(function() {
    return (
            <nav className="navbar-default navbar-static-side" role="navigation">
              <div id="nav-container" className="sidebar-collapse">
                <ul className="nav" id="side-menu">
                  <NavbarHeader title={this.props.title} />
                  <NavItemLink to="overview"><i className="fa fa-clock-o"></i>Work Overview</NavItemLink>
                  <NavItemLink to="blockedwork"><i className="fa fa-exclamation-circle"></i>Blocked Work</NavItemLink>
                  <NavItemLink to="orderdetails"><i className="fa fa-pie-chart"></i>Work Results</NavItemLink>
                </ul>
              </div>
            </nav>
);
});

var NavbarHeader = RClass(function() {
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
});

var NavbarMenu = RClass(function() {
    var navMenu = this.props.navMenu;
    var menuItems = navMenu["menuItems"] ? navMenu["menuItems"] : [];
    var iconClassNames = "fa " + navMenu.icon;
    return (
            <li className="active">
            <a href="#"><i className={iconClassNames}></i><span className="nav-label">{navMenu.label}</span>
               {(!_.isEmpty(menuItems)) ? <span className="fa arrow"></span> : "" }
            </a>
            <ul className="nav nav-second-level">
            {
                menuItems.map(function(menuItem) {
                    return <li key={menuItem.key}><a href={menuItem.href}>{menuItem.label}</a></li>
                })
            }
        </ul>
            </li>
    );
});


/* */
var NavbarTop = React.createClass({

    render: function() {
        return (
            <div className="row border-bottom">
                <nav style={{marginBottom: 0}} role="navigation" className="navbar navbar-static-top">
                    <div className="navbar-header">
                        <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.handleNavbarMinimalize} ><i className="fa fa-bars" /> </a>

                    </div>
                    <ul className="nav navbar-top-links">
                        <li>
                        <a href="">{this.props.title}</a>

                        </li>
                    </ul>
                </nav>

            </div>
        );
    }
});


module.exports = {
    Navbar: Navbar,
    NavbarTop: NavbarTop
};
