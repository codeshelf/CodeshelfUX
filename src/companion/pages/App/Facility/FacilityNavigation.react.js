import React from 'react';
import {Navigation, Submenu, AuthzMenuItem} from "../../Sidebar/Navigation";
import exposeRouter from 'components/common/exposerouter';
import {encodeContextToURL} from '../../Mobile/common/contextEncode.js';

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
    const {params, selected} = this.props;
    const {selectedFacility} = selected;
    const basepath = "/facilities/" + encodeContextToURL(this.props.selected);
    return (
      <Navigation {...this.props} docked={true} desktop={true} availableFacilities={this.props.facilities}>
        <AuthzMenuItem permission="event:view" to={`${basepath}/workresults`} params={params} title="Productivity" iconName="bar-chart" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/ordersearch`} params={params} title="Orders" iconName="shopping-basket" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/cartsearch`} params={params} title="Carts" iconName="shopping-cart" />
        <AuthzMenuItem permission="ux:view" to={`${basepath}/workersearch`} params={params} title="Workers" iconName="users" />
        <AuthzMenuItem permission="event:view"  to={`${basepath}/blockedwork`} params={params} title="Issues" iconName="exclamation-circle"/>
        <Submenu title="Planning" iconName="tasks">
          <AuthzMenuItem permission="order:view" to={`${basepath}/orders`} params={params} title="Planning" iconName="shopping-basket" />
          <AuthzMenuItem permission="workinstruction:view" to={`${basepath}/workinstructions`} params={params} title="Work Instructions" iconName="barcode" />
          <AuthzMenuItem permission="facility:edit" to={`${basepath}/templates`} params={params} title="Printing Templates" iconName="print" />
        </Submenu>
        <Submenu title="Administration" iconName="cogs">
          {/* TODO: support *:import permissions */}
          <AuthzMenuItem permission="order:view" to={`${basepath}/import`} params={params} title="Imports/Exports" iconName="exchange" />
          <AuthzMenuItem permission="worker:edit" to={`${basepath}/workers`} params={params} title="Workers" iconName="users" />
          <AuthzMenuItem permission="facility:edit" to={`${basepath}/extensionpoints`} params={params} title="Extensions" iconName="code" />
          <AuthzMenuItem permission="facility:edit" to={`${basepath}/scheduledjobs`} params={params} title="Schedule" iconName="clock-o" />

          <AuthzMenuItem permission="facility:edit" to={`${basepath}/maintenance`} params={params} title="Maintenance" iconName="heartbeat" />
          <AuthzMenuItem permission="ux:view" href={this.getUXUrl(selectedFacility)} params={params} title="Advanced" iconName="magic" />
        </Submenu>
        <AuthzMenuItem permission="che:simulate" to={`${basepath}/testscript`} params={params} title="Test Scripts" iconName="bug" />
      </Navigation>);
  }

};

export default exposeRouter(FacilityNavigation);
