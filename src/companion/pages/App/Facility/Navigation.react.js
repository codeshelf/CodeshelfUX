import React from 'react';
import {Link} from 'react-router';
import {DropdownButton, NavItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'lib/purecomponent';
import exposeRouter from 'components/common/exposerouter';
import {authz} from 'components/common/auth';

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
        return (<li className="nav-header">
                    <div className="dropdown profile-element">
                        <h1 className="block" style={{marginTop: 5, textOverflow: "ellipsis", overflow: "hidden"}}>{title}</h1>
                        <DropdownButton className="facility-dropdown" bsStyle="link" title={renderDropdownLabel(facility)}>
                            {
                                facilities.map((facility) => {
                                    return <MenuItemLink key={facility.get("domainId")} to="facility" params={{facilityName: facility.get("domainId")}}>{facility.get("name")}</MenuItemLink>;
                                })
                            }
                        </DropdownButton>
                    </div>
                <div className="logo-element"> {/**when collapsed**/}
                CS
                </div>
                </li>);
    }
}

class Navigation extends React.Component {

  componentWillMount() {
      document.body.classList.add("fixed-sidebar");
  }

  render() {
    var params = this.props.router.getCurrentParams();
    return (
        <nav className="navbar-default navbar-static-side" role="navigation">
            <div id="nav-container" className="sidebar-collapse" style={{overflowX: "hidden", overflowY: "hidden" }}>
            <ul className="nav" id="side-menu">
                <NavbarHeader {...this.props} />
               <AuthzNavItemLink to="overview" params={params}><Icon name="clock-o"></Icon>Work Overview</AuthzNavItemLink>
               <AuthzNavItemLink to="blockedwork" params={params}><Icon name="exclamation-circle"></Icon>Blocked Work</AuthzNavItemLink>
               <AuthzNavItemLink to="workresults" params={params}><Icon name="pie-chart"></Icon>Work Results</AuthzNavItemLink>
               <AuthzNavItemLink permission="worker:view" to="workermgmt" params={params}><Icon name="users" />Manage Workers</AuthzNavItemLink>
               <AuthzNavItem permission="ux:view" href="/ux" params={params}><Icon name="cogs"></Icon>Configuration</AuthzNavItem>)
               {/*<NavItemLink to="import" params={params}><Icon name="upload"></Icon>Import</AuthzNavItemLink>*/}
            </ul>
            </div>
        </nav>
    );
  }

};

export default exposeRouter(Navigation);
