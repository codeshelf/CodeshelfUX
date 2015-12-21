import React, {Component} from 'react';
import {Tabs, Tab, Row, Col, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import { NavItemLink, MenuItemLink, ButtonLink} from '../links';
import Icon from "react-fa";

class HomeSearch extends Component {
  render() {
    return (
        <Row>
          <Col>
            <ListGroup>
              <ListGroupItem>
                <ButtonLink bsStyle="link"
                    to="mobile-search-orders"
                    id="mobile-search-orders"
                    name="mobile-search-orders">
                  <div className="thumbnail-wrapper d48 circular bg-primary text-white inline m-t-10">
                    <Icon name="shopping-cart" size="lg"/>
                  </div>
                  <div className="p-l-10 inline p-t-5">
                    <h3 className="m-b-5">Orders</h3>
                  </div>
                </ButtonLink>
              </ListGroupItem>
              <ListGroupItem>
                <ButtonLink bsStyle="link"
                    to="mobile-search-workers"
                    id="mobile-search-workers"
                    name="mobile-search-workers">
                  <div className="thumbnail-wrapper d48 circular bg-primary text-white inline m-t-10">
                    <Icon name="users" size="lg"/>
                  </div>
                  <div className="p-l-10 inline p-t-5">
                    <h3 className="m-b-5">Workers</h3>
                  </div>
                </ButtonLink>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
    );
  }
}
export default HomeSearch;
