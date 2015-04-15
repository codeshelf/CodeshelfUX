import React from 'react';
import {Link} from 'react-router';
import {DropdownButton} from 'react-bootstrap';
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'lib/purecomponent';
import exposeRouter from 'components/common/exposerouter';

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

  render() {
    var params = this.props.router.getCurrentParams();
    return (
        <nav className="navbar-default navbar-static-side" role="navigation">
            <div id="nav-container" className="sidebar-collapse">
            <ul className="nav" id="side-menu">
            <NavbarHeader {...this.props} />
            <NavItemLink to="overview" params={params}><Icon name="clock-o"></Icon>Work Overview</NavItemLink>
            <NavItemLink to="blockedwork" params={params}><Icon name="exclamation-circle"></Icon>Blocked Work</NavItemLink>
            <NavItemLink to="workresults" params={params}><Icon name="pie-chart"></Icon>Work Results</NavItemLink>
            <NavItemLink to="workermgmt" params={params}><Icon name="users"></Icon>Worker Management</NavItemLink>
            <NavItemLink to="import" params={params}><Icon name="upload"></Icon>Import</NavItemLink>
            </ul>
            </div>
        </nav>
    );
  }

};

export default exposeRouter(Navigation);
