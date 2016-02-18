import React from 'react';
import classnames from 'classnames';
import {Link} from 'react-router';
import Icon from 'react-fa';
import PureComponent from 'components/common/PureComponent';
import exposeRouter from 'components/common/exposerouter';
import {authz} from 'components/common/auth';
import {getSelectedFacility} from 'data/facilities/store';
import _ from "lodash";


require('./navigation.styl');

export class Submenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    return (
      <li className={this.state.expanded ? "open": null}>
        <a>
          <span onClick={() => this.toggleExpand()} className="title">{this.props.title}</span>
          <span className={this.state.expanded ? "arrow open active": "arrow"}></span>
        </a>
        <span className="icon-thumbnail"><Icon name={this.props.iconName}></Icon></span>
        <ul className="sub-menu" style={{ display: this.state.expanded ? "block": "none"}}>
            {this.props.children}
        </ul>
      </li>
    )
  }
}

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
             className, location} = this.props;

        const active = to && this.context.router.isActive(to);
        var titleRenderer = (<span className="title">{title}</span>);

        var classes = classnames(className, {
            "active": active
        });

        var propsToPass = _.clone(this.props);
        delete propsToPass.className; //pass everything but className

        return (<li className={classes}>
                  {
                      (to) ?
                          <Link {...propsToPass}  activeClass="active">{titleRenderer}</Link>
                          :
                          <a {...propsToPass}>{titleRenderer}</a>
                  }
                  <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>
               </li>);
    }
}

MenuItem.contextTypes = {
  router: React.PropTypes.object.isRequired
};

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
export const Nav = NavigationWithRouter;
