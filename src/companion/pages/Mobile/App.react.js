import {Component} from 'react';
import Icon from "react-fa";
import {PageGrid} from 'components/common/pagelayout';
import {Button} from 'react-bootstrap';
import {Link} from '../links';
import {clearStoredCredentials} from "data/user/store";
import {renderContextLabel} from '../Facility/ContextSelector';
import {loggedout} from "data/auth/actions";
import {Navigation, AuthzMenuItem} from '../Sidebar/Navigation';
import exposeRouter from 'components/common/exposerouter';
import {encodeContextToURL} from './common/contextEncode.js';

class Header extends Component {
  render() {
    return (
        <div className="header ">
          <div className="">
            <div className="pull-left full-height visible-sm visible-xs"
                 style={{zIndex: 10, position: "relative"}}>
              <div className="header-inner">
                {this.props.children}
              </div>
            </div>
            <div className="pull-center">
              <div className="header-inner">
                <div className="brand inline">
                  {renderContextLabel(this.props.selected)}
                </div>
              </div>
            </div>

            <div className="pull-right full-height visible-sm visible-xs">
              <div className="header-inner">
              </div>

            </div>
          </div>
        </div>
    );
  }
}

function menuTitle(title) {
  return <span className="title">{title}</span>;
}

class App extends Component {

  sidebarLink(route, title) {
    return (
        <Link
         to={route}
         id={route}
         name={route}
         onClick={() => this.props.acToggleSidebar(false)}
         shouldHaveFacility={true}>
      {menuTitle(title)}
    </Link>
    );
  }

  sidebarFunction(onClick, title) {
    return (
      <a onClick={onClick} href="#">{menuTitle(title)}</a>
    );
  }

  handleLogoutClick(e) {
      e.preventDefault();
      this.props.acToggleSidebar(false);
      clearStoredCredentials();
      loggedout(false);
  }

  render() {
    const basePath = "/mobile/facilities/" +
                     encodeContextToURL(this.props.selected);
    return (
        <div id="outer-wrapper">
          <Navigation
            selected={this.props.selected}
            availableFacilities={this.props.availableFacilities}
            isOpen={this.props.isOpen}
            docked={false}
            acToggleSidebar={this.props.acToggleSidebar}
            >
              <AuthzMenuItem permission="event:view"
                             to={`${basePath}/events`}
                             title="Productivity"
                             onClick={() => this.props.acToggleSidebar(false)}
                             iconName="bar-chart" />
              <AuthzMenuItem permission="event:view"
                             to={`${basePath}/orders`}
                             title="Orders"
                             onClick={() => this.props.acToggleSidebar(false)}
                             iconName="shopping-basket" />
              <AuthzMenuItem permission="event:view"
                             to={`${basePath}/workers`}
                             title="Workers"
                             onClick={() => this.props.acToggleSidebar(false)}
                             iconName="users" />
              <AuthzMenuItem permission="event:view"
                             to={`${basePath}/carts`}
                             title="Carts"
                             onClick={() => this.props.acToggleSidebar(false)}
                             iconName="shopping-cart" />
              <AuthzMenuItem permission="event:view"
                             title="Logout"
                             onClick={(e) => this.handleLogoutClick(e)}
                             iconName="sign-out" />
          </Navigation>
          <div id="page-wrapper"
               className="page-container"
               style={{backgroundColor: "rgb(245, 245, 245)"}}>
              <Header selected={this.props.selected}>
                <Button
                    bsStyle="link"
                    className="visible-sm-inline-block \
                               visible-xs-inline-block padding-5"
                    onClick={() => this.props.acToggleSidebar(true)}>
                      <Icon name="bars" size="lg"/>
                </Button>
              </Header>
              <div className="page-content-wrapper">
                <div className="content">
                  <PageGrid>
                    {this.props.children}
                  </PageGrid>
                </div>
              </div>
          </div>
        </div>
    );
  }
}

export default exposeRouter(App);
