import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';
import Icon from "react-fa";
import {Grid, Row, Col} from 'react-bootstrap';

import { NavItemLink, MenuItemLink, ButtonLink} from './links';


class NavigationMenu extends Component {
  render() {
    console.log("Render navigation menu", this.props.facility);
    return (
      <Row>
        <Col xs={2}>
          <ButtonLink bsStyle="link" to="facilities" id="home" name="home">
            <Icon name="home" size="lg"/>
          </ButtonLink>
        </Col>
        <Col xs={8}>
          <h1>{this.props.facility.description}</h1>
        </Col>
        <Col xs={2}>
          <ButtonLink bsStyle="link"
                      to="mobile-search-orders"
                      id="mobile-search-orders"
                      name="mobile-search-orders"
                      params={{facilityName: this.props.facility.persistentId}}>
            <Icon name="search" size="lg"/>
          </ButtonLink>
        </Col>
      </Row>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Grid>
        <NavigationMenu facility={this.props.facility}/>
        <RouteHandler />
      </Grid>
    );
  }
}

export default App;