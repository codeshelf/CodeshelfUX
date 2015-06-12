import React from 'react';
import classnames from 'classnames';
import {Link} from 'react-router';
import {NavItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink} from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'components/common/PureComponent';
import exposeRouter from 'components/common/exposerouter';
import {authz} from 'components/common/auth';
import {getSelectedFacility} from 'data/facilities/store';

const AuthzNavItemLink = authz(NavItemLink);
const AuthzNavItem = authz(NavItem);
require('./navigation.styl');




class NavbarHeader extends PureComponent {
    render() {
        let {title = ""}  = this.props;
        return (<div className="sidebar-header">
                  <h3 style={{color: "#ffffff", display: "inline"}}>{title}</h3>
                  <div className="sidebar-header-controls">

                  </div>
                </div>);
    }
}

class MenuItem extends React.Component {

    render() {
        let {title,
             iconName,
             to,
             params,
             query,
             href} = this.props;

        let active = to && this.context.router.isActive(to, params, query);

        var titleRenderer = (<span className="title">{title}</span>);
        var classes = classnames({
            "active": active
        });
        return (<li className={classes}>
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
MenuItem.contextTypes = {
    router: React.PropTypes.func.isRequired
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
                      <AuthzMenuItem to="overview" params={params} title="Overview" iconName="clock-o" />
                      <AuthzMenuItem to="orders" params={params} title="Orders" iconName="shopping-cart" />
                      <AuthzMenuItem permission="event:view"  to="blockedwork" params={params} title="Work Issues" iconName="exclamation-circle"/ >
                      <AuthzMenuItem to="workresults" params={params} title="Work Results" iconName="pie-chart" />
                      <AuthzMenuItem permission="worker:view" to="workermgmt" params={params} title="Manage Workers" iconName="users" />
                      <AuthzMenuItem  to="import" params={params} title="Manage Imports" iconName="upload" />

                      <AuthzMenuItem  to="extensionpoints" params={params} title="Script Extensions" iconName="file-code-o" />

                      <AuthzMenuItem permission="ux:view" href={this.getUXUrl()} params={params} title="Configuration" iconName="cogs" />
                      <AuthzMenuItem permission="che:simulate" to="testscript" params={params} title="Test Scripts" iconName="bug" />
              </ul>
            </div>
        </nav>
    );
  }

};

export default exposeRouter(Navigation);
