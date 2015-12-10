import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';
import Icon from "react-fa";
import {Grid, Row, Col, DropdownButton} from 'react-bootstrap';

import { NavItemLink, MenuItemLink, ButtonLink} from './links';

class NavigationMenu extends Component {
  render() {
    console.log("Render navigation menu", this.props.facility);
    return (
      <div className="header" style={{height: 48}}>
{/**
       <div className="pull-left full-height">
          <div className="sm-action-bar">
            <ButtonLink bsStyle="link" to="facility" id="home" name="home">
              <Icon name="home" size="lg"/>
            </ButtonLink>
          </div>
        </div>
  **/}
        <div className="pull-right full-height">
          <div className="sm-action-bar">
            <ButtonLink bsStyle="link"
              to="mobile-search-orders"
              id="mobile-search-orders"
              name="mobile-search-orders">
                <Icon name="search" size="lg"/>
            </ButtonLink>
        </div>
        </div>
        <div className="pull-right sm-table">
          <div className="header-inner" style={{height: 48}}>
            <div className="brand inline">
              {this.props.children}

            </div>
          </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
        <div id="page-wrapper" className="page-container" style={{backgroundColor: "rgb(245, 245, 245)"}}>
            <NavigationMenu facility={this.props.facility}>
                <FacilitySelector {...this.props} />
            </NavigationMenu>
            <div className="page-content-wrapper">
              <div className="content">
                <Grid fluid className="sm-padding-10">
                  <RouteHandler />
                </Grid>
              </div>
            </div>
        </div>
    );
  }
}

export default App;



class FacilitySelector extends React.Component {

    renderDropdownLabel(facility) {
        if (facility) {
          const {description, timeZoneDisplay} = facility;
            return (<span><Icon name="building" />{description}({timeZoneDisplay})</span>);
        } else {
            return null;
        }
    }

    render() {
        let {facility, availableFacilities} = this.props;
        return (<DropdownButton className="facility-dropdown" bsStyle="link" title={this.renderDropdownLabel(facility)}>
                {
                    availableFacilities.map((facility) => {
                        const {name, persistentId, domainId, description} = facility;

                        return <MenuItemLink key={domainId}
                                             to="mobile-facility"
                                             params={{facilityName: domainId}}
                                             data-persistentid={persistentId}>
                                         {description}
                               </MenuItemLink>;
                    })
               }
        </DropdownButton>);
    }
}
