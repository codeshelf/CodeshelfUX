/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");

var Nav = RClass(function() {
	return (
		<ul className="nav" id="side-menu">
			<NavHeader facility={this.props.facility} />
			{
			 this.props.navMenus.map(function(navMenu) {
				return (<NavMenu navMenu={navMenu} />);
			 })
			}
		</ul>
	);
});

var NavHeader = RClass(function() {
	var facilityName = this.props.facility["domainId"];
	return (<div className="nav-header">
              <div className="profile-element">
			      <h1 className="block"> -- Org Here -- </h1>
			    <span className="block m-t-xs">
				  <strong className="font-bold">&lt; {facilityName} </strong>
                </span>
              </div>
              <div className="logo-element">
				CS
			  </div>
			</div>);
});

var NavMenu = RClass(function() {
	var navMenu = this.props.navMenu;
	var iconClassNames = "fa " + navMenu.icon;
	return (
		<li className="active">
            <a href="#"><i className={iconClassNames}></i><span className="nav-label">{navMenu.label}</span><span className="fa arrow"></span></a>
			<NavMenuItems menuItems={navMenu.menuItems} />
        </li>
	);
});

var NavMenuItems = RClass(function(){
	return (
		<ul className="nav nav-second-level">
			{
			 this.props.menuItems.map(function(menuItem) {
				 return <li key={menuItem.key}><a href={menuItem.href}>{menuItem.label}</a></li>
			 })
			 }
        </ul>
	);
});

module.exports = Nav;
