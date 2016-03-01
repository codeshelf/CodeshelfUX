import React, {Component} from 'react';
import Icon from "react-fa";
import {DropdownButton} from 'react-bootstrap';
import {NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {loggedout} from "data/auth/actions";

export function renderContextLabel(selected) {
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

export class ContextSelector extends React.Component {
    closeSidebar() {
      this.props.acToggleSidebar(false);
    }

    render() {
        const {selected, availableFacilities, desktop, closeSidebar} = this.props;
        const basePath = (desktop) ? '' : '/mobile';
        return (<DropdownButton className="facility-dropdown" bsStyle="link" title={renderContextLabel(selected)}>
                <div className="sidebar-menu" style={{maxHeight: '500', overflowY: 'scroll',width: '200'}}>
                {
                    availableFacilities.map((facility) => {
                        const {name, persistentId, domainId, description} = facility;
                        return (<ul style={{listStyleType: 'none', paddingLeft: 15, paddingTop: 3}}>
                              <MenuItemLink key={domainId}
                                             to={`${basePath}/facilities/${domainId}/customers/ALL`}
                                             data-persistentid={persistentId}
                                             onClick={closeSidebar}
                                             shouldHaveFacility={true}>
                                 {description}
                               </MenuItemLink>
                               <ul style={{listStyleType: 'none', paddingLeft: 25}}>
                             {facility.customers.map((customer) => {
                              return (
                                <MenuItemLink key={domainId + customer.domainId}
                                               to={`${basePath}/facilities/${domainId}/customers/${customer.domainId}`}
                                               data-persistentid={customer.persistentId}
                                               onClick={closeSidebar}
                                               shouldHaveFacility={true}
                                               style={{paddingTop: 3}}
                                              >
                                   {customer.name}
                                 </MenuItemLink>
                              )
                             })}
                              </ul>
                             </ul>
                          )
                    })
               }
               </div>
        </DropdownButton>);
    }
}
