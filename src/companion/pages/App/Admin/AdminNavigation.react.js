import React from 'react';
import {Nav as Navigation} from "../Navigation";
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
      return (<Navigation {...this.props}>
                  <AuthzMenuItem className="m-t-30" to="users" params={params} title="Users" iconName="users" />
              </Navigation>);
  }

};

export default exposeRouter(AdminNavigation);
