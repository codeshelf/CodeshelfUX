/** @jsx React.DOM */

var React = require("react");
var RClass = require("../helpers/react-helper");

var NavHeader = RClass(function() {
	var facilityName = this.props.facility["domainId"];
	return (<div>
              <div className="profile-element">
			    <span className="block m-t-xs">
				  <strong className="font-bold">&lt; {facilityName} </strong>
                </span>
              </div>
              <div className="logo-element">
				CS
			  </div>
			</div>);
});

module.exports = {
	NavHeader: NavHeader
};
