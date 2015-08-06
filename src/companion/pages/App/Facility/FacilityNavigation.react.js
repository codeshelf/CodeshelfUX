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
                      <AuthzMenuItem to="orders" params={params} title="Orders" iconName="shopping-cart" />
                      <AuthzMenuItem to="workinstructions" params={params} title="WorkInstructions" iconName="barcode" />
                      <AuthzMenuItem permission="event:view"  to="blockedwork" params={params} title="Issues" iconName="exclamation-circle"/ >
                      <AuthzMenuItem permission="event:view" to="workresults" params={params} title="Pick Rates" iconName="pie-chart" />
                      <AuthzMenuItem permission="worker:view" to="workermgmt" params={params} title="Workers" iconName="users" />
                      <AuthzMenuItem  to="import" params={params} title="Imports" iconName="file-text" />
                      <AuthzMenuItem permission="facility:edit" to="extensionpoints" params={params} title="Extensions" iconName="code" />
                      <AuthzMenuItem permission="ux:view" href={this.getUXUrl(facility)} params={params} title="Configuration" iconName="cogs" />
                      <AuthzMenuItem permission="che:simulate" to="testscript" params={params} title="Test Scripts" iconName="bug" />
                  </Navigation>);
  }

};

export default exposeRouter(FacilityNavigation);
