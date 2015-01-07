/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");
var _ = require("lodash");

var Navbar = RClass(function() {
    return (
            <nav className="navbar-default navbar-static-side" role="navigation">
              <div id="nav-container" className="sidebar-collapse">
                <ul className="nav" id="side-menu">
                  <NavbarHeader facility={this.props.facility}
                                organization={this.props.organization} />
                  {
                    this.props.navMenus.map(function(navMenu) {
                       return (<NavbarMenu navMenu={navMenu} key={navMenu.label}/>);
                    })
                  }
                </ul>
              </div>
            </nav>);
});

var NavbarHeader = RClass(function() {
    var facility = this.props.facility;
    var organization = this.props.organization;
    var facilityName = (facility) ? facility["domainId"] : "";
    var orgName = (organization) ? organization["domainId"] : "";
    return (<div className="nav-header">
            <div className="profile-element">
            <h1 className="block"> {orgName} </h1>
            <span className="block m-t-xs">
            <strong className="font-bold">&lt; {facilityName} </strong>
            </span>
            </div>
            <div className="logo-element">
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
                <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary "><i className="fa fa-bars" /> </a>
                <form action="search_results.html" method="post" className="navbar-form-custom" role="search">
                <div className="form-group">
                <input type="text" id="top-search" name="top-search" className="form-control" placeholder="Search for something..." />
                </div>
                </form>
                </div>
                <ul className="nav navbar-top-links navbar-right">
                <li className="dropdown">
                <a href="#" data-toggle="dropdown" className="dropdown-toggle count-info">
                <i className="fa fa-bell" />  <span className="label label-primary">8</span>
                </a>
                <ul className="dropdown-menu dropdown-alerts">
                <li>
                <a href="mailbox.html">
                <div>
                <i className="fa fa-envelope fa-fw" /> You have 16 messages
                <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
                </a>
                </li>
                <li className="divider" />
                <li>
                <a href="profile.html">
                <div>
                <i className="fa fa-twitter fa-fw" /> 3 New Followers
                <span className="pull-right text-muted small">12 minutes ago</span>
                </div>
                </a>
                </li>
                <li className="divider" />
                <li>
                <a href="grid_options.html">
                <div>
                <i className="fa fa-upload fa-fw" /> Server Rebooted
                <span className="pull-right text-muted small">4 minutes ago</span>
                </div>
                </a>
                </li>
                <li className="divider" />
                <li>
                <div className="text-center link-block">
                <a href="notifications.html">
                <strong>See All Alerts</strong>
                <i className="fa fa-angle-right" />
                </a>
                </div>
                </li>
                </ul>
                </li>
                <li>
                <a href="login.html">
                <i className="fa fa-sign-out" /> Log out
            </a>
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
