import React, {Component} from 'react';
import {Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink, ListGroupItemLink} from '../links';
import Icon from "react-fa";

class HomeSearch extends Component {
  render() {
    return (
        <Row>
          <Col>
            <ListGroup>
              <ListGroupItemLink
                    to="mobile-search-orders"
                    id="mobile-search-orders"
                    name="mobile-search-orders">
                <div className="thumbnail-wrapper d48 circular bg-primary text-white inline">
                  <Icon name="shopping-cart" size="lg"/>
                </div>
                <div className="p-l-10 inline">
                  <h3>Orders</h3>
                </div>
              </ListGroupItemLink>
              <ListGroupItemLink
                  to="mobile-search-workers"
                  id="mobile-search-workers"
                  name="mobile-search-workers">
                <div className="thumbnail-wrapper d48 circular bg-primary text-white inline">
                  <Icon name="users" size="lg"/>
                </div>
                <div className="p-l-10 inline">
                  <h3>Workers</h3>
                </div>
              </ListGroupItemLink>
            </ListGroup>
          </Col>
        </Row>
    );
  }
}
export default HomeSearch;
