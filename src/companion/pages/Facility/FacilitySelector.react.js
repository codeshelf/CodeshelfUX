import React, {Component} from 'react';
import Icon from "react-fa";
import {DropdownButton} from 'react-bootstrap';
import {NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {loggedout} from "data/auth/actions";

export function renderFacilityLabel(selected) {
  if (selected.selectedFacility){
    let {description, timeZoneDisplay} = selected.selectedFacility;
    if (selected.selectedCustomer && selected.selectedCustomer !== 'ALL') {
      description = selected.selectedCustomer.name;
    }
    return (<span><Icon name="building" style={{marginRight: ".25em"}}/>{description}({timeZoneDisplay})</span>);
  } else {
    return null;
  }
}

export class FacilitySelector extends React.Component {

    render() {
      let {facility, availableFacilities, desktop} = this.props;
      if (availableFacilities) {
        return (
            <DropdownButton className="facility-dropdown" bsStyle="link" title={renderFacilityLabel(facility)}>
            {availableFacilities.map((facility) => {
              const {name, persistentId, domainId, description} = facility;
              return (<div>
                <MenuItemLink key={domainId}
                               to={desktop ? `/facilities/${domainId}` : `/mobile/facilities/${domainId}/ALL`}
                               data-persistentid={persistentId}
                               onclick={() => this.props.acToggleSidebar(false)}>
                             {description}
                </MenuItemLink>
                {facility.customers.map((customer) => {
                  return (
                    <MenuItemLink key={domainId + customer.domainId}
                                to={`/mobile/facilities/${domainId}/${customer.domainId}`}
                                data-persistentid={customer.persistentId}
                                onClick={() => this.props.acToggleSidebar(false)}>
                      {customer.name}
                    </MenuItemLink>);
                })}
              </div>);})}
          </DropdownButton>);
      } else {
        return null;
      }
    }
}
