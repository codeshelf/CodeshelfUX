import React, {Component} from 'react';
import Icon from "react-fa";
import {DropdownButton} from 'react-bootstrap';
import {NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {loggedout} from "data/auth/actions";

export function renderFacilityLabel(facility) {
  if (facility) {
    const {description, timeZoneDisplay} = facility;
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
              return <MenuItemLink
              key={domainId}
              to={desktop ? `/facilities/${domainId}` : `/mobile/facilities/${domainId}`}
              data-persistentid={persistentId}
              onclick={() => this.props.acToggleSidebar(false)}
              shouldHaveFacility={true}>
                {description}
              </MenuItemLink>})
            }
          </DropdownButton>);
      } else {
        return null;
      }
    }
}
