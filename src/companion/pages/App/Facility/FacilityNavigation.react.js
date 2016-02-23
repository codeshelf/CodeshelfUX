import React from 'react';
import {Navigation, Submenu, AuthzMenuItem} from "../../Sidebar/Navigation";
import exposeRouter from 'components/common/exposerouter';

class FacilityNavigation extends React.Component {

  componentWillMount() {
    document.body.classList.add("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
  }

  componentWillUnmount() {
    document.body.classList.remove("fixed-header", "dashboard", "sidebar-visible", "menu-pin");
  }

  getUXUrl(facility) {
    let uxURL = "/ux/?facilityId=" + facility.domainId;
    return uxURL;
  }

  render() {
    const {params, facility} = this.props;
    const {domainId} = facility;
    const basepath = `/facilities/${domainId}`;
    return (
      <Navigation {...this.props} docked={true} desktop={true} availableFacilities={this.props.facilities}>
        <AuthzMenuItem permission="event:view" to={`${basepath}/workresults`} params={params} title="Picks By Hour" iconName="pie-chart" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/ordersearch`} params={params} title="Order" iconName="search" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/cartsearch`} params={params} title="Cart" iconName="search" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/workersearch`} params={params} title="Worker" iconName="search" />
        <AuthzMenuItem permission="event:view"  to={`${basepath}/blockedwork`} params={params} title="Issues" iconName="exclamation-circle"/>
        <AuthzMenuItem permission="worker:edit" to={`${basepath}/workers`} params={params} title="Workers" iconName="users" />
        <AuthzMenuItem permission="order:view" to={`${basepath}/orders`} params={params} title="Planning" iconName="tasks" />
        <Submenu title="History" iconName="cogs">
          <AuthzMenuItem permission="workinstruction:view" to={`${basepath}/workinstructions`} params={params} title="Work Instructions" iconName="barcode" />
          <AuthzMenuItem permission="order:view" to={`${basepath}/import`} params={params} title="Imports/Exports" iconName="exchange" />
        </Submenu>
        <Submenu title="Admin Facility" iconName="cogs">
          {/* TODO: support *:import permissions */}
          <AuthzMenuItem permission="facility:edit" to={`${basepath}/extensionpoints`} params={params} title="Extensions" iconName="code" />
          <AuthzMenuItem permission="facility:edit" to={`${basepath}/maintenance`} params={params} title="Maintenance" iconName="heartbeat" />
          <AuthzMenuItem permission="ux:view" href={this.getUXUrl(facility)} params={params} title="Configuration" iconName="cogs" />
        </Submenu>
        <AuthzMenuItem permission="che:simulate" to={`${basepath}/testscript`} params={params} title="Test Scripts" iconName="bug" />
      </Navigation>);
  }

};

export default exposeRouter(FacilityNavigation);
