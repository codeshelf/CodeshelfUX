import React from 'react';
import { NavItemLink } from 'react-router-bootstrap';
import Icon from 'react-fa';
import PureComponent from 'lib/purecomponent';
import exposeRouter from 'components/common/exposerouter';

require('./navigation.styl');

class NavbarHeader extends PureComponent {
    render() {
        var title = this.props.title;
        var facilityName = (title) ? title : "";
        return (<div className="nav-header">
                    <div className="profile-element">
                        <h1 className="block" style={{textOverflow: "ellipsis", overflow: "hidden"}}>{facilityName}</h1>
                        <span className="block m-t-xs">
                            <strong className="font-bold">{""}</strong>
                        </span>
                    </div>
                <div className="logo-element"> {/**when collapsed**/}
                CS
                </div>
                </div>);
    }
}

class Navigation extends React.Component {

  render() {
    var params = this.props.router.getCurrentParams();
    return (
        <nav className="navbar-default navbar-static-side" role="navigation">
            <div id="nav-container" className="sidebar-collapse">
            <ul className="nav" id="side-menu">
            <NavbarHeader title={this.props.title} />
            <NavItemLink to="overview" params={params}><Icon name="clock-o"></Icon>Work Overview</NavItemLink>
            <NavItemLink to="blockedwork" params={params}><Icon name="exclamation-circle"></Icon>Blocked Work</NavItemLink>
            <NavItemLink to="workresults" params={params}><Icon name="pie-chart"></Icon>Work Results</NavItemLink>
            <NavItemLink to="workermgmt" params={params}><Icon name="users"></Icon>Manage Workers (demo) </NavItemLink>
            {/*<NavItemLink to="import" params={params}><Icon name="upload"></Icon>Import</NavItemLink>*/}
            </ul>
            </div>
        </nav>
    );
  }

};

export default exposeRouter(Navigation);
