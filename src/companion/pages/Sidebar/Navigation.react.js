import React, {Component} from 'react';
import Icon from "react-fa";
import {Grid, Row, Col, DropdownButton, Button} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink, Link} from '../links';
import {Link as OrdinaryLink} from '../../links';
import {FacilitySelector, renderFacilityLabel} from '../Facility/FacilitySelector';
import Sidebar from './Sidebar';
import classnames from 'classnames';
import exposeRouter from 'components/common/exposerouter';
import {authz} from 'components/common/auth';
import _ from "lodash";

require('./navigation.styl');

class MenuItem extends Component {

    render() {
        let {
             normalLinks,
             title,
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
                          normalLinks ?
                          <OrdinaryLink {...propsToPass} activeClass="active">{titleRenderer}</OrdinaryLink> :
                          <Link {...propsToPass} activeClass="active">{titleRenderer}</Link> :
                          <a {...propsToPass}>{titleRenderer}</a>
                  }
                  <span className="icon-thumbnail"><Icon name={iconName}></Icon></span>
               </li>);
    }
}

export const AuthzMenuItem = authz(MenuItem);

export class Submenu extends Component {

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

MenuItem.contextTypes = {
  router: React.PropTypes.object.isRequired
};

class NavigationDump extends Component {

    getSidebarContent() {
      return (
        <nav className="page-sidebar visible" data-pages="sidebar">
          <div className="sidebar-header">
            {this.props.hideFacilitySelector || <FacilitySelector availableFacilities={this.props.availableFacilities} facility={this.props.facility} desktop={this.props.desktop}/>}
          </div>
          <div className="m-t-30 sidebar-menu">
            <ul className="menu-items">
              {this.props.children}
            </ul>
          </div>
        </nav> 
      )

    }

    render() {
      return(
          <Sidebar sidebar={this.getSidebarContent()}
            open={this.props.isOpen}
            docked={this.props.docked}
            onSetOpen={(open) => this.props.acToggleSidebar(open)}
            style={{
              sidebar: {
                zIndex: 999,
                width: 250,
              },
              overlay: {
                zIndex: 998,
              }
            }}>
          </Sidebar>
      )
    }
}

export const Navigation = exposeRouter(NavigationDump);
