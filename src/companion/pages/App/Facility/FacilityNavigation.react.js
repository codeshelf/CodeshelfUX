import React from 'react';
import Navigation from "../Navigation";
import exposeRouter from 'components/common/exposerouter';

const AuthzMenuItem = Navigation.AuthzMenuItem;
class FacilityNavigation extends React.Component {

  getUXUrl(facility) {
      let uxURL = "/ux/?facilityId=" + facility.get("domainId");
      return uxURL;
  }

  render() {
      var params = this.props.router.getCurrentParams();
      let {facility} = this.props;
      return (<Navigation {...this.props}>
                      <AuthzMenuItem className="m-t-30" to="overview" params={params} title="Overview" iconName="clock-o" />
                      <AuthzMenuItem permission="order:view" to="orders" params={params} title="Orders" iconName="shopping-cart" />
                      <AuthzMenuItem permission="workinstruction:view" to="workinstructions" params={params} title="WorkInstructions" iconName="barcode" />
                      <AuthzMenuItem permission="event:view"  to="blockedwork" params={params} title="Issues" iconName="exclamation-circle"/ >
                      <AuthzMenuItem permission="event:view" to="workresults" params={params} title="Picks By Hour" iconName="pie-chart" />
                      <AuthzMenuItem permission="worker:edit" to="workermgmt" params={params} title="Workers" iconName="users" />
                      {/* TODO: support *:import permissions */}
                      <AuthzMenuItem permission="order:view" to="import" params={params} title="Imports/Exports" iconName="exchange" />
                      <AuthzMenuItem permission="facility:edit" to="extensionpoints" params={params} title="Extensions" iconName="code" />
                      <AuthzMenuItem permission="facility:edit" to="maintenance" params={params} title="Maintenance" iconName="heartbeat" />
                      <AuthzMenuItem permission="ux:view" href={this.getUXUrl(facility)} params={params} title="Configuration" iconName="cogs" />
                      <AuthzMenuItem permission="che:simulate" to="testscript" params={params} title="Test Scripts" iconName="bug" />
                  </Navigation>);
  }

};

export default exposeRouter(FacilityNavigation);
