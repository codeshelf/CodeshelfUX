import React from 'react';
import {Link} from 'react-router';
import {DropdownButton, NavItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'lib/purecomponent';
import exposeRouter from 'components/common/exposerouter';
import {authz} from 'components/common/auth';
import {getSelectedFacility} from 'data/facilities/store';

const AuthzNavItemLink = authz(NavItemLink);
const AuthzNavItem = authz(NavItem);
require('./navigation.styl');

function renderDropdownLabel(facility) {
    let facilityName = (facility) ? facility.get("name") : "";
    if (facility) {
        return <span><Icon name="building" /> {facilityName}</span>;
    }


}

class NavbarHeader extends PureComponent {
    render() {
        let {title = "",
             facility,
             facilities} = this.props;
        return (<div className="sidebar-header">
                  <h3 style={{color: "#ffffff", display: "inline"}}>{title}</h3>
                  <div className="sidebar-header-controls">
                <DropdownButton className="facility-dropdown" bsStyle="link" title={renderDropdownLabel(facility)}>
                {
                    facilities.map((facility) => {
                        return <MenuItemLink key={facility.get("domainId")} to="facility" params={{facilityName: facility.get("domainId")}}>{facility.get("name")}</MenuItemLink>;
                    })
               }
        </DropdownButton>

                  </div>
                </div>);
    }
}


class MenuItem extends React.Component {

    render() {
        let {title,
             iconName,
             to,
             href} = this.props;
        var titleRenderer = (<span className="title">{title}</span>);
        return (<li >
                  {
                      (to) ?
                          <Link {...this.props}>{titleRenderer}</Link>
                          :
                          <a {...this.props}>{titleRenderer}</a>
                  }
                  <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>
               </li>);
    }
}

const AuthzMenuItem = authz(MenuItem);
class Navigation extends React.Component {

  componentWillMount() {
      document.body.classList.add("fixed-sidebar");
  }

  getUXUrl() {
      let uxURL = "/ux/?facilityId=" + getSelectedFacility().get("domainId");
      return uxURL;
  }

  render() {
      var params = this.props.router.getCurrentParams();
      return (
              <nav className="page-sidebar" dataPages="sidebar" style={{"transform": "translate3d(210px, 0px, 0px)"}} role="navigation">
              <NavbarHeader {...this.props} />
              <div className="sidebar-menu">
                  <ul className="menu-items">
                      <AuthzMenuItem to="overview" params={params} title="Work Overview" iconName="clock-o" />
                      <AuthzMenuItem to="blockedwork" params={params} title="Blocked Work" iconName="exclamation-circle"/ >
                      <AuthzMenuItem to="workresults" params={params} title="WorkResults" iconName="pie-chart" />
                      <AuthzMenuItem permission="worker:view" to="workermgmt" params={params} title="Manage Workers" iconName="users" />
                      <AuthzMenuItem permission="ux:view" href={this.getUXUrl()} params={params} title="Configuration" iconName="cogs" />
              </ul>
            </div>
        </nav>
    );
  }

};

export default exposeRouter(Navigation);
