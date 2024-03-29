import React from 'react';
import {Navigation, AuthzMenuItem} from "../../Sidebar/Navigation";
import exposeRouter from 'components/common/exposerouter';

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
      return (<Navigation {...this.props} hideFacilitySelector={true} docked={true} desktop={true} availableFacilities={this.props.facilities}>
                <AuthzMenuItem normalLinks={true} to="/admin/users" params={params} title="Users" iconName="users" />
              </Navigation>);
  }

};

export default exposeRouter(AdminNavigation);
