import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';
import { NavItemLink, MenuItemLink, ButtonLink} from 'react-router-bootstrap';
import Icon from "react-fa";
import {Grid, Row, Col} from 'react-bootstrap';


class NavigationMenu extends Component {
  render() {
    return (
      <Row>
        <Col xs={2}>
          <ButtonLink bsStyle="link" to="facilities" id="home" name="home">
            <Icon name="home" size="lg"/>
          </ButtonLink>
        </Col>
        <Col xs={8}>
          <h1> Facility name </h1>
        </Col>
        <Col xs={2}>
          <ButtonLink bsStyle="link" to="mobile-search-orders" id="mobile-search-orders" name="mobile-search-orders">
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
        <NavigationMenu />
        <RouteHandler />
      </Grid>
    );
  }
}

export default App;