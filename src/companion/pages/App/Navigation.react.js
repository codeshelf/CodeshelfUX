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
import _ from "lodash";


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
             href,
             className} = this.props;

        let active = to && this.context.router.isActive(to, params, query);

        var titleRenderer = (<span className="title">{title}</span>);

        var classes = classnames(className, {
            "active": active
        });

        var propsToPass = _.clone(this.props);
        delete propsToPass.className; //pass everything but className

        return (<li className={classes}>
                  {
                      (to) ?
                          <Link {...propsToPass}>{titleRenderer}</Link>
                          :
                          <a {...propsToPass}>{titleRenderer}</a>
                  }
                  <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>
               </li>);
    }
}
MenuItem.contextTypes = {
    router: React.PropTypes.func.isRequired
}

class Navigation extends React.Component {
  componentWillMount() {
      document.body.classList.add("fixed-sidebar");
  }

  componentWillUnmount() {
    document.body.classList.remove("fixed-sidebar");
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
                      {this.props.children}
              </ul>
            </div>
        </nav>
    );
  }

};

var NavigationWithRouter = exposeRouter(Navigation);
NavigationWithRouter.AuthzMenuItem = authz(MenuItem);
export default NavigationWithRouter;
