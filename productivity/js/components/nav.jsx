/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");
var _ = require("lodash");

var Navbar = RClass(function() {
    return (
            <nav className="navbar-default navbar-static-side" role="navigation">
              <div id="nav-container" className="sidebar-collapse">
                <ul className="nav" id="side-menu">
                  <NavbarHeader title={this.props.title} />
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
    handleNavbarMinimalize: function() {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu(); //from inspinia
    },

    render: function() {
        return (
            <div className="row border-bottom">
                <nav style={{marginBottom: 0}} role="navigation" className="navbar navbar-static-top">
                    <div className="navbar-header">
                        <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary " onClick={this.handleNavbarMinimalize} ><i className="fa fa-bars" /> </a>
                    </div>
                </nav>
                </div>
        );
    }
});


module.exports = {
    Navbar: Navbar,
    NavbarTop: NavbarTop
};
