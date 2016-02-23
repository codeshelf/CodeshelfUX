import React from 'react';
import {Navigation} from "../../Sidebar/Navigation";
import exposeRouter from 'components/common/exposerouter';

const AuthzMenuItem = Navigation.AuthzMenuItem;
class AdminNavigation extends React.Component {

  componentWillMount() {
    document.body.classList.add("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
  }

  componentWillUnmount() {
    document.body.classList.remove("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
  }

  getUXUrl(facility) {
      let uxURL = "/ux/?facilityId=" + facility.get("domainId");
      return uxURL;
  }

  render() {
      var params = this.props.params;
      let {facility} = this.props;
      return (<Navigation {...this.props} docked={true} desktop={true} availableFacilities={this.props.facilities}>
                  <AuthzMenuItem to="users" params={params} title="Users" iconName="users" />
              </Navigation>);
  }

};

export default exposeRouter(AdminNavigation);
