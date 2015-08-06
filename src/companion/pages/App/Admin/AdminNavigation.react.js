import React from 'react';
import Navigation from "../Navigation";
import exposeRouter from 'components/common/exposerouter';

const AuthzMenuItem = Navigation.AuthzMenuItem;
class AdminNavigation extends React.Component {

  getUXUrl(facility) {
      let uxURL = "/ux/?facilityId=" + facility.get("domainId");
      return uxURL;
  }

  render() {
      var params = this.props.router.getCurrentParams();
      let {facility} = this.props;
      return (<Navigation {...this.props}>
                  <AuthzMenuItem className="m-t-30" to="users" params={params} title="Users" iconName="users" />
              </Navigation>);
  }

};

export default exposeRouter(AdminNavigation);
