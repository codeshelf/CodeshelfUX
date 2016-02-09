import React from 'react';
import Navigation from "../Navigation";
import exposeRouter from 'components/common/exposerouter';

const AuthzMenuItem = Navigation.AuthzMenuItem;
class FacilityNavigation extends React.Component {

  getUXUrl(facility) {
    let uxURL = "/ux/?facilityId=" + facility.domainId;
    return uxURL;
  }

  render() {
    const {params, facility} = this.props;
    const {domainId} = facility;
    const basepath = `/facilities/${domainId}`;
    return (
      <Navigation {...this.props}>
        <AuthzMenuItem permission="event:view" to={`${basepath}/workresults`} params={params} title="Picks By Hour" iconName="pie-chart" />
        <AuthzMenuItem permission="order:view" to={`${basepath}/orders`} params={params} title="Orders" iconName="shopping-cart" />
        <AuthzMenuItem permission="workinstruction:view" to={`${basepath}/workinstructions`} params={params} title="Work Instructions" iconName="barcode" />
        <AuthzMenuItem permission="event:view"  to={`${basepath}/blockedwork`} params={params} title="Issues" iconName="exclamation-circle"/ >
        <AuthzMenuItem permission="worker:edit" to={`${basepath}/workermgmt`} params={params} title="Workers" iconName="users" />
        {/* TODO: support *:import permissions */}
        <AuthzMenuItem permission="order:view" to={`${basepath}/import`} params={params} title="Imports/Exports" iconName="exchange" />
        <AuthzMenuItem permission="facility:edit" to={`${basepath}/extensionpoints`} params={params} title="Extensions" iconName="code" />
        <AuthzMenuItem permission="facility:edit" to={`${basepath}/maintenance`} params={params} title="Maintenance" iconName="heartbeat" />
        <AuthzMenuItem permission="ux:view" href={this.getUXUrl(facility)} params={params} title="Configuration" iconName="cogs" />
        <AuthzMenuItem permission="che:simulate" to={`${basepath}/testscript`} params={params} title="Test Scripts" iconName="bug" />
      </Navigation>);
  }

};

export default exposeRouter(FacilityNavigation);
